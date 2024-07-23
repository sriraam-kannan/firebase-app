import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context, Next } from "hono";
import { getDbInstance, setTenantDb } from "../database/dbConfig";
import { clientDatabase } from "../database/dbConstants";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    //AWS token verification
    const token: any = c.req.header("token");
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID || "",
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID, // Optional
    });

    const payload = await verifier.verify(token || "", {
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID || "", // Optional
    });
    c.set("user", payload);

    // Client database verification function
    const email: any = payload?.email || "";
    const tenantEmailDomain = email.split("@")[1];
    const tenantName = payload["custom:tenant_name"];

    // Compare tenantEmailDomain with custom:tenant_name in clientDatabase
    if (clientDatabase[tenantEmailDomain] === tenantName) {
      // Use core DB to check if the client exists
      const coreDb = getDbInstance("core");
      const client = await coreDb("client").where({ name: tenantName }).first();

      if (client) {
        // Set the tenantDb based on the client's DB name
        const tenantDb = clientDatabase[tenantEmailDomain];
        setTenantDb(tenantDb);
        c.set("tenantDb", tenantDb);
        console.log("tenantDb", tenantDb);
      } else {
        throw new Error("Client does not exist in core database");
      }
    } else {
      throw new Error("Tenant name and email domain do not match");
    }

    await next();
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
