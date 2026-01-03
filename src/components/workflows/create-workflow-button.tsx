"use client"

import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,AlertDialogContent, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2Icon, PlusIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreateWorkflowButton = ({children}:{children:React.ReactNode}) => {
    const trpc = useTRPC();
    const [open ,setOpen] =useState(false);
    const [name ,setName] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter()
    const {mutate, isPending ,isError} = useMutation(trpc.workflow.create.mutationOptions({
        onError:(data)=>{
            toast.error(data.message);
             setOpen(false);
        },
        onSuccess:(data)=>{
            const queryKey = trpc.workflow.getOne.queryKey({id:data.id});
            queryClient.setQueryData(queryKey,data)
            setOpen(false);
            toast.success(`redirecting to workflow ${data.name}`);
            router.push(`/workflows/${data.id}`)
        }
    }))
  return (
   <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
        {children}
    </AlertDialogTrigger> 
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Create Workflow
            </AlertDialogTitle>
        </AlertDialogHeader>
        <div className='flex flex-col  gap-1'>
            <Label>
                Name 
            </Label>
            <Input
            value={name}
            disabled={isPending}
            onChange={(e)=>setName(e.target.value)}
            placeholder='enter a name for your workflow'/>
            {isError && <p className='text-sm text-destructive '>Somthing went wrong try again...</p>}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel
            className='bg-transparent border-0 p-0'
            >
                <Button 
                disabled={isPending}
                variant={"destructive"}
                >
               <XIcon/>
               Cancle
               </Button>
            </AlertDialogCancel>
            <Button 
                disabled={isPending}
                onClick={()=>mutate({name})}
                >
               {isPending ?
            <Loader2Icon className='animate-spin'/>   
            :
            <>
            <PlusIcon/>
               Create
            </>
            }
               </Button>
        </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>
  )
}

export default CreateWorkflowButton
