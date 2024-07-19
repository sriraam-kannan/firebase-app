import type { Context } from "hono";
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminCreateUserCommand,
  type AdminCreateUserCommandInput,
  type AdminSetUserPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;
    // Create User Command
    const createUserInput: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
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

export { createUser };
