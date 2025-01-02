"use client"
import { getTrasactionsByBudgetId } from '@/app/actions'
import BudgetItem from '@/app/components/BudgetItem'
import { Budget } from '@/type'
import React, {useEffect, useState } from 'react'

const page = ({ params }: { params: Promise<{ budgetId: string }> }) => {

  const [budgetId, setBudgetId] = useState<string>('')
  const [budget, setBudget] = useState<Budget>()


  async function fetchBudgetData(budgetId : string){
      try {
        if(budgetId){
          const budgetData  = await getTrasactionsByBudgetId(budgetId)
          setBudget(budgetData)
        }

        } catch (error) {
        console.error(
          "Erreur lors de la récupération du budget et des transactions:",
           error)
        }
      }


      useEffect(() => {
      const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId)
      fetchBudgetData(resolvedParams.budgetId)
  }
}, [params])


  return (
    <div>
        {budget && (
          <BudgetItem budget={budget} enableHover={0} />
        )}

    </div>
  )
}

export default page