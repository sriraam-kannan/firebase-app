import type { Context } from "hono";

const createUser = async (c: Context) => {
  c.json({
    message: "User created successfully",
  });
};

export { createUser };
