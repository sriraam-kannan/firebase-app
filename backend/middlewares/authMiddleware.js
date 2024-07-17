export const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  const admin = {};

  try {
    const decodedUser = await admin.auth().verifyIdToken(token);
    req.user = decodedUser;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized!",
      error: e?.message,
    });
  }
};
