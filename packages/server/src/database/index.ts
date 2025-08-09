import mongoose from 'mongoose';
import ServerConfigs from '../configs';

const DATABASE = ServerConfigs.DATABASE;
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = DATABASE.CONNECTION_URL;
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📤 MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default connectDB;