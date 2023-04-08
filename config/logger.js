// importing library
import * as PinoLogger from "pino";

// pino configuration
const config = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

// logger
const logger = PinoLogger.pino(
  process.env.NODE_ENV === "development" ? config : {}
);

export default logger;
