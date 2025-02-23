import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { name, email, password }: { name: string; email: string; password: string } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const saltedPassword = await bcrypt.hash(password, 10);
        await prisma.$connect();
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: saltedPassword,
            }
        });

        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}