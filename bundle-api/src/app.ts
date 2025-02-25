import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// Import routes
import ServiceRoutes from './routes/service.route';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';
import CustomError from './errors/custom.error';
import { fetchAllAndCache } from './cache';

// Read env variables
readConfiguration();
fetchAllAndCache();

// Create the express app
const app: Express = express();
app.disable('x-powered-by');

app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Define configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use('/bundle-api', ServiceRoutes);
app.use('*', () => {
  throw new CustomError(404, 'Path not found.');
});
// Global error handler
app.use(errorMiddleware);

export default app;
