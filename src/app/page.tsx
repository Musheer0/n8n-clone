import LogoutButton from '@/components/auth/logout-button'
import { requireAuth } from '@/lib/auth'
import React from 'react'

const page = async() => {
  await requireAuth()
  return (
    <div>
      
    </div>
  )
}

export default page
