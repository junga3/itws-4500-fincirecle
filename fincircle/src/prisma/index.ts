/* eslint-disable */
// @ts-nocheck
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient;

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

if (process.env.NODE_ENV === 'development') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma;
}

export default prisma;