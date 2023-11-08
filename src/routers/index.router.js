const userRouter = require("./user.router");
const uploadImageRouter = require("./image.router");

function Routers(app) {
  app.use("/user", userRouter);
  app.use("/upload", uploadImageRouter);
  app.get("/", (req, res) => {
    res.send({ message: "Deploy Ok!" });
  });
}

module.exports = Routers;
