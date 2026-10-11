
import { useEffect, useState } from "react";

const API_URL = "https://mern-backend-45j9.onrender.com";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


// Tải danh sách sinh viên từ Backend
const loadStudents = async () => {
  setLoading(true);
  setErrorMessage("");

  try {
    const response = await fetch(`${API_URL}/api/students`);

    if (!response.ok) {
      throw new Error(`Backend trả về lỗi HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("Dữ liệu sinh viên từ API:", data);

    // Hỗ trợ cả API trả về mảng và API trả về object chứa students
    const studentList = Array.isArray(data)
      ? data
      : data.students;

    if (!Array.isArray(studentList)) {
      throw new Error(
        "Không tìm thấy danh sách sinh viên trong dữ liệu API."
      );
    }

    setStudents(studentList);
  } catch (error) {
    console.error("Lỗi tải danh sách sinh viên:", error);
    setErrorMessage(
      `${error.message}. Vui lòng kiểm tra Backend, API và kết nối mạng.`
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadStudents();
  }, []);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  // Thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.studentId.trim() ||
      !form.name.trim() ||
      !form.email.trim()
    ) {
      alert("Vui lòng nhập đầy đủ MSSV, họ tên và email!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: form.studentId.trim(),
          name: form.name.trim(),
          email: form.email.trim()
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP ${response.status}`);
      }

      alert("Thêm sinh viên thành công!");

      setForm({
        studentId: "",
        name: "",
        email: ""
      });

      await loadStudents();
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);
      alert(`Không thể thêm sinh viên: ${error.message}`);
    }
  };

  // Cập nhật sinh viên
  const handleUpdate = async (student) => {
    const newName = window.prompt(
      "Nhập họ tên mới:",
      student.name
    );

    if (newName === null || !newName.trim()) {
      return;
    }

    const newEmail = window.prompt(
      "Nhập email mới:",
      student.email
    );

    if (newEmail === null || !newEmail.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/students/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: student.studentId,
            name: newName.trim(),
            email: newEmail.trim()
          })
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP ${response.status}`);
      }

      alert("Cập nhật sinh viên thành công!");
      await loadStudents();
    } catch (error) {
      console.error("Lỗi cập nhật sinh viên:", error);
      alert(`Không thể cập nhật sinh viên: ${error.message}`);
    }
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP ${response.status}`);
      }

      alert("Xóa sinh viên thành công!");
      await loadStudents();
    } catch (error) {
      console.error("Lỗi xóa sinh viên:", error);
      alert(`Không thể xóa sinh viên: ${error.message}`);
    }
  };

  // Giao diện
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#222"
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1565c0" }}>
        Quản lý sinh viên - Version 2.0
      </h1>

      <section
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "30px"
        }}
      >
        <h2>Thêm sinh viên</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="studentId">MSSV:</label>
            <br />
            <input
              id="studentId"
              type="text"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="Nhập MSSV"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="name">Họ tên:</label>
            <br />
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="email">Email:</label>
            <br />
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Thêm sinh viên
          </button>
        </form>
      </section>

      <section>
        <h2>Danh sách sinh viên</h2>

        <button
          type="button"
          onClick={loadStudents}
          style={{ ...buttonStyle, marginBottom: "15px" }}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại danh sách"}
        </button>

        {loading && <p>Đang tải danh sách sinh viên...</p>}

        {!loading && errorMessage && (
          <div
            role="alert"
            style={{
              padding: "12px",
              color: "#b71c1c",
              backgroundColor: "#ffebee",
              borderRadius: "6px",
              marginBottom: "15px"
            }}
          >
            <strong>Không tải được danh sách.</strong>
            <p>{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && students.length === 0 && (
          <p>
            Chưa có sinh viên nào trong cơ sở dữ liệu.
            Bạn có thể thêm sinh viên bằng biểu mẫu phía trên.
          </p>
        )}

        {!errorMessage && students.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left"
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1565c0", color: "white" }}>
                  <th style={cellStyle}>STT</th>
                  <th style={cellStyle}>MSSV</th>
                  <th style={cellStyle}>Họ tên</th>
                  <th style={cellStyle}>Email</th>
                  <th style={cellStyle}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id || student.studentId}>
                    <td style={cellStyle}>{index + 1}</td>
                    <td style={cellStyle}>{student.studentId}</td>
                    <td style={cellStyle}>{student.name}</td>
                    <td style={cellStyle}>{student.email}</td>
                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => handleUpdate(student)}
                        style={{
                          ...buttonStyle,
                          marginRight: "8px",
                          marginBottom: "5px"
                        }}
                      >
                        Cập nhật
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(student._id)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: "#d32f2f"
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  maxWidth: "450px",
  padding: "10px",
  marginTop: "6px",
  boxSizing: "border-box",
  border: "1px solid #bbb",
  borderRadius: "5px"
};

const buttonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#1565c0",
  color: "white",
  cursor: "pointer"
};

const cellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  overflowWrap: "anywhere"
};

export default App;
