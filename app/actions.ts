
'use server'

import prisma from "./lib/prisma"

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

export async function getTrasactionsByBudgetId(budgetId: string) {
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

        return budget;
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}



