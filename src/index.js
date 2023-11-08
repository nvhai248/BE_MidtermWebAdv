const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// connect to db
require("./configs/db/index.db").connect();

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Make sure form data and file submissions are processed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

//implement routers
require("./routers/index.router")(app);

app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ statusCode: 500, type: "Internal Server!", message: err.message });
});

app.listen(port, () => {
  console.log("listening on port", port);
});
