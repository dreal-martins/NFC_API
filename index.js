const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });

connectDB();
const contractor = require("./routes/contractor");
const admin = require("./routes/admin");
const stakeholder = require("./routes/stakeHolder");

const app = express();

app.use(cookieParser());
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use("/api/admin", admin);
app.use("/api/contractor", contractor);
app.use("/api/stakeholder", stakeholder);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
