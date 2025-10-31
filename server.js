import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // ✅ Add this line
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Fix for ES Modules path usage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schema
const studentSchema = new mongoose.Schema({
  name: String,
  subject: String,
  marks: Number
});
const Student = mongoose.model("Student", studentSchema);

// ✅ API Routes

// Get all students
app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Add student
app.post("/api/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json({ message: "Student added successfully!" });
});

// Update student
app.put("/api/students/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Student updated successfully!" });
});

// Delete student
app.delete("/api/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted successfully!" });
});

// ✅ Route pages
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
