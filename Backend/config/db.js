import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = 'mongodb://127.0.0.1:27017/Banking_Application';

const connectdb = async () => {
    try {
        await mongoose.connect(uri);
        // Remove the console.log from here
        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export default connectdb;