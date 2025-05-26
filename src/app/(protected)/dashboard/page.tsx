'use client';

import { useUser } from '@clerk/nextjs';
import React from 'react'

const DashboardPage = () => {
    const { user } = useUser();
    console.log(user);
    
  return (
    <h2 className='text-foreground'>
      {user?.firstName}
    </h2>
  )
}

export default DashboardPage;