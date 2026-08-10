/**
 * ============================================================================
 * StoreForge AI
 * Redis Configuration
 * ============================================================================
 *
 * File:
 *   backend/src/config/redis.js
 *
 * Purpose:
 *   Central Redis connection for:
 *   - caching
 *   - queues
 *   - rate limiting
 *   - temporary data
 *   - background jobs
 *
 * Environment:
 *   REDIS_URL=redis://localhost:6379
 *
 * Production example:
 *   REDIS_URL=redis://:<password>@<host>:6379
 * ============================================================================
 */

'use strict';

const { createClient } = require('redis');

let redisClient = null;
let connectionPromise = null;


// ============================================================================
// CONFIGURATION
// ============================================================================

const REDIS_URL =
  process.env.REDIS_URL || 'redis://127.0.0.1:6379';


// ============================================================================
// CREATE CLIENT
// ============================================================================

function createRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: REDIS_URL
  });

  redisClient.on('connect', () => {
    console.log('[Redis] Connecting...');
  });

  redisClient.on('ready', () => {
    console.log('[Redis] Connected and ready');
  });

  redisClient.on('reconnecting', () => {
    console.log('[Redis] Reconnecting...');
  });

  redisClient.on('end', () => {
    console.log('[Redis] Connection closed');
  });

  redisClient.on('error', (error) => {
    console.error('[Redis] Error:', error.message);
  });

  return redisClient;
}


// ============================================================================
// CONNECT
// ============================================================================

async function connectRedis() {
  const client = createRedisClient();

  // Already connected.
  if (client.isReady) {
    return client;
  }

  // Prevent multiple parts of the application from opening
  // multiple simultaneous connections.
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = client
    .connect()
    .then(() => client)
    .catch((error) => {
      connectionPromise = null;

      console.error(
        '[Redis] Connection failed:',
        error.message
      );

      throw error;
    });

  return connectionPromise;
}


// ============================================================================
// DISCONNECT
// ============================================================================

async function disconnectRedis() {
  if (!redisClient) {
    return;
  }

  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  redisClient = null;
  connectionPromise = null;

  console.log('[Redis] Disconnected');
}


// ============================================================================
// GET CLIENT
// ============================================================================

function getRedisClient() {
  return redisClient || createRedisClient();
}


// ============================================================================
// HEALTH CHECK
// ============================================================================

async function pingRedis() {
  const client = getRedisClient();

  if (!client.isReady) {
    await connectRedis();
  }

  return client.ping();
}


// ============================================================================
// STATUS
// ============================================================================

function getRedisStatus() {
  if (!redisClient) {
    return {
      configured: Boolean(process.env.REDIS_URL),
      connected: false,
      ready: false
    };
  }

  return {
    configured: Boolean(process.env.REDIS_URL),
    connected: redisClient.isOpen,
    ready: redisClient.isReady
  };
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createRedisClient,
  connectRedis,
  disconnectRedis,
  getRedisClient,
  pingRedis,
  getRedisStatus
};
