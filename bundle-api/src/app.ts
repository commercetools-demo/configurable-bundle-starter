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
import { logger } from './utils/logger.utils';

// Read env variables
readConfiguration();
fetchAllAndCache();

const extractMainDomain = (url: string) => {
  // For full domains like asdas.asdsada.blah.com
  const domainRegex = /^(?:https?:\/\/)?(?:.+\.)?([a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*(?:\.[a-z]{2,})?)(?:\/|$)/i;
  
  // For localhost or IP addresses
  const localhostRegex = /^(?:https?:\/\/)?(localhost(?::\d+)?)/i;
  
  let match = url.match(domainRegex);
  if (match && match[1]) {
    return match[1];
  }
  
  match = url.match(localhostRegex);
  return match ? match[1] : url;
};

// Create the express app
const app: Express = express();
app.disable('x-powered-by');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const domain = extractMainDomain(origin);
      logger.info(`Checking origin: ${origin} with domain: ${domain}`);
      if (process.env.CORS_ALLOWED_ORIGINS?.split(',').includes(domain)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
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
