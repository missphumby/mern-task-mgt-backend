var jwt = require("jsonwebtoken");
module.exports.requireToken = (req, res, next) => {
  const token =
    req.headers.authorization ||
    req.headers["x-access-token"] ||
    req.body.token;
  if (token) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        res.send(err);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: "Failed",
      message: "Authentication required for this route",
    });
  }
};

module.exports.generateToken = (user, callback) => {
  console.log("user", user);
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      password: user.hashedpassword,
    },
    "secret",
    { expiresIn: "1h" },
    (err, res) => {
    callback(err, res);
    }
  );
};
