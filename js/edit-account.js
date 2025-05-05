document.addEventListener('DOMContentLoaded', function() {
    // Các phần tử DOM
    const editAccountModal = document.getElementById('editAccountModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const cancelModalButton = document.getElementById('cancelModalButton');

    // Lấy id tài khoản từ URL
    function getAccountIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Lấy dữ liệu tài khoản từ localStorage
    function getAccountById(id) {
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        return accounts.find(acc => acc.id === id);
    }

    function showToast(type, message) {
        const oldToasts = document.querySelectorAll('.toast-test');
        oldToasts.forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'toast-test';
        toast.innerHTML = `<div style="padding:20px 32px;background:#fff;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.15);font-size:18px;color:#22223B;">${message}</div>`;
        toast.style.cssText = 'position:fixed;top:40px;right:40px;transform:translateX(-50%);z-index:999999;display:block;opacity:1;pointer-events:auto;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        console.log('Toast appended:', toast);
    }

    // Điền dữ liệu vào form/modal
    function fillAccountData(account) {
        if (!account) return;
        // Avatar
        if (account.avatar) {
            const avatarImg = document.querySelector('.profile-header__avatar');
            if (avatarImg) avatarImg.src = account.avatar;
            const avatarPreview = document.querySelector('.avatar-upload__preview img');
            if (avatarPreview) avatarPreview.src = account.avatar;
        }
        // Tên
        document.getElementById('fullName').value = account.name || '';
        // Ngày sinh (chuyển về yyyy-mm-dd nếu cần)
        if (account.dob) {
            let dob = account.dob;
            if (dob.includes('/')) {
                const [day, month, year] = dob.split('/');
                dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            document.getElementById('dob').value = dob;
        }
        // Số điện thoại
        document.getElementById('phone').value = account.phone || '';
        // Email
        document.getElementById('email').value = account.email || '';
        // Quê quán
        document.getElementById('address').value = account.address || '';
        // Loại tài khoản
        document.getElementById('accountType').value = account.type || '';
        // Hiển thị/ẩn thông tin sinh viên
        toggleStudentInfoSection();
        // Nếu là sinh viên, điền thêm thông tin sinh viên
        if (account.type === 'Sinh viên' && account.studentInfo) {
            document.getElementById('school').value = account.studentInfo.school || '';
            document.getElementById('studentId').value = account.studentInfo.studentId || '';
            document.getElementById('course').value = account.studentInfo.course || '';
            document.getElementById('major').value = account.studentInfo.major || '';
        } else {
            document.getElementById('school').value = '';
            document.getElementById('studentId').value = '';
            document.getElementById('course').value = '';
            document.getElementById('major').value = '';
        }
    }

    // Hiển thị/ẩn phần thông tin sinh viên
    function toggleStudentInfoSection() {
        const accountType = document.getElementById('accountType').value;
        const isStudent = accountType === 'Sinh viên';
        const studentInfoSection = document.getElementById('studentInfoSectionContainer');
        if (studentInfoSection) {
            studentInfoSection.classList.toggle('hidden', !isStudent);
        }
    }

    // Đóng modal khi ấn nút Hủy hoặc dấu X
    if (cancelModalButton && editAccountModal) {
        cancelModalButton.addEventListener('click', function(e) {
            e.preventDefault();
            editAccountModal.classList.add('hidden');
        });
    }
    if (closeModalButton && editAccountModal) {
        closeModalButton.addEventListener('click', function(e) {
            e.preventDefault();
            editAccountModal.classList.add('hidden');
        });
    }

    // Lắng nghe submit form cập nhật
    const editAccountForm = document.getElementById('editAccountForm');
    if (editAccountForm) {
        editAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = getAccountIdFromUrl();
            if (!id) return;

            // Lấy dữ liệu cũ
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            const idx = accounts.findIndex(acc => acc.id === id);
            if (idx === -1) {
                showToast('error', 'Không tìm thấy tài khoản để cập nhật!');
                return;
            }
            const oldAccount = accounts[idx];

            // Lấy dữ liệu mới từ form
            const formData = new FormData(editAccountForm);
            // Xử lý avatar
            let avatar = oldAccount.avatar || '';
            const avatarFile = formData.get('file-upload');
            if (avatarFile && avatarFile.size > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatar = e.target.result;
                    saveUpdate();
                };
                reader.readAsDataURL(avatarFile);
            } else {
                saveUpdate();
            }

            function saveUpdate() {
                // Validate
                const errors = [];
                const name = formData.get('fullName').trim();
                const dob = formData.get('dob');
                const phone = formData.get('phone').trim();
                const email = formData.get('email').trim();
                const address = formData.get('address').trim();
                const type = formData.get('accountType');
                // Validate chung
                if (!name) errors.push('Họ và tên không được để trống!');
                if (!phone) errors.push('Số điện thoại không được để trống!');
                if (!/^0[0-9]{9}$/.test(phone)) errors.push('Số điện thoại phải đúng 10 số và bắt đầu bằng 0!');
                if (!email) errors.push('Email không được để trống!');
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email không đúng định dạng!');
                if (!dob) errors.push('Ngày sinh không được để trống!');
                if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) errors.push('Ngày sinh không đúng định dạng!');
                if (!address) errors.push('Quê quán không được để trống!');
                if (!type) errors.push('Loại tài khoản không được để trống!');

                // Kiểm tra trùng email/sđt (trừ chính mình)
                if (accounts.some((acc, i) => i !== idx && acc.email === email)) errors.push('Email đã tồn tại!');
                if (accounts.some((acc, i) => i !== idx && acc.phone === phone)) errors.push('Số điện thoại đã tồn tại!');

                // Nếu là sinh viên
                let studentInfo = undefined;
                if (type === 'Sinh viên') {
                    const school = formData.get('school');
                    const studentId = formData.get('studentId');
                    const course = formData.get('course');
                    const major = formData.get('major');
                    if (!school) errors.push('Trường không được để trống!');
                    if (!studentId) errors.push('Mã sinh viên không được để trống!');
                    if (!course) errors.push('Khóa không được để trống!');
                    if (!major) errors.push('Chuyên ngành không được để trống!');
                    studentInfo = { school, studentId, course, major };
                }

                if (errors.length > 0) {
                    showToast('error', errors.join('<br>'));
                    return;
                }

                // Cập nhật lại object
                const updatedAccount = {
                    ...oldAccount,
                    name,
                    dob,
                    phone,
                    email,
                    address,
                    type,
                    avatar,
                    ...(type === 'Sinh viên' ? { studentInfo } : { studentInfo: undefined })
                };
                accounts[idx] = updatedAccount;
                localStorage.setItem('accounts', JSON.stringify(accounts));

                // Cập nhật lại giao diện
                fillAccountData(updatedAccount);
                // Cập nhật lại phần hiển thị thông tin cá nhân (nếu có)
                if (typeof displayAccountData === 'function') {
                    displayAccountData(updatedAccount);
                }

                showToast('success', 'Cập nhật thông tin thành công');
                editAccountModal.classList.add('hidden');
            }
        });
    }

    // Khởi tạo
    const id = getAccountIdFromUrl();
    if (id) {
        const account = getAccountById(id);
        fillAccountData(account);
    }
});