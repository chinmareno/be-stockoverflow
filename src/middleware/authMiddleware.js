const jwt = require("jsonwebtoken");
const prisma = require("../configs/db.config");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send("erorr");
      } else {
        const { id } = await prisma.user.findUnique({
          where: {
            id: decodedToken.id,
          },
        });
        req.userId = id;
        next();
      }
    });
  } else {
    res.json({ error: "session expired" });
  }
};

module.exports = authMiddleware;
