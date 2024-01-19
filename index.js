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
const { logoutUser } = require("./controllers/users");

const app = express();

app.use(cookieParser());
app.use(express.json());
const corsOptions = {
  origin: "https://futo-msc.vercel.app",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Authorization,Content-Type",
};

app.use(cors(corsOptions));

// app.options("/api/admin/logout", cors(corsOptions));
app.post("/api/admin/logout", cors(corsOptions), logoutUser);
app.post("/api/contractor/logout", cors(corsOptions), logoutUser);
app.post("/api/stakeholder/logout", cors(corsOptions), logoutUser);

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
