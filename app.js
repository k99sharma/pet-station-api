// importing libraries
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

// importing config
import CONFIG from "./config/config.js";

// importing logger
import logger from "./config/logger.js";

// importing routes
import configureRoute from "./routes/index.js";

// app
const app = express();

// configuring middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(
  express.json({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

// route
configureRoute(app);

// function to run a server
function runServer() {
  try {
    app.listen(CONFIG.PORT, () => {
      logger.info(`Server is running at PORT: ${CONFIG.PORT}`);
    });
  } catch (err) {
    logger.info("Server run failed");
    logger.error(err);
  }
}

// start the servers
export default () => {
  runServer(); // invoke run server function
};
