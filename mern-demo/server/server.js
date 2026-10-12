
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

// ================================
// 1. CAU HINH SERVER
// ================================

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 5000;

// ================================
// 2. CAU HINH CORS CHO FRONTEND
// ================================

app.use(
  cors({
    origin: "https://mern-frontend-n6r0.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ================================
// 3. KET NOI MONGODB ATLAS
// ================================

const mongoUri = process.env.MONGODB_URI;

console.log(
  "MongoDB URI:",
  mongoUri ? "DA NHAN" : "CHUA NHAN"
);

if (!mongoUri) {
  console.error(
    "LOI: Chua cau hinh bien moi truong MONGODB_URI."
  );
} else {
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
}

// ================================
// 4. HEALTH CHECK CHO RENDER
// ================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Backend dang hoat dong",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ================================
// 5. LAY DANH SACH SINH VIEN
// GET /api/students
// ================================

app.get("/api/students", async (req, res) => {
  try {
    await mongoose.connection.asPromise();

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const students = await Student.find().lean();

    console.log("DATABASE:", db.databaseName);
    console.log(
      "COLLECTIONS:",
      collections.map((c) => c.name)
    );
    console.log("MODEL COLLECTION:", Student.collection.name);
    console.log("STUDENT COUNT:", students.length);

    res.status(200).json({
      database: db.databaseName,
      modelCollection: Student.collection.name,
      availableCollections: collections.map((c) => c.name),
      count: students.length,
      students
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error.message);

    res.status(500).json({
      message: "Khong the lay danh sach sinh vien.",
      error: error.message
    });
  }
});

// ================================
// 6. THEM SINH VIEN
// POST /api/students
// ================================

app.post("/api/students", async (req, res) => {
  try {
    await mongoose.connection.asPromise();

    const { studentId, name, email } = req.body;

    if (
      typeof studentId !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      !studentId.trim() ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "Vui long nhap day du ma sinh vien, ho ten va email."
      });
    }

    const student = await Student.create({
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim()
    });

    return res.status(201).json({
      message: "Them sinh vien thanh cong!",
      student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ma sinh vien hoac email da ton tai."
      });
    }

    console.error("POST STUDENT ERROR:", error.message);

    return res.status(400).json({
      message: error.message
    });
  }
});

// ================================
// 7. SUA THONG TIN SINH VIEN
// PUT /api/students/:id
// ================================

app.put("/api/students/:id", async (req, res) => {
  try {
    await mongoose.connection.asPromise();

    const { id } = req.params;
    const { studentId, name, email } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID sinh vien khong hop le."
      });
    }

    if (
      typeof studentId !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      !studentId.trim() ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "Vui long nhap day du ma sinh vien, ho ten va email."
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        studentId: studentId.trim(),
        name: name.trim(),
        email: email.trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien."
      });
    }

    return res.status(200).json({
      message: "Cap nhat sinh vien thanh cong!",
      student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ma sinh vien hoac email da ton tai."
      });
    }

    console.error("PUT STUDENT ERROR:", error.message);

    return res.status(400).json({
      message: error.message
    });
  }
});

// ================================
// 8. XOA SINH VIEN
// DELETE /api/students/:id
// ================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    await mongoose.connection.asPromise();

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID sinh vien khong hop le."
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien."
      });
    }

    return res.status(200).json({
      message: "Xoa sinh vien thanh cong!",
      student
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error.message);

    return res.status(500).json({
      message: error.message
    });
  }
});

// ================================
// 9. API KHONG TON TAI
// ================================

app.use((req, res) => {
  res.status(404).json({
    message: "Khong tim thay API.",
    path: req.originalUrl
  });
});

// ================================
// 10. KHOI DONG SERVER
// LUON DAT CUOI FILE
// ================================

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
