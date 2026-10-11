const cors = require("cors");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
app.use(cors({
  origin: "https://mern-frontend-n6r0.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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

 // Thêm sinh viên
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ mã sinh viên, họ tên và email."
      });
    }

    const student = await Student.create({
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim()
    });

    res.status(201).json({
      message: "Thêm sinh viên thành công!",
      student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Mã sinh viên hoặc email đã tồn tại."
      });
    }

    res.status(400).json({ message: error.message });
  }
});

// Sửa sinh viên
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, name, email } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID sinh viên không hợp lệ." });
    }

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ mã sinh viên, họ tên và email."
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        studentId: studentId.trim(),
        name: name.trim(),
        email: email.trim()
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    res.json({ message: "Cập nhật thành công!", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID sinh viên không hợp lệ." });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    res.json({ message: "Xóa sinh viên thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



