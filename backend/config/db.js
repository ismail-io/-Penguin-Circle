import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google DNS for SRV lookups (fixes Windows DNS issues)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    if (process.env.MONGODB_URI.includes('<db_password>')) {
      throw new Error('Replace <db_password> in your .env with your Atlas password');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  MongoDB Atlas Connected');
    console.log(`📦  Host    : ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return conn;
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌  MongoDB Connection Failed');
    console.error(`   Reason: ${error.message}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌  MongoDB connection closed (app terminated)');
  process.exit(0);
});

export default connectDB;
