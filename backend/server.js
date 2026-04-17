require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;


sequelize.authenticate().then(() => console.log("successfully connected to db")).catch(err => `failed to connect db: ${err}`)

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
    );
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...", err.name, err.message);
  process.exit(1);
});

startServer();
