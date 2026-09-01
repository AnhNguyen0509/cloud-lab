import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Lỗi:", error));
  }, []);

  // ...existing code...

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      // ...existing code...
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server");
    }
  };

  const handleUpdate = async (student) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: student.studentId,
          name: student.name,
          email: student.email
        })
      });

      // ...existing code...
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE"
      });

      // ...existing code...
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server");
    }
  };

  // ...existing code...
}

export default App;