function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function getExamById(id) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    return exams.find(e => e.id === id);
}

function saveExams(exams) {
    localStorage.setItem('exams', JSON.stringify(exams));
}

function getDefaultStudents() {
    // 15 học viên mẫu
    const names = [
        'Trần Hữu Nam', 'Trần Trung Dũng', 'Nguyễn Diệu Nhi', 'Nguyễn Linh', 'Hồ Ngọc Hà',
        'Nguyễn Ánh Dương', 'Trần Hùng Huy', 'Nguyễn Khang', 'Phạm Minh Tuấn', 'Lê Thị Hồng',
        'Nguyễn Văn An', 'Phạm Thị Mai', 'Lê Minh Quân', 'Nguyễn Thị Thu', 'Đỗ Văn Bình'
    ];
    const emails = [
        'namtran94@phenikaa.com', 'phoenix@phenikaa.com', 'lana@phenikaa.com', 'demi@phenikaa.com', 'candice@phenikaa.com',
        'natal@phenikaa.com', 'drew@phenikaa.com', 'orlando@phenikaa.com', 'tuanpm@phenikaa.com', 'hongle@phenikaa.com',
        'an.nguyen@phenikaa.com', 'mai.pham@phenikaa.com', 'quan.le@phenikaa.com', 'thu.nguyen@phenikaa.com', 'binh.do@phenikaa.com'
    ];
    const avatars = [
        '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png',
        '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png',
        '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png', '../images/Avatar.png'
    ];
    return Array.from({length: 15}).map((_, i) => ({
        id: 'TK' + (23531 + (i%2)) + (i+1),
        name: names[i],
        email: emails[i],
        avatar: avatars[i],
        joined: i < 2 // 2 người đầu mặc định đã tham gia
    }));
}

let currentPage = 1;
const itemsPerPage = 8;
let totalPages = 1;
let students = [];
let examId = null;

function renderExamDetail() {
    const params = new URLSearchParams(window.location.search);
    examId = params.get('id');
    let exams = JSON.parse(localStorage.getItem('exams')) || [];
    let exam = exams.find(e => e.id === examId);
    if (!exam) {
        document.getElementById('examNotFound').style.display = '';
        return;
    }
    // Nếu chưa có students thì khởi tạo mặc định
    if (!exam.students || !Array.isArray(exam.students) || exam.students.length === 0) {
        exam.students = getDefaultStudents();
        const idx = exams.findIndex(e => e.id === examId);
        exams[idx] = exam;
        saveExams(exams);
    }
    students = exam.students;
    document.getElementById('examDetailBox').style.display = '';
    document.getElementById('examDetailTitle').textContent = `${exam.name} - ${exam.course}`;
    document.getElementById('breadcrumbExamName').textContent = `${exam.name} - ${exam.course}`;
    document.getElementById('examDetailBox').innerHTML = `
        <div class="exam-detail-title">Thông tin kỳ thi</div>
        <div class="exam-detail-rows">
            <div class="exam-detail-row">
                <div class="exam-detail-col">
                    <div class="exam-detail-label">Mã kỳ thi</div>
                    <div class="exam-detail-value">${exam.id}</div>
                </div>
                <div class="exam-detail-col">
                    <div class="exam-detail-label">Ngày thi</div>
                    <div class="exam-detail-value">${formatDate(exam.date)}</div>
                </div>
            </div>
            <div class="exam-detail-row">
                <div class="exam-detail-col">
                    <div class="exam-detail-label">Trạng thái</div>
                    <div class="exam-detail-value exam-detail-status">${exam.status}</div>
                </div>
                <div class="exam-detail-col">
                    <div class="exam-detail-label">Khóa học</div>
                    <div class="exam-detail-value"><a href="#" style="color:#b9381e;text-decoration:underline;font-weight:600;">${exam.course}</a></div>
                </div>
            </div>
        </div>
        <div class="exam-detail-desc-label">Mô tả</div>
        <div class="exam-detail-desc">${exam.description || '<span style=\'color:#aaa\'>Không có mô tả</span>'}</div>
    `;
    renderStudentTable();
}

function renderStudentTable() {
    const tableBody = document.getElementById('studentTableBody');
    const studentCount = document.getElementById('studentCount');
    const paginationInfo = document.getElementById('paginationInfo');
    if (!tableBody) return;
    totalPages = Math.ceil(students.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageStudents = students.slice(startIdx, endIdx);
    tableBody.innerHTML = pageStudents.map((s, idx) => `
        <tr style="height:72px;background:${(startIdx+idx)%2===0?'#fff':'#F8FAFC'};">
            <td class="student-name">${s.id}</td>
            <td>
                <div style="display:flex;align-items:center;gap:12px;">
                    <img src="${s.avatar}" class="student-avatar">
                    <span class="student-name">${s.name}</span>
                </div>
            </td>
            <td><div class="student-email">${s.email}</div></td>
            <td style="text-align:center;">
                <input type="checkbox" class="student-join-checkbox" data-idx="${startIdx+idx}" ${s.joined ? 'checked' : ''}>
            </td>
        </tr>
    `).join('');
    studentCount.textContent = students.length;
    paginationInfo.textContent = `Trang ${currentPage} trong ${totalPages}`;
    // Sự kiện checkbox (chỉ cho cột đầu)
    document.querySelectorAll('.student-join-checkbox:not([disabled])').forEach(cb => {
        cb.addEventListener('change', function() {
            const idx = +this.dataset.idx;
            students[idx].joined = this.checked;
            // Lưu lại vào localStorage
            let exams = JSON.parse(localStorage.getItem('exams')) || [];
            const examIdx = exams.findIndex(e => e.id === examId);
            if (examIdx !== -1) {
                exams[examIdx].students = students;
                saveExams(exams);
            }
        });
    });
    // Phân trang: disable nút nếu ở đầu/cuối
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

document.getElementById('prevPageBtn').onclick = function() {
    if (currentPage > 1) {
        currentPage--;
        renderStudentTable();
    }
};
document.getElementById('nextPageBtn').onclick = function() {
    if (currentPage < totalPages) {
        currentPage++;
        renderStudentTable();
    }
};

document.getElementById('downloadStudentExcel').onclick = function() {
    // Tải danh sách học viên ra excel
    const excelData = students.map(s => ({
        'Mã học viên': s.id,
        'Họ và tên': s.name,
        'Email': s.email,
        'Tham gia thi': s.joined ? 'Có' : 'Không'
    }));
    if (window.XLSX === undefined) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = () => exportStudentExcel(excelData);
        document.head.appendChild(script);
    } else {
        exportStudentExcel(excelData);
    }
};

function exportStudentExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học viên');
    XLSX.writeFile(workbook, 'danh_sach_hoc_vien.xlsx');
}

renderExamDetail();