


//import upload from '../middleware/uploads/upload.js';
import express from 'express';
import connectdb from './config/db.js'; 
import customerRoutes from './routes/customerRoutes.js'; // Adjust the path relative to server.js

import employmentRoutes from './routes/customerRoutes.js';
import documentVerificationRoutes from './routes/customerRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser'

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600, // Set to 600 seconds (10 minutes)
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Connect to MongoDB
connectdb()
  .then(() => {
    console.log('Connected to MongoDB');

    app.use(express.json()); // Middleware to parse JSON bodies

    // Use routes
    app.use('/api', customerRoutes);
    app.use('/api', employmentRoutes);
    app.use('/api', documentVerificationRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit with failure
  });
