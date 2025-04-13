import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";

// extend authjs session

enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}
 
declare module "next-auth" {
    interface User {
        id?: string;
        email?: string | null;
        name?: string | null;
        role: UserRole;
    }
}

const authOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email"},
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };

                if (!email || !password) {
                    return null;
                }

                await prisma.$connect();
                const user = await prisma.user.findUnique({
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
                    role: user.role as UserRole,
                };
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({token, user} : { token: any; user: User | undefined }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: any; token: any }) {
            return {
                ...session,
                user: {
                    id: token.id,
                    email: token.email,
                    role: token.role,
                }
            }
        }
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.AUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)