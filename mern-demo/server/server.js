require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const app = express();
app.use(express.json());
const mongoUri = process.env.MONGODB_URI;

console.log("MongoDB URI:", mongoUri ? "ĐÃ NHẬN" : "CHƯA NHẬN");

mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:");
    console.error(err.message);
  });

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 5000;

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sinh viên",
      error: error.message
    });
  }

});

app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi thêm sinh viên",
      error: error.message
    });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi cập nhật sinh viên",
      error: error.message
    });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json({
      message: "Đã xóa sinh viên",
      student
    });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi xóa sinh viên",
      error: error.message
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});