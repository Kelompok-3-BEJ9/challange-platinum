const app = require('./app');
const { sequelize } = require("./models");


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful.");
    const PORT = process.env.PORT || 1990;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
