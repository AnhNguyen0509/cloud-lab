
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  const loadStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Thêm sinh viên thất bại");
      }

      alert("Thêm sinh viên thành công!");

      setForm({
        studentId: "",
        name: "",
        email: ""
      });

      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể thêm sinh viên");
    }
  };

  const handleUpdate = async (student) => {
  const newName = window.prompt("Nhập họ tên mới:", student.name);
  const newEmail = window.prompt("Nhập email mới:", student.email);

  if (!newName || !newEmail) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentId: student.studentId,
        name: newName,
        email: newEmail
      })
    });

    if (!response.ok) {
      throw new Error("Cập nhật thất bại");
    }

    const updatedStudent = await response.json();

    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s._id === updatedStudent._id ? updatedStudent : s
      )
    );

    alert("Cập nhật sinh viên thành công!");
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể cập nhật sinh viên");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Xóa thất bại");
      }

      alert("Xóa sinh viên thành công!");
      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể xóa sinh viên");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Quản lý sinh viên - Version 2.0</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            placeholder="Nhập MSSV"
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />
        </div>

        <br />

        <button type="submit">Thêm sinh viên</button>
      </form>

      <h2>Danh sách sinh viên</h2>

      {students.map((student) => (
        <div key={student._id} style={{ marginBottom: "10px" }}>
          <span>
            {student.studentId} - {student.name} - {student.email}
          </span>

          {" "}

          <button onClick={() => handleUpdate(student)}>
            Cập nhật
          </button>

          {" "}

          <button onClick={() => handleDelete(student._id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
