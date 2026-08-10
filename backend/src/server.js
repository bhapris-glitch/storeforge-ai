/**
 * ============================================================================
 * StoreForge AI
 * Backend Server
 * ============================================================================
 *
 * File:
 * backend/src/server.js
 *
 * Purpose:
 * - Load environment variables
 * - Load Express application
 * - Connect MongoDB
 * - Start HTTP server
 * - Handle startup failures gracefully
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// ENVIRONMENT
// ============================================================================

require('dotenv').config();


// ============================================================================
// DEPENDENCIES
// ============================================================================

const http = require('http');

const app = require('./app');

const connectDB =
  require('./config/db');


// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT =
  Number(process.env.PORT) || 5000;

const HOST =
  process.env.HOST ||
  '0.0.0.0';


// ============================================================================
// CREATE HTTP SERVER
// ============================================================================

const server =
  http.createServer(app);


// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

let isShuttingDown = false;


const shutdown = async (
  signal
) => {

  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(
    `\n⚠️ ${signal} received. Shutting down StoreForge AI...`
  );


  server.close(
    async () => {

      console.log(
        '🌐 HTTP server closed.'
      );


      /*
       * mongoose is intentionally not imported here.
       *
       * The database module owns the MongoDB connection.
       *
       * If your db.js later exposes a closeDatabase()
       * function, it can be called here.
       */


      console.log(
        '✅ StoreForge AI shutdown complete.'
      );

      process.exit(0);

    }
  );


  /*
   * Prevent the process from hanging forever during shutdown.
   */

  setTimeout(
    () => {

      console.error(
        '❌ Forced shutdown after timeout.'
      );

      process.exit(1);

    },
    10000
  ).unref();

};


// ============================================================================
// PROCESS SIGNALS
// ============================================================================

process.on(
  'SIGTERM',
  () => shutdown('SIGTERM')
);

process.on(
  'SIGINT',
  () => shutdown('SIGINT')
);


// ============================================================================
// UNHANDLED PROMISE
// ============================================================================

process.on(
  'unhandledRejection',
  (reason) => {

    console.error(
      '❌ Unhandled Promise Rejection:',
      reason
    );

  }
);


// ============================================================================
// UNCAUGHT EXCEPTION
// ============================================================================

process.on(
  'uncaughtException',
  (error) => {

    console.error(
      '❌ Uncaught Exception:',
      error
    );

    /*
     * An uncaught exception can leave the application
     * in an unsafe state, so terminate the process.
     */

    process.exit(1);

  }
);


// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {

  try {

    /*
     * Connect MongoDB BEFORE accepting HTTP requests.
     */

    await connectDB();


    /*
     * Start HTTP server.
     */

    server.listen(
      PORT,
      HOST,
      () => {

        console.log(`
========================================
🚀 StoreForge AI Backend Running
========================================
🌐 Environment : ${
  process.env.NODE_ENV || 'development'
}
📡 Host        : ${HOST}
📡 Port        : ${PORT}
========================================
        `);

      }
    );


  } catch (error) {

    console.error(
      '\n❌ Server Startup Failed:',
      error.message
    );


    if (error.stack) {

      console.error(
        error.stack
      );

    }


    process.exit(1);

  }

};


// ============================================================================
// START
// ============================================================================

startServer();
