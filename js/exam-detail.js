function formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    function getExamById(id) {
        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        return exams.find(e => e.id === id);
    }
    function renderExamDetail() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const exam = getExamById(id);
        if (!exam) {
            document.getElementById('examNotFound').style.display = '';
            return;
        }
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
    }
    renderExamDetail();