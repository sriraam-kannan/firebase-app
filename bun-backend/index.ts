import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authMiddleware } from "./middlewares/authMiddleware";
import { createUser } from "./controllers/userController";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", async (c) => {
  c.json({
    message: "Server is running fine!",
  });
});

app.use("/api/*", authMiddleware);
app.get("/api/profile", async (c: Context) => {
  try {
    const user = c.get("user");
    return c.json({ message: "Successful response", user });
  } catch (error) {
    return c.json({ message: "something went wrong", error });
  }
});

app.post("/api/createUser", createUser);

export default app;
