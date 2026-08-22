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

const prisma = new PrismaClient();

module.exports = prisma;
