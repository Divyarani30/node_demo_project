const jwt = require("jsonwebtoken");

function jwtAuthMiddleware(req, res, next) {
  // check if the authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Missing authorization header." });
  }

  // verify the token
  jwt.verify(authHeader, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token." });
    }

    // set the user ID on the request object
    req.userId = decoded.id;
    next();
  });
}

module.exports = jwtAuthMiddleware;
