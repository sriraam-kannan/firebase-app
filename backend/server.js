import express from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable all CORS requests
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running fine!",
  });
});

app.use("/api", authMiddleware);
app.get("/api/metrics", async (req, res) => {
  const user = req.user;

  try {
    res.status(200).json({ message: "Got all metrics", user });
  } catch (error) {
    res.status(500).send({ message: "something went wrong", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
