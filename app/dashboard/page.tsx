"use client"

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { getTotalTransactionAmount } from '../actions';
import Wrapper from '../components/Wrapper';

    const page = () => {
        const { user } = useUser();
        const [totalAmount, setTotalAmount] = useState<number | null>(null)
        const [isLoading, setIsLoading] = useState(true);

        const fetchData = async () => {
            setIsLoading(true)
        try {
            const email = user?.primaryEmailAddress?.emailAddress as string
                    const amount = await getTotalTransactionAmount(email)
                    setTotalAmount(amount)
        } catch (error) {
            console.log("Erreur lors de la récupération des données", error)
        }

        useEffect(() => {
            fetchData()
        }, [user])


  return (
    <Wrapper>page</Wrapper>
  )
}
    }
export default page