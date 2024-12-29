import { pgTable, unique, pgPolicy, bigint, text, boolean, foreignKey, uuid, jsonb, primaryKey, check, smallint, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const collections = pgTable("collections", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "collections_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: text().notNull(),
	description: text(),
	isDefault: boolean("is_default").default(false),
}, (table) => [
	unique("collections_name_key").on(table.name),
	pgPolicy("Enable read access for authenticated users", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() IS NOT NULL)` }),
]);

export const wordGroups = pgTable("word_groups", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "word_groups_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	words: text().array().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	collectionId: bigint("collection_id", { mode: "number" }).notNull(),
	name: text(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.collectionId],
			foreignColumns: [collections.id],
			name: "public_word_groups_collection_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Enable read access for authenticated users", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() IS NOT NULL)` }),
]);

export const userPreference = pgTable("user_preference", {
	userId: uuid("user_id").default(sql`auth.uid()`).primaryKey().notNull(),
	preference: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_preference_uid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Enable insert for users based on user_id", { as: "permissive", for: "all", to: ["public"], using: sql`(( SELECT auth.uid() AS uid) = user_id)`, withCheck: sql`(( SELECT auth.uid() AS uid) = user_id)`  }),
]);

export const userIntervals = pgTable("user_intervals", {
	userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
	progress: smallint().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	intervalMs: bigint("interval_ms", { mode: "number" }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.userId, table.progress], name: "user_intervals_pkey"}),
	pgPolicy("Users can only alter their own data", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)`, withCheck: sql`(auth.uid() = user_id)`  }),
	check("user_intervals_progress_check", sql`(progress >= 0) AND (progress <= 100)`),
]);

export const userProgress = pgTable("user_progress", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	wordGroupId: bigint("word_group_id", { mode: "number" }).notNull(),
	userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
	progress: smallint().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "public_user_progress_user_id_fkey"
		}),
	foreignKey({
			columns: [table.wordGroupId],
			foreignColumns: [wordGroups.id],
			name: "public_user_progress_word_group_id_fkey"
		}),
	primaryKey({ columns: [table.wordGroupId, table.userId], name: "user_progress_pkey"}),
	pgPolicy("Users can only alter their own data", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)`, withCheck: sql`(auth.uid() = user_id)`  }),
	check("user_progress_progress_check", sql`(progress >= 0) AND (progress <= 100)`),
]);
