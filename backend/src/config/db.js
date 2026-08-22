require('dotenv').config();

let PrismaClient;

try {
  // Try custom generated path first as specified in schema.prisma (output = "../generated/prisma")
  PrismaClient = require('../../generated/prisma').PrismaClient;
} catch (err1) {
  try {
    // Fallback to standard @prisma/client package
    PrismaClient = require('@prisma/client').PrismaClient;
  } catch (err2) {
    console.error('Failed to load PrismaClient from ../../generated/prisma or @prisma/client:', err2);
    throw err2;
  }
}

let prisma;

try {
  const { Pool } = require('pg');
  const { PrismaPg } = require('@prisma/adapter-pg');
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    ssl: connectionString && (connectionString.includes('sslmode=require') || connectionString.includes('prisma.io'))
      ? { rejectUnauthorized: false }
      : false,
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} catch (adapterErr) {
  // Fallback to standard PrismaClient instance if pg driver adapter is not installed
  prisma = new PrismaClient();
}

module.exports = prisma;
