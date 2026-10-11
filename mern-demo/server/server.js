
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.use(express.json());

// Lấy chuỗi kết nối MongoDB từ biến môi trường
const mongoUri = process.env.MONGODB_URI;

console.log(
  "MongoDB URI:",
  mongoUri ? "ĐÃ NHẬN" : "CHƯA NHẬN"
);

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB Atlas
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Collection:", Student.collection.name);
  })
  .catch((err) => {
    console.error("MongoDB connection error:");
    console.error(err.message);
  });

// Lấy danh sách sinh viên

app.get("/api/students", async (req, res) => {
  try {
    await mongoose.connection.asPromise();

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("DATABASE:", db.databaseName);
    console.log(
      "COLLECTIONS:",
      collections.map(c => c.name)
    );

    const students = await Student.find().lean();

    console.log("MODEL COLLECTION:", Student.collection.name);
    console.log("STUDENT COUNT:", students.length);

    res.status(200).json({
      database: db.databaseName,
      modelCollection: Student.collection.name,
      availableCollections: collections.map(c => c.name),
      count: students.length,
      students
    });
  } catch (error) {
    console.error("API ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});


