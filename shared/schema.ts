import { pgTable, text, serial, integer, boolean, timestamp, numeric, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  shortDescription: text("short_description"),
  status: text("status").notNull().default("planning"), // planning, active, in_progress, on_hold, completed, cancelled
  category: text("category").notNull().default("personal"),
  progress: integer("progress").notNull().default(0),
  deadline: timestamp("deadline"),
  budget: numeric("budget"),
  spent: numeric("spent").default("0"),
  team: integer("team").default(1),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  tags: text("tags").array(),
  lastActivity: timestamp("last_activity").defaultNow(),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
  title: text("title").notNull(),
  time: text("time"),
  duration: integer("duration"), // in minutes
  priority: text("priority").notNull().default("medium"), // low, medium, high
  category: text("category").notNull().default("personal"),
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  location: text("location"),
  objective: text("objective"),
  scheduledDate: timestamp("scheduled_date"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: jsonb("recurring_pattern"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  mood: text("mood").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  nickname: text("nickname"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  relationshipType: text("relationship_type"), // family, friend, colleague, client, etc.
  relationshipLevel: text("relationship_level"), // close, distant, professional, etc.
  birthdate: timestamp("birthdate"),
  notes: text("notes"),
  tags: text("tags").array(),
  lastContactedAt: timestamp("last_contacted_at"),
  nextContactDue: timestamp("next_contact_due"),
  contactFrequencyDays: integer("contact_frequency_days"),
  socialMediaHandles: jsonb("social_media_handles"),
  profilePictureUrl: text("profile_picture_url"),
  likes: text("likes"),
  dislikes: text("dislikes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title"),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  linkedTaskId: uuid("linked_task_id").references(() => tasks.id),
  linkedProjectId: uuid("linked_project_id").references(() => projects.id),
  linkedContactId: uuid("linked_contact_id").references(() => contacts.id),
  sourcePage: text("source_page"),
  format: text("format").default("text"), // text, markdown, rich
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // real_estate, technology, clothing, vehicles, tools, art, documents
  purchasePrice: numeric("purchase_price"),
  currentValue: numeric("current_value"),
  purchaseDate: timestamp("purchase_date"),
  location: text("location"),
  serialNumber: text("serial_number"),
  warrantyEndDate: timestamp("warranty_end_date"),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  licenseExpiryDate: timestamp("license_expiry_date"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  moodEntries: many(moodEntries),
  contacts: many(contacts),
  notes: many(notes),
  assets: many(assets),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
  notes: many(notes),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  notes: many(notes),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [notes.linkedTaskId],
    references: [tasks.id],
  }),
  project: one(projects, {
    fields: [notes.linkedProjectId],
    references: [projects.id],
  }),
  contact: one(contacts, {
    fields: [notes.linkedContactId],
    references: [contacts.id],
  }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  timestamp: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;
