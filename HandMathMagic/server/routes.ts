import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for calculation history
  app.get('/api/calculations', async (req, res) => {
    try {
      const calculations = await storage.getCalculations();
      res.json(calculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      res.status(500).json({ message: 'Failed to fetch calculations' });
    }
  });

  app.post('/api/calculations', async (req, res) => {
    try {
      // Validate request body using zod schema
      const validatedData = insertCalculationSchema.parse(req.body);
      
      // Save calculation to storage
      const calculation = await storage.saveCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: 'Invalid calculation data', 
          errors: error.errors 
        });
      } else {
        console.error('Error saving calculation:', error);
        res.status(500).json({ message: 'Failed to save calculation' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
