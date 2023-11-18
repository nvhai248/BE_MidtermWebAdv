const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// connect to db
require("./configs/db/index.db").connect();
// app.use(cors({
//   origin: ["http://localhost:3000", "*"],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: "*"
// }));

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Make sure form data and file submissions are processed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

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
