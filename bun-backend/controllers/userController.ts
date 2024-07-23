import type { Context } from "hono";
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminCreateUserCommand,
  type AdminGetUserCommandOutput,
  type AdminCreateUserCommandInput,
  type AdminSetUserPasswordCommandInput,
  type AdminGetUserCommandInput,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getDbInstance, getTenantDb } from "../database/dbConfig";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, password, tenant_name } = body;
    // Create User Command
    const createUserInput: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: "custom:tenant_name",
          Value: tenant_name,
        },
      ],
    };
    const createUserCommand = new AdminCreateUserCommand(createUserInput);
    await client.send(createUserCommand);

    //Set Username and Password Command
    const input: AdminSetUserPasswordCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(input);
    await client.send(command);

    return c.json({
      message: "User created successfully",
    });
  } catch (e) {
    console.log(e);
    return c.json(
      {
        message: "Error creating user",
        error: e,
      },
      500
    );
  }
};

const getUserProfile = async (c: Context) => {
  try {
    const user = c.get("user");
    console.log("user:", user);
    const { sub: username } = user;
    const input: AdminGetUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
    };
    const getUsercommand = new AdminGetUserCommand(input);
    const userDetails = await client.send(getUsercommand);
    const listGroupcommand = new AdminListGroupsForUserCommand(input);
    const response = await client.send(listGroupcommand);

    return c.json({
      message: "User profile fetched successfully",
      userDetails: userDetails.UserAttributes,
      groups: response.Groups,
    });
  } catch (e) {
    console.log(e);
    return c.json(
      {
        message: "Error fetching user profile",
        error: e,
      },
      500
    );
  }
};

const getUserDetails = async (c: Context) => {
  try {
    const user = c.get("user");
    const email = user.email;

    const tenantDb = c.get("tenantDb");
    const database = getDbInstance(tenantDb);

    const userDetails = await database("users").where({ email }).first();

    return c.json({
      message: "User details fetched successfully",
      userDetails,
    });
  } catch (e) {
    console.log(e);
    return c.json({ message: "Error getting user details", error: e }, 500);
  }
};

export { createUser, getUserProfile, getUserDetails };
