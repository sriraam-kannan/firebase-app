import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("idtoken");
  try {
    console.log("token:", token);
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID || "",
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID, // Optional
    });

    const payload = await verifier.verify(token || "", {
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID || "", // Optional
    });
    console.log("payload", payload);
    c.set("user", payload);
    next();
  } catch (e: any) {
    return c.json(
      {
        message: "Unauthorized!",
        error: e?.message,
      },
      401
    );
  }
};
