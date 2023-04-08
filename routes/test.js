// importing libraries
import express from "express";

const router = express.Router(); // router

// GET: to test if server is working
router.get("/is-server-working", (req, res) => {
  return res.send({ msg: "Server is working" });
});

export default router;
