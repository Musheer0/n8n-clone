"use client"
import React, { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { VariantProps } from 'class-variance-authority'
import { buttonGroupVariants } from '@/components/ui/button-group'
type btnProps = {
  children:React.ReactNode,
  loading_state?:React.ReactNode,
}
const LogoutButton = ({children,loading_state,...props}:React.ComponentProps<"button"> & btnProps & VariantProps<typeof buttonVariants>) => {
    const [isLoading ,setIsLoading] = useState(false);
    const handleClick = async()=>{
        try {
         setIsLoading(true);
        await authClient.signOut();
        window.location.reload()
        } catch  {
         toast.error("somthing went wrong try again")   
        }
        finally{
        setIsLoading(false);
        }
    }
  return (
    <Button
    {...props}
    
    disabled={isLoading}
    onClick={handleClick}
    >
     {isLoading ?
    <>
    {loading_state ? loading_state :"loging out..."}
    </>
    :
    children 
    }
    </Button>
  )
}

export default LogoutButton
