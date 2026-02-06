// Lớp Student (Đối tượng sinh viên)
class Student {
    constructor(studentId, fullName, birthDate, className, gpa) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.className = className;
        this.gpa = parseFloat(gpa);
    }

    // Phương thức cập nhật thông tin sinh viên
    updateInfo(fullName, birthDate, className, gpa) {
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.className = className;
        this.gpa = parseFloat(gpa);
    }

    // Phương thức định dạng ngày sinh
    getFormattedBirthDate() {
        const date = new Date(this.birthDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Phương thức định dạng GPA
    getFormattedGPA() {
        return this.gpa.toFixed(2);
    }
}

// Quản lý danh sách sinh viên
class StudentManager {
    constructor() {
        this.students = this.loadFromLocalStorage();
        this.editingStudentId = null;
    }

    // Thêm sinh viên mới
    addStudent(student) {
        // Kiểm tra trùng mã sinh viên
        if (this.students.some(s => s.studentId === student.studentId)) {
            alert('Mã sinh viên đã tồn tại!');
            return false;
        }
        this.students.push(student);
        this.saveToLocalStorage();
        return true;
    }

    // Cập nhật thông tin sinh viên
    updateStudent(studentId, fullName, birthDate, className, gpa) {
        const student = this.students.find(s => s.studentId === studentId);
        if (student) {
            student.updateInfo(fullName, birthDate, className, gpa);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Xóa sinh viên
    deleteStudent(studentId) {
        const index = this.students.findIndex(s => s.studentId === studentId);
        if (index !== -1) {
            this.students.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Xóa toàn bộ sinh viên
    deleteAllStudents() {
        this.students = [];
        this.saveToLocalStorage();
    }

    // Lấy sinh viên theo mã
    getStudent(studentId) {
        return this.students.find(s => s.studentId === studentId);
    }

    // Lấy tất cả sinh viên
    getAllStudents() {
        return this.students;
    }

    // Tính GPA trung bình
    getAverageGPA() {
        if (this.students.length === 0) return 0;
        const sum = this.students.reduce((acc, student) => acc + student.gpa, 0);
        return sum / this.students.length;
    }

    // Sắp xếp sinh viên
    sortStudents(sortType) {
        switch(sortType) {
            case 'id-asc':
                this.students.sort((a, b) => a.studentId.localeCompare(b.studentId));
                break;
            case 'id-desc':
                this.students.sort((a, b) => b.studentId.localeCompare(a.studentId));
                break;
            case 'name-asc':
                this.students.sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
                break;
            case 'name-desc':
                this.students.sort((a, b) => b.fullName.localeCompare(a.fullName, 'vi'));
                break;
            case 'gpa-asc':
                this.students.sort((a, b) => a.gpa - b.gpa);
                break;
            case 'gpa-desc':
                this.students.sort((a, b) => b.gpa - a.gpa);
                break;
            case 'class-asc':
                this.students.sort((a, b) => a.className.localeCompare(b.className));
                break;
            case 'class-desc':
                this.students.sort((a, b) => b.className.localeCompare(a.className));
                break;
            default:
                // Không sắp xếp (mặc định theo thứ tự thêm vào)
                break;
        }
    }

    // Lưu vào LocalStorage
    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    // Tải từ LocalStorage
    loadFromLocalStorage() {
        const data = localStorage.getItem('students');
        if (data) {
            const studentsData = JSON.parse(data);
            return studentsData.map(s => new Student(
                s.studentId,
                s.fullName,
                s.birthDate,
                s.className,
                s.gpa
            ));
        }
        return [];
    }
}

// Khởi tạo StudentManager
const studentManager = new StudentManager();

// DOM Elements
const form = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const emptyState = document.getElementById('emptyState');
const totalStudentsEl = document.getElementById('totalStudents');
const avgGPAEl = document.getElementById('avgGPA');
const sortSelect = document.getElementById('sortSelect');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Hiển thị danh sách sinh viên
function renderStudents() {
    const students = studentManager.getAllStudents();
    
    // Update statistics
    totalStudentsEl.textContent = students.length;
    avgGPAEl.textContent = studentManager.getAverageGPA().toFixed(2);

    // Show/hide delete all button
    deleteAllBtn.style.display = students.length > 0 ? 'block' : 'none';

    if (students.length === 0) {
        studentTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    studentTableBody.innerHTML = students.map(student => `
        <tr>
            <td><strong>${student.studentId}</strong></td>
            <td>${student.fullName}</td>
            <td>${student.getFormattedBirthDate()}</td>
            <td>${student.className}</td>
            <td><strong>${student.getFormattedGPA()}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editStudent('${student.studentId}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteStudent('${student.studentId}')">Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Xử lý submit form (chỉ thêm mới)
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Lấy giá trị từ form
    const studentId = document.getElementById('studentId').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const className = document.getElementById('className').value.trim();
    const gpa = document.getElementById('gpa').value;

    // Validate
    if (!validateForm(studentId, fullName, birthDate, className, gpa)) {
        return;
    }

    // Thêm sinh viên mới
    const student = new Student(studentId, fullName, birthDate, className, gpa);
    if (studentManager.addStudent(student)) {
        alert('Thêm sinh viên thành công!');
        form.reset();
        renderStudents();
    }
});

// Validate form
function validateForm(studentId, fullName, birthDate, className, gpa) {
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));

    if (!studentId) {
        showError('studentId', 'Vui lòng nhập mã sinh viên');
        isValid = false;
    }

    if (!fullName) {
        showError('fullName', 'Vui lòng nhập họ và tên');
        isValid = false;
    }

    if (!birthDate) {
        showError('birthDate', 'Vui lòng chọn ngày sinh');
        isValid = false;
    }

    if (!className) {
        showError('className', 'Vui lòng nhập lớp học');
        isValid = false;
    }

    const gpaValue = parseFloat(gpa);
    if (!gpa || gpaValue < 0 || gpaValue > 4) {
        showError('gpa', 'GPA phải từ 0.00 đến 4.00');
        isValid = false;
    }

    return isValid;
}

// Hiển thị lỗi
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    input.classList.add('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Chỉnh sửa sinh viên - Mở modal
function editStudent(studentId) {
    const student = studentManager.getStudent(studentId);
    if (!student) return;

    // Lưu ID sinh viên đang chỉnh sửa
    studentManager.editingStudentId = studentId;
    
    // Điền dữ liệu vào modal
    document.getElementById('editStudentId').value = student.studentId;
    document.getElementById('editFullName').value = student.fullName;
    document.getElementById('editBirthDate').value = student.birthDate;
    document.getElementById('editClassName').value = student.className;
    document.getElementById('editGpa').value = student.gpa;

    // Clear errors
    document.querySelectorAll('#editForm .error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#editForm input').forEach(el => el.classList.remove('error'));

    // Hiển thị modal
    document.getElementById('editModal').classList.add('show');
}

// Đóng modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    studentManager.editingStudentId = null;
}

// Lưu thay đổi từ modal
function saveEditStudent() {
    const fullName = document.getElementById('editFullName').value.trim();
    const birthDate = document.getElementById('editBirthDate').value;
    const className = document.getElementById('editClassName').value.trim();
    const gpa = document.getElementById('editGpa').value;

    // Validate
    if (!validateEditForm(fullName, birthDate, className, gpa)) {
        return;
    }

    // Cập nhật sinh viên
    if (studentManager.updateStudent(studentManager.editingStudentId, fullName, birthDate, className, gpa)) {
        alert('Cập nhật thông tin sinh viên thành công!');
        closeEditModal();
        renderStudents();
    }
}

// Validate form trong modal
function validateEditForm(fullName, birthDate, className, gpa) {
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('#editForm .error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#editForm input').forEach(el => el.classList.remove('error'));

    if (!fullName) {
        showEditError('editFullName', 'Vui lòng nhập họ và tên');
        isValid = false;
    }

    if (!birthDate) {
        showEditError('editBirthDate', 'Vui lòng chọn ngày sinh');
        isValid = false;
    }

    if (!className) {
        showEditError('editClassName', 'Vui lòng nhập lớp học');
        isValid = false;
    }

    const gpaValue = parseFloat(gpa);
    if (!gpa || gpaValue < 0 || gpaValue > 4) {
        showEditError('editGpa', 'GPA phải từ 0.00 đến 4.00');
        isValid = false;
    }

    return isValid;
}

// Hiển thị lỗi trong modal
function showEditError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    input.classList.add('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Xóa sinh viên
function deleteStudent(studentId) {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
        if (studentManager.deleteStudent(studentId)) {
            alert('Xóa sinh viên thành công!');
            renderStudents();
        }
    }
}

// Đóng modal khi click bên ngoài
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Xử lý sắp xếp
sortSelect.addEventListener('change', function() {
    const sortType = this.value;
    if (sortType !== 'default') {
        studentManager.sortStudents(sortType);
    }
    renderStudents();
});

// Xử lý xóa toàn bộ
deleteAllBtn.addEventListener('click', function() {
    const count = studentManager.getAllStudents().length;
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${count} sinh viên?`)) {
        studentManager.deleteAllStudents();
        sortSelect.value = 'default';
        alert('Đã xóa toàn bộ danh sách sinh viên!');
        renderStudents();
    }
});

// Khởi tạo
renderStudents();
