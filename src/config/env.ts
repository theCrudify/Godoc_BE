import dotenv from 'dotenv';

dotenv.config();

export const env = {
    // Server Configuration
    PORT: process.env.PORT || '3000',
    APP_ENV: process.env.APP_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // Database Configuration
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
    DATABASE_NAME: process.env.DATABASE_NAME || '',
    DATABASE_USER: process.env.DATABASE_USER || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASE_URL: process.env.DATABASE_URL || '',

    // Authentication
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
    JWT_EXPIRATION: isNaN(Number(process.env.JWT_EXPIRATION)) 
        ? process.env.JWT_EXPIRATION || '24h' 
        : Number(process.env.JWT_EXPIRATION),

    // Security & CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    RATE_LIMIT_WINDOW: Number(process.env.RATE_LIMIT_WINDOW) || 15,
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,

    // Session & Cache
    SESSION_SECRET: process.env.SESSION_SECRET || 'anothersecretkey',
    CACHE_TTL: Number(process.env.CACHE_TTL) || 600,

    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',

    // Storage Configuration
    STORAGE_BUCKET: process.env.STORAGE_BUCKET || '',
    STORAGE_REGION: process.env.STORAGE_REGION || '',

    // Debugging & Development
    DEBUG_MODE: process.env.DEBUG_MODE === 'true'
};
