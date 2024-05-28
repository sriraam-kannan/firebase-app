import express from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import routes from "./src/appRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable all CORS requests
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running fine!",
  });
});

app.use("/api", authMiddleware, routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
