import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloud_name, 
    api_key: process.env.Cloud_api_key, 
    api_secret: process.env.Cloud_api_secret
});

export default cloudinary;