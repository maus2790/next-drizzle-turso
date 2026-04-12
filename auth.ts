// auth.ts (en la raíz, junto a package.json)

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })
    ],
    pages: {
        signIn: "/login",      // Página personalizada de login
        error: "/login",       // Página de error
    },
    callbacks: {
        // Cuando el usuario inicia sesión por primera vez
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // Verificar si el usuario ya existe en nuestra DB
                const existingUser = await db.select()
                    .from(users)
                    .where(eq(users.email, user.email))

                if (existingUser.length === 0) {
                    // Usuario nuevo: crear registro
                    await db.insert(users).values({
                        email: user.email,
                        name: user.name || profile?.name || "Usuario Google",
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                        createdAt: new Date(),
                    })
                } else if (!existingUser[0].provider) {
                    // Si el usuario existe (email) pero no tiene provider (OAuth),
                    // actualizamos su registro para vincularlo con Google
                    await db.update(users)
                        .set({
                            provider: account?.provider,
                            providerId: account?.providerAccountId,
                        })
                        .where(eq(users.email, user.email))
                }

                return true
            } catch (error) {
                console.error("Error en signIn:", error)
                return false
            }
        },

        // Personalizar la sesión (datos que llegan al cliente)
        async session({ session, token }) {
            if (session.user && token.sub) {
                // Agregar ID de usuario a la sesión
                session.user.id = token.sub

                // Obtener nombre desde nuestra DB si es necesario
                const user = await db.select()
                    .from(users)
                    .where(eq(users.email, session.user.email!))

                if (user[0]) {
                    session.user.name = user[0].name
                }
            }
            return session
        },
    },
})