import { createEnv } from "@t3-oss/env-next-js"
import { z } from "zod";

export const env = createEnv ({

    server:
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string()
},

    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string()
    },

    runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET
    }
     )
