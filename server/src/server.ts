import app from './app';
import { connectDB } from './config/database';


const startServer = async () => {
  try {
    await connectDB();
    app.listen(5000, () => {
      console.log(`Server is running on port ${5000}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 