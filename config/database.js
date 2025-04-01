import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Database configuration using environment variables
const DB_NAME = process.env.DB_NAME || 'your_database_name';
const DB_USER = process.env.DB_USER || 'your_database_user';
const DB_PASS = process.env.DB_PASS || 'your_database_password';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Initialize Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false, // Set to true to enable SQL query logs
  define: {
    timestamps: true, // Automatically adds createdAt & updatedAt
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // 30 seconds
    idle: 10000, // 10 seconds
  },
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the app on failure
  }
};

// Export both Sequelize instance & connection function
export { sequelize, connectDB };
