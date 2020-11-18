const { AuthenticationError } = require("apollo-server");

const jsonWebToken = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jsonWebToken.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("invalid / expired token");
      }
    }
    throw new Error("Authentication token must be  Bearer[token]");
  }
  throw new Error("Authentication header must be provided");
};
