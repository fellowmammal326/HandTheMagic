import { users, type User, type InsertUser, type Calculation, type InsertCalculation } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCalculations(): Promise<Calculation[]>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculations: Map<number, Calculation>;
  currentUserId: number;
  currentCalculationId: number;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.currentUserId = 1;
    this.currentCalculationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCalculations(): Promise<Calculation[]> {
    // Return calculations in reverse chronological order (newest first)
    return Array.from(this.calculations.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Return only last 10
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = this.currentCalculationId++;
    const timestamp = new Date();
    const calculation: Calculation = { ...insertCalculation, id, timestamp };
    this.calculations.set(id, calculation);
    return calculation;
  }
}

export const storage = new MemStorage();
