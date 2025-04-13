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

        await prisma.card.delete({
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

        // if emails don't match, check the role of the user
        if (userEmail !== signedInUserEmail && signedInUser.user.role !== "ADMIN") {
            return fail("Unauthorized");
        }

        await prisma.$connect();
        // check if card exists
        const existingCard = await prisma.card.findUnique({
            where: {
                cardName: cardName,
                user: {
                    email: userEmail
                }
            }
        });
        if (existingCard) {
            return fail(`Card ${cardName} already exists for ${userEmail}`);
        }

        await prisma.card.create({
            data: {
                cardName: cardName,
                user: {
                    connect: {
                        email: userEmail
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
