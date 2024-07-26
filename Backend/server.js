import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectdb from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// For ES modules to use __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Initialize app first

const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes
app.use('/api', customerRoutes);
app.use('/', authRoute); // Ensure authRoute is used correctly

// Connect to MongoDB
connectdb()
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

export default app;
