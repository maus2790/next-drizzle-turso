// db/schema.ts

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password'),  // Ahora puede ser NULL para usuarios Google
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
    // Nuevos campos para OAuth
    provider: text('provider'),      // 'google', 'github', etc.
    providerId: text('provider_id'), // ID del usuario en el proveedor
}, (table) => ({
    providerIdx: index('provider_idx').on(table.provider, table.providerId),
}));