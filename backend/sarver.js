require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
========================================
🚀 StoreForge AI Backend Running
🌐 Environment : ${process.env.NODE_ENV}
📡 Port        : ${PORT}
========================================
      `);
    });
  } catch (error) {
    console.error(
      "❌ Server Startup Failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
