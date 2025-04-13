"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { success, fail } from "@/app/actions/index";

export async function getTransactions(formData: FormData) {
    try {
        
        const signedInUser = await auth();
        if (!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        await prisma.$connect();
        const cardName = formData.get("cardName") as string;

        const transactions = await prisma.transaction.findMany({
            where: {
                card: {
                    cardName: cardName
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

        await prisma.transaction.delete({
            where: {
                id: transactionId,
                card: {
                    cardName: cardName
                }
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

        await prisma.transaction.create({
            data: {
                amount: amount,
                description: description,
                card: {
                    connect: {
                        cardName: cardName
                    }
                },
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
