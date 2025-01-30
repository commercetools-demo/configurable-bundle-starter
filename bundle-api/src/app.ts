import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import bodyParser from 'body-parser';

// Import routes
import ServiceRoutes from './routes/service.route';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';
import CustomError from './errors/custom.error';
import { fetchSchemaAndCache } from './cache/schema';

// Read env variables
readConfiguration();
fetchSchemaAndCache();

// Create the express app
const app: Express = express();
app.disable('x-powered-by');

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
