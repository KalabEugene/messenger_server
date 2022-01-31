import jwt from "jsonwebtoken";

const config = process.env;

export const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }
  return next();
};
