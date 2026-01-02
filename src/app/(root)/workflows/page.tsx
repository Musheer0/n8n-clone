"use client"
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const page = () => {
  const trpc = useTRPC()
  const {data} = useQuery(trpc.hello.queryOptions({text:"hello"}))
  return (
    <div>
      {JSON.stringify(data)}

    </div>
  )
}

export default page
