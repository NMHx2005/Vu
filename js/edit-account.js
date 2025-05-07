document.addEventListener('DOMContentLoaded', function () {
    // Các phần tử DOM
    const editAccountModal = document.getElementById('editAccountModal');
    const editButton = document.querySelector('.profile-header__edit-button');
    const closeModalButton = document.getElementById('closeModalButton');
    const cancelModalButton = document.getElementById('cancelModalButton');
    const accountTypeSelect = document.getElementById('accountType');
    const studentInfoSection = document.getElementById('studentInfoSectionContainer');
    const editAccountForm = document.getElementById('editAccountForm');

    // Lấy id tài khoản từ URL
    function getAccountIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) {
            showToast('error', 'Không tìm thấy ID tài khoản trong URL!');
            return null;
        }
        return id;
    }

    // Lấy dữ liệu tài khoản từ localStorage
    function getAccountById(id) {
        try {
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            const account = accounts.find(acc => acc.id === id);
            if (!account) {
                showToast('error', 'Không tìm thấy tài khoản với ID này!');
            }
            return account;
        } catch (err) {
            showToast('error', 'Lỗi khi truy cập dữ liệu tài khoản!');
            console.error('[Lỗi getAccountById]', err);
            return null;
        }
    }

    // Hiển thị dữ liệu tài khoản lên giao diện
    function displayAccountData(account) {
        if (!account) return;

        // Ảnh đại diện
        const defaultAvatar = '../images/Avatar_edit.png';
        const avatarImg = document.querySelector('.profile-header__avatar');
        const avatarPreview = document.querySelector('.avatar-upload__preview img');
        if (account.avatar) {
            if (avatarImg) avatarImg.src = account.avatar;
            if (avatarPreview) avatarPreview.src = account.avatar;
        } else {
            if (avatarImg) avatarImg.src = defaultAvatar;
            if (avatarPreview) avatarPreview.src = defaultAvatar;
        }

        // Tên sinh viên
        const profileName = document.querySelector('.profile-header__name');
        if (profileName) profileName.textContent = account.name || 'Không xác định';

        // Loại tài khoản
        const profileRole = document.querySelector('.profile-header__role');
        if (profileRole) {
            profileRole.textContent = account.type || 'Không xác định';
            profileRole.className = `status-badge status-badge--${getStatusBadgeClass(account.type)}`;
        }

        // Thông tin cá nhân
        const infoId = document.querySelector('.info-item__value--id');
        const infoDob = document.querySelector('.info-item__value--dob');
        const infoAddress = document.querySelector('.info-item__value--address');
        const infoPhone = document.querySelector('.info-item__value--phone');
        const infoEmail = document.querySelector('.info-item__value--email');
        const infoSchool = document.querySelector('.info-item__value--school');
        const infoStudentId = document.querySelector('.info-item__value--studentId');
        const infoCourse = document.querySelector('.info-item__value--course');
        const infoMajor = document.querySelector('.info-item__value--major');

        if (infoId) infoId.textContent = account.id || 'Không có';
        if (infoAddress) infoAddress.textContent = account.address || 'Không có';
        if (infoPhone) infoPhone.textContent = account.phone || 'Không có';
        if (infoEmail) infoEmail.textContent = account.email || 'Không có';

        // Ngày sinh (chuyển về dd/mm/yyyy)
        if (infoDob) {
            let dob = account.dob || '';
            if (dob && dob.includes('-')) {
                const [year, month, day] = dob.split('-');
                dob = `${day}/${month}/${year}`;
            }
            infoDob.textContent = dob || 'Không có';
        }

        // Thông tin sinh viên (nếu có)
        if (account.type === 'Sinh viên' && account.studentInfo) {
            if (infoSchool) infoSchool.textContent = account.studentInfo.school || 'Không có';
            if (infoStudentId) infoStudentId.textContent = account.studentInfo.studentId || 'Không có';
            if (infoCourse) infoCourse.textContent = account.studentInfo.course || 'Không có';
            if (infoMajor) infoMajor.textContent = account.studentInfo.major || 'Không có';
        } else {
            if (infoSchool) infoSchool.textContent = 'Không áp dụng';
            if (infoStudentId) infoStudentId.textContent = 'Không áp dụng';
            if (infoCourse) infoCourse.textContent = 'Không áp dụng';
            if (infoMajor) infoMajor.textContent = 'Không áp dụng';
        }
    }

    // Điền dữ liệu vào form/modal
    function fillAccountData(account) {
        if (!account) return;

        // Lưu trữ dữ liệu ban đầu để khôi phục khi hủy
        window.initialAccountData = { ...account };

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
        toggleStudentInfo();
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

    // Hàm phụ trợ cho màu sắc của badge
    function getStatusBadgeClass(type) {
        const typeClasses = {
            'Sinh viên': 'green',
            'Nhà trường': 'orange',
            'Giảng viên': 'red',
            'Trợ giảng': 'blue',
            'Nhân viên dịch vụ': 'purple'
        };
        return typeClasses[type] || 'gray';
    }

    // Toast notification chuẩn hóa
    function closeEditModal(type, message) {
        // Xóa toast cũ nếu có
        const existingToast = document.querySelector('.toast-custom');
        if (existingToast) existingToast.remove();

        // Chọn icon và màu theo type
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
        }

        // Tạo toast
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
            z-index: 9999;
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

    // Hàm mở modal
    function openEditModal() {
        if (editAccountModal) {
            editAccountModal.classList.remove('hidden');
            console.log('Modal Cập nhật tài khoản đã mở');
            // Điền dữ liệu ban đầu khi mở modal
            const id = getAccountIdFromUrl();
            if (id) {
                const account = getAccountById(id);
                if (account) {
                    fillAccountData(account);
                }
            }
        } else {
            console.error('Không tìm thấy phần tử Modal Cập nhật tài khoản để mở');
        }
    }

    // Hàm đóng modal và khôi phục dữ liệu ban đầu
    function closeEditModal() {
        if (editAccountModal) {
            editAccountModal.classList.add('hidden');
            // Khôi phục dữ liệu ban đầu từ initialAccountData
            if (window.initialAccountData) {
                fillAccountData(window.initialAccountData);
            }
        } else {
            console.error('Không tìm thấy phần tử Modal Cập nhật tài khoản để đóng');
        }
    }

    // Hiển thị/ẩn phần thông tin sinh viên
    function toggleStudentInfo() {
        if (accountTypeSelect && studentInfoSection) {
            const isStudent = accountTypeSelect.value === 'Sinh viên';
            studentInfoSection.classList.toggle('hidden', !isStudent);
        }
    }

    // Gắn các trình xử lý sự kiện cho modal
    if (editButton) {
        editButton.addEventListener('click', openEditModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeEditModal);
    }

    if (cancelModalButton) {
        cancelModalButton.addEventListener('click', closeEditModal);
    }

    // Đóng modal khi nhấp chuột ra ngoài
    if (editAccountModal) {
        editAccountModal.addEventListener('click', (event) => {
            const modalContent = editAccountModal.querySelector('.modal-content');
            if (event.target === editAccountModal && modalContent && !modalContent.contains(event.target)) {
                closeEditModal();
            }
        });
    }

    // Đóng modal bằng phím Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && editAccountModal && !editAccountModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });

    // Ẩn/hiện thông tin sinh viên khi chọn loại tài khoản
    if (accountTypeSelect && studentInfoSection) {
        accountTypeSelect.addEventListener('change', toggleStudentInfo);
    }

    // Lắng nghe submit form cập nhật
    if (editAccountForm) {
        editAccountForm.addEventListener('submit', function (e) {
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
                reader.onload = function (e) {
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
                displayAccountData(updatedAccount);

                showToast('success', 'Cập nhật thông tin thành công');
                editAccountModal.classList.add('hidden');
            }
        });
    }

    // Toast notification chuẩn hóa cho xóa, thêm, cập nhật
    function showToast(type, message) {
        // Xóa toast cũ nếu có
        const existingToast = document.querySelector('.toast-custom');
        if (existingToast) existingToast.remove();

        // Chọn icon và màu theo type
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

        // Tạo toast
        const toast = document.createElement('div');
        toast.className = 'toast-custom';
        toast.innerHTML = `
            <span style="
                display:inline-flex;align-items:center;justify-content:center;
                width:40px;height:40px;border-radius:50%;background:${bgColor};margin-right:16px;
            ">${iconHtml}</span>
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
            z-index: 9999;
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

    // Khởi tạo
    const id = getAccountIdFromUrl();
    if (id) {
        const account = getAccountById(id);
        if (account) {
            displayAccountData(account);
            fillAccountData(account);
        }
    }
});