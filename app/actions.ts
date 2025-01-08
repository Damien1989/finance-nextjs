'use server'

import prisma from "./lib/prisma"
import { Budget, Transaction } from "@/type";

export async function checkAndAddUser(email: string | undefined) {
    if (!email) return;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            await prisma.user.create({ data: { email } });
            console.log("Nouvel utilisateur ajouté dans la base de données");
        } else {
            console.log("Utilisateur déjà présent dans la base de données");
        }

    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
}

export async function addBudget(email: string, name: string, amount: number, emoji: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        await prisma.budget.create({
            data: {
                name,
                amount,
                emoji,
                userId: user.id
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du budget :", error);
        throw error;
    }
}

export async function getBudgetsByUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        return user.budgets;
    } catch (error) {
        console.error("Erreur lors de la récupération des budgets :", error);
        throw error;
    }

}

export async function getTransactionsByBudgetId(budgetId: string) {
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })
        if(!budget) {
            throw new Error('Budget non trouvé.');
        }

        return budget;
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}

export async function addTransactionToBudget(
    budgetId: string,
    amount: number,
    description: string

) {
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })

        if (!budget) {
            throw new Error('Budget non trouvé.');
        }

        const totalTransactions = budget.transactions.reduce((sum, transaction) => {
            return sum + transaction.amount
        }, 0)

        const totalWithNewTransaction = totalTransactions + amount

        if (totalWithNewTransaction > budget.amount) {
            throw new Error('Le montant total des transactions dépasse le montant du budget.');
        }

        const newTransaction = await prisma.transaction.create({
            data: {
                amount,
                description,
                emoji: budget.emoji,
                budget: {
                    connect: {
                        id: budget.id
                    }
                }
            }
        })

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la transaction:', error);
        throw error;
    }
}

export const deleteBudget = async (budgetId: string) => {
    try {
        await prisma.transaction.deleteMany({
            where: { budgetId }
        })

        await prisma.budget.delete({
            where: {
                id: budgetId
            }
        })
    } catch (error) {
        console.error('Erreur lors de la suppression du budget et de ses transactions associées: ', error);
        throw error;
    }
}

export async function deleteTransaction(transactionId: string) {
    try {
        console.log(" id de la transact", transactionId)
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        })

        if (!transaction) {
            throw new Error('Transaction non trouvée.');
        }

        await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la transaction:', error);
        throw error;
    }
}

export async function getTransactionsByEmailAndPeriod(email: string, period: string) {
    try {
        const now = new Date();
        let dateLimit

        switch (period) {
            case 'last30':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 30);
                break
            case 'last90':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 90);
                break
            case 'last7':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 7);
                break
            case 'last365':
                dateLimit = new Date(now)
                dateLimit.setFullYear(now.getFullYear() - 1);
                break
            default:
                throw new Error('Période invalide.');
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: {
                            where: {
                                createdAt: {
                                    gte: dateLimit
                                }
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }

                }
            }
        })


        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }

        const transactions = user.budgets.flatMap(budget =>
            budget.transactions.map(transaction => ({
                ...transaction,
                budgetName: budget.name,
                budgetId: budget.id
            }))
        )

        return transactions

    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}


// dashboard 

export async function getTotalTransactionAmount(email:string) {
    try {
            const user = await prisma.user.findUnique({
                where : {email},
                include : {
                    budgets : {
                        include : {
                            transactions :true
                        }
                    }
                }
            })

            if(!user) throw new Error("Utilisateur non trouvé");

            const totalAmount = user.budgets.reduce((sum, budgets) => {
                return sum + budgets.transactions.reduce((budgeSum, transaction) => budgeSum + transaction.amount, 0)
            }, 0)
    
            return totalAmount

        } catch (error){

        console.error("Erreur lors du calcul du montant total des transactions:", error);
        throw error;
    }
}


