// exam.account.js - Quản lý danh sách kỳ thi

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const tableBody = document.querySelector('.data-table__body');
    const openModalBtn = document.getElementById('openExamModalBtn');
    const examModal = document.getElementById('examModal');
    const closeExamModalBtn = document.getElementById('closeExamModalBtn');
    const cancelExamModalBtn = document.getElementById('cancelExamModalBtn');
    const createExamForm = document.getElementById('createExamForm');
    const modalTitle = document.querySelector('.exam-modal__title');
    const submitBtn = createExamForm.querySelector('.modal__footer-button--submit');
    const searchInput = document.querySelector('.filters-search__search-input');

    // Kỳ thi mẫu nếu localStorage rỗng
    const defaultExams = [
        {
            id: 'EX001',
            name: 'Thi cuối kỳ',
            course: 'Nhập môn lập trình C++ KH052424',
            partner: 'FPT Software',
            date: '2024-11-30',
            status: 'Đang diễn ra',
            description: 'Thi cuối kỳ cho môn C++.'
        },
        {
            id: 'EX002',
            name: 'Thi giữa kỳ',
            course: 'Nhập môn lập trình Python KH052425',
            partner: 'Rikkei Academy',
            date: '2024-12-30',
            status: 'Hoàn thành',
            description: 'Thi giữa kỳ Python.'
        }
    ];

    // Lấy danh sách kỳ thi từ localStorage hoặc mặc định
    let exams = JSON.parse(localStorage.getItem('exams')) || defaultExams;
    let editExamId = null;
    let currentPage = 1;
    const itemsPerPage = 7;
    let totalPages = 1;
    let filteredExams = exams; // Biến lưu kết quả tìm kiếm

    function saveExams() {
        localStorage.setItem('exams', JSON.stringify(exams));
    }

    function renderTable(data = filteredExams) {
        // Phân trang
        totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        tableBody.innerHTML = paginatedData.map(exam => `
            <tr>
                <td><input type="checkbox" class="form-checkbox"></td>
                <td><strong>${exam.id}</strong></td>
                <td><strong>${exam.name}</strong></td>
                <td><a href="#" class="exam-course-link" data-id="${exam.id}"><strong>${exam.course}</strong></a></td>
                <td>${exam.partner || ''}</td>
                <td>${formatDate(exam.date)}</td>
                <td><span class="exam-status exam-status--${exam.status === 'Đang diễn ra' ? 'blue' : 'green'}">${exam.status}</span></td>
                <td>
                    <div class="data-table__actions">
                        <button class="data-table__action-button data-table__action-button--delete" data-id="${exam.id}">
                            <img src="../images/trash-2.png" alt="delete">
                        </button>
                        <button class="data-table__action-button data-table__action-button--edit" data-id="${exam.id}">
                            <img src="../images/edit-2.png" alt="edit">
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        updatePaginationUI();
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    function updatePaginationUI() {
        const prevBtn = document.querySelector('.pagination__button:first-child');
        const nextBtn = document.querySelector('.pagination__button:last-child');
        const info = document.querySelector('.pagination__info');
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
        if (info) info.innerHTML = `Trang <span class="pagination__info-page">${currentPage}</span> trong <span class="pagination__info-page">${totalPages}</span>`;
    }

    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable();
    }

    // Mở modal tạo/sửa
    function openModal(isEdit = false, exam = null) {
        examModal.classList.remove('hidden');
        if (isEdit && exam) {
            modalTitle.textContent = 'Sửa kỳ thi';
            createExamForm.examCourse.value = exam.course;
            createExamForm.examName.value = exam.name;
            createExamForm.examDate.value = exam.date;
            createExamForm.examDesc.value = exam.description || '';
            submitBtn.textContent = 'Cập nhật';
        } else {
            modalTitle.textContent = 'Thêm kỳ thi';
            createExamForm.reset();
            submitBtn.textContent = 'Tạo kỳ thi';
        }
    }

    // Đóng modal
    function closeModal() {
        examModal.classList.add('hidden');
        editExamId = null;
    }

    // Xử lý submit form
    createExamForm.onsubmit = function(e) {
        e.preventDefault();
        const course = createExamForm.examCourse.value.trim();
        const name = createExamForm.examName.value.trim();
        const date = createExamForm.examDate.value;
        const description = createExamForm.examDesc.value.trim();
        let partner = '';
        if (course.includes('C++')) partner = 'FPT Software';
        else if (course.includes('Python')) partner = 'Rikkei Academy';
        else partner = 'FPT';
        const today = new Date().toISOString().slice(0,10);
        const status = date >= today ? 'Đang diễn ra' : 'Hoàn thành';

        // Validate chi tiết
        const errors = [];
        if (!course) errors.push('Vui lòng chọn khóa học!');
        if (!name) errors.push('Tên kỳ thi không được để trống!');
        if (!date) errors.push('Ngày thi không được để trống!');
        if (!description) errors.push('Mô tả kỳ thi không được để trống!');
        if (date && date < today) errors.push('Ngày thi phải lớn hơn hoặc bằng ngày hiện tại!');

        // Kiểm tra trùng lặp tên kỳ thi
        if (name && exams.some(exam => exam.name === name && exam.id !== editExamId)) {
            errors.push('Tên kỳ thi đã tồn tại trong hệ thống!');
        }

        if (errors.length > 0) {
            showToast('error', errors.map(e => `• ${e}`).join('<br>'));
            return;
        }

        // Nếu không có lỗi, tiến hành cập nhật/thêm mới
        if (editExamId) {
            const idx = exams.findIndex(e => e.id === editExamId);
            if (idx !== -1) {
                exams[idx] = { ...exams[idx], course, name, date, description, partner, status };
                saveExams();
                searchExams(searchInput.value);
                closeModal();
                showToast('success', 'Cập nhật kỳ thi thành công!');
            }
        } else {
            const newId = generateExamId();
            exams.push({ id: newId, course, name, date, description, partner, status });
            saveExams();
            searchExams(searchInput.value);
            closeModal();
            showToast('success', 'Tạo kỳ thi thành công!');
        }
    };

    // Xử lý click nút Thêm
    openModalBtn.onclick = function() {
        editExamId = null;
        openModal(false);
    };
    // Đóng modal
    closeExamModalBtn.onclick = cancelExamModalBtn.onclick = closeModal;

    // Xử lý click Sửa/Xóa
    tableBody.onclick = function(e) {
        const courseLink = e.target.closest('.exam-course-link');
        if (courseLink) {
            const id = courseLink.dataset.id;
            window.location.href = `exam-detail.html?id=${id}`;
            return;
        }
        const delBtn = e.target.closest('.data-table__action-button--delete');
        const editBtn = e.target.closest('.data-table__action-button--edit');
        if (delBtn) {
            const id = delBtn.dataset.id;
            showDeleteConfirmModal(id);
        } else if (editBtn) {
            const id = editBtn.dataset.id;
            const exam = exams.find(ex => ex.id === id);
            if (exam) {
                editExamId = id;
                openModal(true, exam);
            }
        }
    };

    function generateExamId() {
        let max = 0;
        exams.forEach(e => {
            const num = parseInt(e.id.replace('EX',''));
            if (!isNaN(num) && num > max) max = num;
        });
        return 'EX' + String(max+1).padStart(3,'0');
    }

    // Toast notification chuẩn hóa cho xóa, thêm, cập nhật
    function showToast(type, message) {
        const existingToast = document.querySelector('.toast-custom');
        if (existingToast) existingToast.remove();
        let iconHtml = '', bgColor = '';
        if (type === 'delete') {
            iconHtml = `<i class="fas fa-trash-alt" style="color:#B45309;font-size:22px;"></i>`;
            bgColor = '#FDECEA';
        } else if (type === 'add') {
            iconHtml = `<i class="fas fa-plus-circle" style="color:#2563EB;font-size:22px;"></i>`;
            bgColor = '#EFF6FF';
        } else if (type === 'update' || type === 'success') {
            iconHtml = `<i class="fas fa-check-circle" style="color:#16A34A;font-size:22px;"></i>`;
            bgColor = '#E6F4EA';
        } else if (type === 'error') {
            iconHtml = `<i class="fas fa-times-circle" style="color:#DC2626;font-size:22px;"></i>`;
            bgColor = '#FDECEA';
        } else if (type === 'trash') {
            iconHtml = `<i class="fas fa-trash-alt" style="color:#B45309;font-size:22px;"></i>`;
            bgColor = '#FDECEA';
        }
        const toast = document.createElement('div');
        toast.className = 'toast-custom';
        toast.innerHTML = `
            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:${bgColor};margin-right:16px;">${iconHtml}</span>
            <span style="color:#22223B;font-size:16px;font-weight:500;">${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 40px;
            right: 40px;
            transform: translateX(-50%);
            background: #fff;
            color: #22223B;
            padding: 16px 32px;
            border-radius: 10px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.15);
            z-index: 999999;
            min-width: 320px;
            max-width: 90vw;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Thêm import Excel
    if (window.XLSX === undefined) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        document.head.appendChild(script);
    }

    const downloadExcelButton = document.getElementById('downloadExcelButton');
    const importFileButton = document.getElementById('importFileButton');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let examIdToDelete = null;

    if (downloadExcelButton) {
        downloadExcelButton.onclick = function() {
            const excelData = exams.map(exam => ({
                'Mã kỳ thi': exam.id,
                'Tên kỳ thi': exam.name,
                'Khóa học': exam.course,
                'Tên đối tác': exam.partner,
                'Ngày thi': formatDate(exam.date),
                'Trạng thái': exam.status,
                'Mô tả': exam.description || ''
            }));
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách kỳ thi');
            XLSX.writeFile(workbook, 'danh_sach_ky_thi.xlsx');
        };
    }

    if (importFileButton) {
        importFileButton.onclick = function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xlsx,.xls,.csv';
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: 'array', raw: false });
                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                            const headers = jsonData[0];
                            const requiredFields = ['Mã kỳ thi', 'Tên kỳ thi', 'Khóa học', 'Tên đối tác', 'Ngày thi', 'Trạng thái'];
                            const missing = requiredFields.filter(f => !headers.includes(f));
                            if (missing.length > 0) {
                                showToast('error', 'File Excel thiếu các cột: ' + missing.join(', '));
                                return;
                            }
                            const normalizedData = jsonData.slice(1).map(row => {
                                const obj = {};
                                headers.forEach((h, i) => obj[h] = row[i]);
                                return obj;
                            }).filter(row => Object.values(row).some(val => val !== undefined && val !== ''));
                            let errors = [];
                            const newExams = normalizedData.map((item, idx) => {
                                if (!item['Mã kỳ thi'] || !item['Tên kỳ thi'] || !item['Khóa học'] || !item['Ngày thi']) {
                                    errors.push(`Dòng ${idx+2}: Thiếu thông tin bắt buộc!`);
                                    return null;
                                }
                                // Chuyển ngày về yyyy-mm-dd
                                let date = '';
                                if (typeof item['Ngày thi'] === 'string' && item['Ngày thi'].includes('/')) {
                                    const [d, m, y] = item['Ngày thi'].split('/');
                                    date = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
                                } else if (typeof item['Ngày thi'] === 'string' && item['Ngày thi'].includes('-')) {
                                    date = item['Ngày thi'];
                                } else {
                                    date = '';
                                }
                                return {
                                    id: String(item['Mã kỳ thi']).trim(),
                                    name: String(item['Tên kỳ thi']).trim(),
                                    course: String(item['Khóa học']).trim(),
                                    partner: String(item['Tên đối tác']||'').trim(),
                                    date,
                                    status: String(item['Trạng thái']).trim(),
                                    description: String(item['Mô tả']||'').trim()
                                };
                            }).filter(Boolean);
                            if (errors.length > 0) {
                                showToast('error', errors.map(e => `• ${e}`).join('<br>'));
                                return;
                            }
                            exams = [...exams, ...newExams];
                            saveExams();
                            searchExams(searchInput.value); // Cập nhật lại kết quả tìm kiếm
                            showToast('success', 'Nhập danh sách kỳ thi thành công!');
                        } catch (err) {
                            showToast('error', 'Lỗi khi nhập file!');
                        }
                    };
                    reader.onerror = () => showToast('error', 'Lỗi khi đọc file!');
                    reader.readAsArrayBuffer(file);
                }
            });
            fileInput.click();
        };
    }

    // Popup xác nhận xóa
    function showDeleteConfirmModal(id) {
        examIdToDelete = id;
        deleteConfirmModal.classList.remove('hidden');
    }
    cancelDeleteButton.onclick = function() {
        deleteConfirmModal.classList.add('hidden');
        examIdToDelete = null;
    };
    confirmDeleteButton.onclick = function() {
        if (examIdToDelete) {
            exams = exams.filter(exam => exam.id !== examIdToDelete);
            saveExams();
            searchExams(searchInput.value); // Cập nhật lại kết quả tìm kiếm
            showToast('trash', 'Đã xóa kỳ thi thành công!');
        }
        deleteConfirmModal.classList.add('hidden');
        examIdToDelete = null;
    };

    // ========== Exam Detail Page Logic ==========
    if (window.location.pathname.includes('exam-detail.html')) {
        function getExamById(id) {
            const exams = JSON.parse(localStorage.getItem('exams')) || [];
            return exams.find(e => e.id === id);
        }
        function renderExamDetail() {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            const exam = getExamById(id);
            if (!exam) {
                const notFound = document.getElementById('examNotFound');
                if (notFound) notFound.style.display = '';
                return;
            }
            const box = document.getElementById('examDetailBox');
            if (box) box.style.display = '';
            const title = document.getElementById('examDetailTitle');
            if (title) title.textContent = `${exam.name} - ${exam.course}`;
            const breadcrumb = document.getElementById('breadcrumbExamName');
            if (breadcrumb) breadcrumb.textContent = `${exam.name} - ${exam.course}`;
            if (box) box.innerHTML = `
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
        }
        renderExamDetail();
    }

    // Gắn sự kiện cho nút phân trang
    const prevPageButton = document.querySelector('.pagination__button:first-child');
    const nextPageButton = document.querySelector('.pagination__button:last-child');
    if (prevPageButton) prevPageButton.onclick = () => changePage(currentPage - 1);
    if (nextPageButton) nextPageButton.onclick = () => changePage(currentPage + 1);

    // Hàm tìm kiếm kỳ thi
    function searchExams(query) {
        query = query.toLowerCase().trim();
        filteredExams = exams.filter(exam => 
            exam.course.toLowerCase().includes(query) || 
            exam.id.toLowerCase().includes(query)
        );
        currentPage = 1; // Reset về trang 1 khi tìm kiếm
        renderTable();
    }

    // Xử lý sự kiện tìm kiếm
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchExams(e.target.value);
        });
    }

    // Khởi tạo
    renderTable();
}); 