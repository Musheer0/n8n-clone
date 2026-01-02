import GithubLoginButton from '@/components/auth/github-login-button'
import { Button } from '@/components/ui/button'
import { requireUnAuth } from '@/lib/auth'
import { GithubIcon } from 'lucide-react'
import React from 'react'

const page = async() => {
  await requireUnAuth()
  return (
    <div className='w-full h-screen flex items-center'>
      <div className='flex-1 h-full bg-muted-foreground/10 sm:flex hidden'></div>
      <div className="flex-1 h-full p-10 flex flex-col items-center"  >
        <div className="header w-full mx-auto pb-20">
            <p className='text-sm font-black'>N8N</p>
        </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="info pb-2 w-full max-w-sm">
            <p className='text-xl font-bold leading-none'>
                Welcome Back 
            </p>
            <p className='text-xs text-muted-foreground leading-none'>Lets Get Started</p>
        </div>
        <div className="banner w-full max-w-sm h-40 bg-muted-foreground rounded-xl overflow-hidden">
            <img src="https://media.tenor.com/r3XdvPsAV3kAAAAM/despicable-me-minions.gif" alt="login banner gif" className='w-full h-full object-cover' />
        </div>
        <GithubLoginButton/>
      </div>
      </div>
    </div>
  )
}

export default page
