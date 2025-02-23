import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";

const authOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email"},
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as { email: string, password: string };

                if (!email || !password) {
                    return null;
                }

                await prisma.$connect();
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    },
                });

                if (!user) {
                    return null;
                }
                const isValid = await compare(password, user.hashedPassword);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)