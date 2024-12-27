import { relations } from "drizzle-orm/relations";
import { collections, wordGroups, usersInAuth, userPreference, userProgress } from "./schema";

export const wordGroupsRelations = relations(wordGroups, ({one, many}) => ({
	collection: one(collections, {
		fields: [wordGroups.collectionId],
		references: [collections.id]
	}),
	userProgresses: many(userProgress),
}));

export const collectionsRelations = relations(collections, ({many}) => ({
	wordGroups: many(wordGroups),
}));

export const userPreferenceRelations = relations(userPreference, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userPreference.userId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	userPreferences: many(userPreference),
	userProgresses: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userProgress.userId],
		references: [usersInAuth.id]
	}),
	wordGroup: one(wordGroups, {
		fields: [userProgress.wordGroupId],
		references: [wordGroups.id]
	}),
}));