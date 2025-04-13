import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { name, email, password }: { name: string; email: string; password: string } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUsername = await prisma.user.findUnique({
            where: {
                name: name
            },
        });

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (existingUsername || existingEmail) {
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
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}