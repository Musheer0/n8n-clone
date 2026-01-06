import db from "@/db";
import { tworkflow } from "@/db/types/workflow";
import { inngest } from "@/inngest/client";
import { getOneWorkflowKey } from "@/redis/keys/workflows";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { workflows } from "../../../../../../drizzle/schema";

export const POST = async(req:NextRequest)=>{
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams
    const workflow_id = searchParams.get('workflow');
    if(!workflow_id ) return NextResponse.json({error:'invalid workflow id'},{status:400});
    const w = await checkCacheAndQuery<tworkflow>(getOneWorkflowKey(workflow_id),()=>{
        return db.query.workflows.findFirst({
            where:eq(workflows.id,workflow_id)
        })
    },{cache:true});
    if(!w) return NextResponse.json({error:'workflow not found'},{status:404});
      await inngest.send({
        name:"execute/workflow",
        data:{
          user:{id:w.user_id},
          workflow_id:w.id,
          webhook:body
        }
      })
    return NextResponse.json({success:true},{status:200})
}