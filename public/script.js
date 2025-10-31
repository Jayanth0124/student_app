const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");

// 🌐 Base API URL for Render deployment
const API_URL = "https://student-app-mongodb.onrender.com/api/students";

// 🔹 Load all students from database
async function loadStudents() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    tableBody.innerHTML = data
      .map(
        (s) => `
        <tr>
          <td>${s.name}</td>
          <td>${s.subject}</td>
          <td>${s.marks}</td>
          <td>
            <button onclick="editStudent('${s._id}', '${s.name}', '${s.subject}', '${s.marks}')">✏️</button>
            <button onclick="deleteStudent('${s._id}')">🗑️</button>
          </td>
        </tr>
      `
      )
      .join("");
  } catch (err) {
    console.error("❌ Error loading students:", err);
  }
}

// 🔹 Add new student
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    subject: document.getElementById("subject").value,
    marks: document.getElementById("marks").value,
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    form.reset();
    loadStudents();
  } catch (err) {
    console.error("❌ Error adding student:", err);
  }
});

// 🔹 Edit student (fills form with existing data)
function editStudent(id, name, subject, marks) {
  document.getElementById("name").value = name;
  document.getElementById("subject").value = subject;
  document.getElementById("marks").value = marks;
  form.setAttribute("data-edit-id", id);
}

// 🔹 Handle update if editing
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editId = form.getAttribute("data-edit-id");
  const student = {
    name: document.getElementById("name").value,
    subject: document.getElementById("subject").value,
    marks: document.getElementById("marks").value,
  };

  try {
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      form.removeAttribute("data-edit-id");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
    }

    form.reset();
    loadStudents();
  } catch (err) {
    console.error("❌ Error saving student:", err);
  }
});

// 🔹 Delete student
async function deleteStudent(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStudents();
  } catch (err) {
    console.error("❌ Error deleting student:", err);
  }
}

// 🔹 Initial load
loadStudents();
