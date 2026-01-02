import next from "next";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async(req:NextRequest,)=>{
  return NextResponse.next()
}