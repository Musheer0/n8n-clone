"use client"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tCredentailsType, tcredentials } from '@/db/types/credentials'
import { CreateCredentialAlertDialog } from "@/features/credentials/components/create-credential"
import RenderCredentialIcon from "@/features/credentials/components/render-credential-icon"
import { useCredentialsByType } from '@/hooks/use-credentials-hook'
import { PlusCircleIcon } from "lucide-react"
import React from 'react'

const CredentialsSelector = ({type,onSelect,value}:{type:tCredentailsType,onSelect:(data:tcredentials)=>void,value?:string}) => {
    const {data,isPending} = useCredentialsByType(type)

  if(isPending)
    return <div className='w-full h-10 bg-muted-foreground/20 animate-pulse my-1 rounded-xl'></div>
  if(data)
  return (
  <Select
  defaultValue={value}
  onValueChange={(e)=>onSelect(data.find((d)=>d.id===e)!)}
  >
  <SelectTrigger className="w-fulll my-2">
    <SelectValue placeholder="Select App Password" />
  </SelectTrigger>
  <SelectContent>
    {data?.map((c)=>{
        return <React.Fragment key={c.id}>
                <SelectItem value={c.id}>
                    <RenderCredentialIcon type={type} className="size-4"/>
                    {c.name}
                </SelectItem>

        </React.Fragment>
    })}

   <CreateCredentialAlertDialog type={type}>
     <Button className="w-full my-0.5" variant={"ghost"}>Create New <PlusCircleIcon/></Button>
   </CreateCredentialAlertDialog>

  </SelectContent>
</Select>
  )
}

export default CredentialsSelector
