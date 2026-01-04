"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { GithubIcon } from 'lucide-react'

const GithubLoginButton = () => {
  return (
           <Button  className='w-full max-w-sm my-7' 
           onClick={()=>authClient.signIn.social({provider:"github"})}
        variant={"outline"}
     
        >
            Continue with Github <GithubIcon/>
        </Button>
  )
}

export default GithubLoginButton
