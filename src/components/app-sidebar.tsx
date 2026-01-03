

import React, { Suspense } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar"
import Image from "next/image"
import UserButtonSidebar from "./user-button-sidebar"
import AppSideBarLinks from "./app-sidebar-links"
import { ModeToggle } from './mode-toggle'

const AppSideBar = () => {
  return (
    <Sidebar collapsible='icon'>
        <SidebarRail/>
        <SidebarHeader className="flex items-center gap-2 flex-row group-data-[collapsible=icon]:justify-center">
            <Image src={'/vercel.svg'} alt="logo" width={12} height={12}/>
            <p className="text-sm font-black  group-data-[collapsible=icon]:hidden">N8N</p>
        </SidebarHeader>
        <SidebarContent>
           <AppSideBarLinks/>
           <ModeToggle/>
        </SidebarContent>
            <SidebarFooter>
                <Suspense fallback="loading">
                    <UserButtonSidebar></UserButtonSidebar>
                </Suspense>
            </SidebarFooter>
    </Sidebar>
  )
}

export default AppSideBar
