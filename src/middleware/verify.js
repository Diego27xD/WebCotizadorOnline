const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "djañsjdkasjdasdj1231";

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect("/");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

module.exports = verifyToken;
