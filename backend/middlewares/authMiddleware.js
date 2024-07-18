import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.idtoken;
  const admin = {};

  try {
    console.log("token:",token);


    // Firebase token verification
    // const decodedUser = await admin.auth().verifyIdToken(token);
    // req.user = decodedUser;

    // AWS jwt token verification
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID, // Optional
    });

    const payload = await verifier.verify(token)
    console.log("payload",payload);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized!",
      error: e?.message,
    });
  }
};
