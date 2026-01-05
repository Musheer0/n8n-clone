import z from "zod";

export const executeWorkflowSchema = z.object({
    user:z.object({email:z.string(),id:z.string()}),
    nodes:z.array(z.object({
        name:z.string(),
        data:z.json(),
        type:z.string(),
        id:z.string(),
        workflow_id:z.string()
    }))
})