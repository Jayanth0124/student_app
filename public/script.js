const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");

async function loadStudents() {
  const res = await fetch("/api/students");
  const data = await res.json();
  tableBody.innerHTML = data.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.subject}</td>
      <td>${s.marks}</td>
      <td>
        <button onclick="deleteStudent('${s._id}')">🗑️</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const student = {
    name: document.getElementById("name").value,
    subject: document.getElementById("subject").value,
    marks: document.getElementById("marks").value
  };

  await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  form.reset();
  loadStudents();
});

async function deleteStudent(id) {
  await fetch(`/api/students/${id}`, { method: "DELETE" });
  loadStudents();
}

loadStudents();
