const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const apiRoutes = require("./routes");

// const userDB = require("./models/user");
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
// // userDB.addUser({ name: "ali" });

app.use("/", apiRoutes);
app.listen(4000, () => console.log("Example app listening on port 4000!"));
