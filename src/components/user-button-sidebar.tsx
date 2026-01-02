import { requireAuth } from '@/lib/auth'
import { LogOutIcon, UserIcon } from 'lucide-react';
import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import LogoutButton from './auth/logout-button';

const SidebarUser = async() => {
    const auth = await requireAuth();
  return (
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger
                asChild>
            <SidebarMenuButton
            >             
                         <UserIcon/>
    <p>{auth.user.name}</p>     
            </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-fit '>
                    <p className='p-4 text-nowrap'>Signed in as <br/><strong>{auth.user.email}</strong></p>
                   <LogoutButton variant={'ghost'} className='w-full'>
  <LogOutIcon/>
                        <DropdownMenuLabel>
                            Logout
                        </DropdownMenuLabel>
                   </LogoutButton>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarUser