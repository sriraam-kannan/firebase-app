import { Hono, type Context } from "hono";
import { cors } from "hono/cors";

import { authMiddleware } from "./middlewares/authMiddleware";
import { createUser } from "./controllers/userController";

const app = new Hono();

app.use(cors()); // Enable all CORS requests

app.get("/", async (c) => {
  c.json({
    message: "Server is running fine!",
  });
});

app.use("/api", authMiddleware);
app.get("/api/profile", async (c: Context) => {
  const user = c.get("user");

  try {
    c.json({ message: "Successful response", user });
  } catch (error) {
    c.json({ message: "something went wrong", error });
  }
});

app.get("/api/createUser", createUser);

export default app;
