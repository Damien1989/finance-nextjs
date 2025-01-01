"use client"

import React, { useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'

const page = () => {

    const { user } = useUser()
    const [budgetName, setBudgetName] = useState<string>("")
    const [budgetAmount, setBudgetAmount] = useState<string>("")

  return (
<Wrapper>Hello</Wrapper>
  )
}

export default page