const jwt = require("jsonwebtoken");
const jwtSecret = "tysecret123";

exports.authenticateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    req.userData = {
      email: decodedToken.email,
      token: token,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid Token!" });
  }
};
