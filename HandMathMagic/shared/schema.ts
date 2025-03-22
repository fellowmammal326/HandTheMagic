import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Add calculation schema
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  firstNumber: integer("first_number").notNull(),
  operator: text("operator").notNull(),
  secondNumber: integer("second_number").notNull(),
  result: integer("result").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  firstNumber: true,
  operator: true,
  secondNumber: true,
  result: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
