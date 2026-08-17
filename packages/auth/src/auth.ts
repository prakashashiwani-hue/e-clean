import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import { prisma } from "db/client";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        ...(process.env.NODE_ENV === "development" ? [
            "exp://",
            "exp://**",
            "exp://192.168.*.*:*/**",
            "eclean://",
            "eclean://*",
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://192.168.1.*:*",
            "http://192.168.1.1:3000",
            "http://192.168.1.2:3000",
            "http://192.168.1.3:3000",
            "http://192.168.1.4:3000",
            "http://192.168.1.5:3000",
            "http://192.168.1.1:8081",
            "http://192.168.1.2:8081",
            "http://192.168.1.3:8081",
            "http://192.168.1.4:8081",
            "http://192.168.1.5:8081",
        ] : [
            "eclean://",
            "eclean://*",
        ])
    ],
    plugins: [
        expo(),
    ],
});

export type Auth = typeof auth;
