// importing routes
import test from "./test.js";

// configure routes
export default function configureRoutes(app) {
  // test route
  app.use("/petStation", test);

  // not found error 404
  app.use("*", (req, res) => {
    return res.status(404).send(
      JSON.stringify({
        msg: "Resource not found.",
        success: true,
        error: null,
      })
    );
  });
}
