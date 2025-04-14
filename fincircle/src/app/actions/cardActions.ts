"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { success, fail } from "@/app/actions/index";

export async function getCards() {
    try {
        const signedInUser = await auth();
        if (!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }

        await prisma.$connect();

        const cards = await prisma.card.findMany({
            where: {
                user: {
                    email: signedInUser.user.email
                }
            }
        });

        return success(cards);
    } catch (error) {
        console.error("Error fetching card information:", error);
        return fail("Server Error");
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteCard(formData: FormData) {
    try {
        const signedInUser = await auth();
        
        if(!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        const signedInUserEmail = signedInUser.user.email;
        const userEmail = formData.get("userEmail") as string || signedInUserEmail;
        const cardName = formData.get("cardName") as string;

        await prisma.$connect();

        // if emails don't match, check the role of the user
        if (userEmail !== signedInUserEmail && signedInUser.user.role !== "ADMIN") {
            return fail("Unauthorized");
        }

        await prisma.card.deleteMany({
            where: {
                cardName: cardName,
                user: {
                    email: userEmail
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

export async function registerCard(formData: FormData) {
    try {
        
        
        const signedInUser = await auth();
        if (!signedInUser || !signedInUser.user?.email) {
            return fail("Unauthorized");
        }
        
        const signedInUserEmail = signedInUser.user.email;
        const userEmail = formData.get("userEmail") as string || signedInUserEmail;
        const cardName = formData.get("cardName") as string;


        console.log("Registering card with:", { cardName, userEmail });

        // if emails don't match, check the role of the user
        if (userEmail !== signedInUserEmail && signedInUser.user.role !== "ADMIN") {
            return fail("Unauthorized");
        }

        await prisma.$connect();
        // check if card exists
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        
        if (!user) {
            return fail("User not found");
        }
        
        const existingCard = await prisma.card.findFirst({
            where: {
                cardName: cardName,
                userId: user.id, // use user ID directly
            },
        });
        
        if (existingCard) {
            return fail(`Card ${cardName} already exists for ${userEmail}`);
        }

        console.log("Creating card with data:", {
            cardName,
            userId: user.id,
          });

          
        await prisma.card.create({
            data: {
                cardName: cardName,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        

        return success(`Card ${cardName} registered successfully for ${userEmail}`);
    } catch (error) {
        console.error("Error registering card information:", error);
        return fail("Server Error");
    } finally {
        await prisma.$disconnect();
    }
}
