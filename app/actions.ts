'use server'

import prisma from "./lib/prisma"

export async function checkAndAddUser(email: string | undefined) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!existingUser) {
            await prisma.user.create({
                data: { email }
            })
            console.log("Nouvel utilisateur ajouté dans la base de données")
        } else {
            console.log("Utilisateur déjà présent dans la base de données")
        }

    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
}
    export async function addBudget(email : string, name:string, amount:number, emoji: string) {
            try {
                    const user = await prisma.user.findUnique({
                        where: { email }
                    })

                    if (!user) {
                        throw new Error ('Utilisateur non trouvé')
                    }

                    await prisma.budget.create({
                        data: {
                            name,
                            amount,
                            emoji,
                            userId : user.id
                        }

                    })
            } catch (error){
                console.error("erreur budget", error);
                throw error
            }
    }
