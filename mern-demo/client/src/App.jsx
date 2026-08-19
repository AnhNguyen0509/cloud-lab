import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Lỗi:", error));
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

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Có lỗi xảy ra");
        return;
      }

      setStudents([...students, data]);

      setForm({
        studentId: "",
        name: "",
        email: ""
      });

      alert("Thêm sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server");
    }
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

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

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.studentId} - {student.name} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;