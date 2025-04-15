"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { success, fail } from "@/app/actions/index";

export async function getTransactions(cardName: string) {
    try {
        
        const signedInUser = await auth();
        if (!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        await prisma.$connect();

        const user = await prisma.user.findUnique({
            where: { email: signedInUser.user.email },
            select: { id: true }
        });
        
        if (!user) {
            return fail("User not found");
        }
        
        const transactions = await prisma.transaction.findMany({
            where: {
                card: {
                    cardName: cardName,
                    userId: user.id
                }
            }
        });
  

        return success(transactions);
    } catch (error) {
        console.error("Error fetching card information:", error);
        return fail("Server Error");
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteTransaction(formData: FormData) {
    try {
        const signedInUser = await auth();
        
        if(!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        const signedInUserEmail = signedInUser.user.email;
        const transactionId = formData.get("transactionId") as string;
        const userEmail = formData.get("userEmail") as string || signedInUserEmail;
        const cardName = formData.get("cardName") as string;

        await prisma.$connect();


        if (userEmail !== signedInUserEmail && signedInUser.user.role !== "ADMIN") {
            return fail("Unauthorized");
        }


        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { id: true }
        });
        
        if (!user) {
            return fail("User not found");
        }
        

        const card = await prisma.card.findUnique({
            where: {
            cardName_userId: {
                cardName,
                userId: user.id
            }
            }
        });
        
        if (!card) {
            return fail("Card not found or unauthorized");
        }
        

        await prisma.transaction.delete({
            where: {
            id: transactionId
            }
        });

  
        return success(`Card ${cardName} deleted successfully for ${userEmail}`);
    } catch (error) {
        console.error("Error deleting card information:", error);
        return fail("Server Error");
    } finally {
        await prisma.$disconnect();
    }
}

export async function addTransaction(formData: FormData) {
    try {
        const signedInUser = await auth();
        if (!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        

        const signedInUserEmail = signedInUser.user.email;
        const description = formData.get("description") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const userEmail = formData.get("userEmail") as string || signedInUserEmail;
        const cardName = formData.get("cardName") as string;


        if (userEmail !== signedInUserEmail && signedInUser.user.role !== "ADMIN") {
            return fail("Unauthorized");
        }

        if(isNaN(amount)) {
            return fail("Invalid amount");
        }

        await prisma.$connect();


        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { id: true }
        });
        
        if (!user) {
            return fail("User not found");
        }
        

        await prisma.transaction.create({
            data: {
            amount: amount,
            description: description,
            card: {
                connect: {
                cardName_userId: {
                    cardName: cardName,
                    userId: user.id
                }
                }
            }
            }
        });
  

        return success(`Card ${cardName} registered successfully for ${userEmail}`);
    } catch (error) {
        console.error("Error registering card information:", error);
        return fail("Server Error");
    } finally {
        await prisma.$disconnect();
    }
}
