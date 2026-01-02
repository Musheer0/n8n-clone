"use client"

import { HistoryIcon, KeyIcon, WorkflowIcon } from "lucide-react"

export const routes = [
    {
        name:'workflows',
        href:"/workflows",
        icon:WorkflowIcon
    },
    {
        name:'credentials',
        href:"/credentials",
        icon:KeyIcon
    },
    {
        name:'executions',
        href:"/executions",
        icon:HistoryIcon
    },
]
import React, { Suspense } from 'react'
import {  SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import UserButtonSidebar from "./user-button-sidebar"

const AppSideBarLinks = () => {
    const pathname = usePathname()
  return (
   <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarGroupLabel>
                        General
                    </SidebarGroupLabel>
                   <SidebarMenu>
                     {routes.map((route,i)=>{
                        const isActive = pathname.includes(route.href)
                        return (
                            <React.Fragment key={i}>
                                <SidebarMenuItem>
                                  <Link href={route.href}>
                                    <SidebarMenuButton isActive={isActive} >
                                        <route.icon/>
                                        {route.name}
                                    </SidebarMenuButton>
                                  </Link>
                                </SidebarMenuItem>
                            </React.Fragment>
                        )
                    })}
                   </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
  )
}

export default AppSideBarLinks
