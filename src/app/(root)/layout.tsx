import AppSideBar from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TRPCReactProvider } from '@/trpc/client';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TRPCReactProvider>
      <AppSideBar/>
      <SidebarTrigger></SidebarTrigger>
    {children}
    </TRPCReactProvider>
    </SidebarProvider>
  );
};

export default Layout;