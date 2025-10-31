// ✅ Use your deployed backend API
const API_URL = "https://student-app-mongodb.onrender.com/api/students";

// ✅ Load students and show on both admin.html & user.html
async function loadStudents() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch students");
    const students = await res.json();
    console.log("✅ Students:", students);
    displayStudents(students);
  } catch (err) {
    console.error("❌ Error loading students:", err);
  }
}

// ✅ Display students in a table
function displayStudents(students) {
  const adminTable = document.getElementById("adminTableBody");
  const userTable = document.getElementById("studentTableBody");

  // For Admin Page (with actions)
  if (adminTable) {
    adminTable.innerHTML = "";
    students.forEach((s) => {
      const row = `
        <tr>
          <td>${s.name}</td>
          <td>${s.subject}</td>
          <td>${s.marks}</td>
          <td>
            <button onclick="editStudent('${s._id}', '${s.name}', '${s.subject}', '${s.marks}')">✏️</button>
            <button onclick="deleteStudent('${s._id}')">🗑️</button>
          </td>
        </tr>
      `;
      adminTable.insertAdjacentHTML("beforeend", row);
    });
  }

  // For User Page (read-only)
  if (userTable) {
    userTable.innerHTML = "";
    students.forEach((s) => {
      const row = `
        <tr>
          <td>${s.name}</td>
          <td>${s.subject}</td>
          <td>${s.marks}</td>
        </tr>
      `;
      userTable.insertAdjacentHTML("beforeend", row);
    });
  }
}

// ✅ Add new student (Admin Page)
document.getElementById("addForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const marks = document.getElementById("marks").value.trim();

  if (!name || !subject || !marks) return alert("Please fill all fields!");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, marks }),
    });

    if (!res.ok) throw new Error("Failed to add student");

    document.getElementById("addForm").reset();
    alert("✅ Student added successfully!");
    loadStudents();
  } catch (err) {
    console.error("❌ Error adding student:", err);
  }
});

// ✅ Edit student (Admin)
async function editStudent(id, name, subject, marks) {
  const newName = prompt("Edit Name:", name);
  const newSubject = prompt("Edit Subject:", subject);
  const newMarks = prompt("Edit Marks:", marks);

  if (!newName || !newSubject || !newMarks) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, subject: newSubject, marks: newMarks }),
    });

    if (!res.ok) throw new Error("Failed to update student");
    alert("✅ Student updated successfully!");
    loadStudents();
  } catch (err) {
    console.error("❌ Error updating student:", err);
  }
}

// ✅ Delete student (Admin)
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete student");
    alert("🗑️ Student deleted successfully!");
    loadStudents();
  } catch (err) {
    console.error("❌ Error deleting student:", err);
  }
}

// ✅ Auto-load students on page load
document.addEventListener("DOMContentLoaded", loadStudents);
