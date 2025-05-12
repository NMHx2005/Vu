document.addEventListener('DOMContentLoaded', function() {
    // Các phần tử DOM
    const searchInput = document.querySelector('.filters-search__search-input');
    const tableBody = document.querySelector('.data-table__body');
    const paginationInfo = document.querySelector('.pagination__info');
    const prevPageButton = document.querySelector('.pagination__button:first-child');
    const nextPageButton = document.querySelector('.pagination__button:last-child');
    const downloadExcelButton = document.querySelector('.button:first-child');
    const importFileButton = document.querySelector('.button:nth-child(2)');
    const addAccountButton = document.querySelector('.button--primary');
    const deleteButtons = document.querySelectorAll('.data-table__action-button--delete');
    const editButtons = document.querySelectorAll('.data-table__action-button--edit');

    // Các phần tử Modal
    const addAccountModal = document.getElementById('addAccountModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const cancelModalButton = document.querySelector('.modal__footer-button--cancel');
    const submitModalButton = document.querySelector('.modal__footer-button--submit');
    const studentInfoSection = document.getElementById('studentInfoSectionContainer');
    const accountTypeSelect = document.getElementById('accountType');
    const editAccountModal = document.getElementById('editAccountModal');

    // Biến phân trang
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;

    // Avatar mặc định (base64 image)
    const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC';

    // Tải dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [
    {
        "id": "TK002343",
        "name": "Nguyễn Thị Minh Anh",
        "email": "minhanh2003@gmail.com",
        "dob": "2003-03-15",
        "phone": "0935123456",
        "address": "Hà Nội",
        "type": "Sinh viên",
        "studentInfo": {
            "school": "Học viện công nghệ BCVT (PTIT)",
            "studentId": "20210315",
            "course": "2021-2026",
            "major": "Công nghệ Thông tin"
        },
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002344",
        "name": "Trần Văn Hùng",
        "email": "hungtran94@yahoo.com",
        "dob": "1994-07-22",
        "phone": "0987654321",
        "address": "TP. Hồ Chí Minh",
        "type": "Giảng viên",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002345",
        "name": "Lê Thị Hồng Nhung",
        "email": "nhungle2001@gmail.com",
        "dob": "2001-11-30",
        "phone": "0912345678",
        "address": "Đà Nẵng",
        "type": "Sinh viên",
        "studentInfo": {
            "school": "Trường Đại học Khoa học Tự nhiên",
            "studentId": "20211130",
            "course": "2019-2024",
            "major": "Khoa học Máy tính"
        },
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002346",
        "name": "Phạm Quốc Bảo",
        "email": "bao.pham89@gmail.com",
        "dob": "1989-05-12",
        "phone": "0978123456",
        "address": "Cần Thơ",
        "type": "Nhà trường",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002347",
        "name": "Vũ Thị Thanh Tâm",
        "email": "tamvu2004@outlook.com",
        "dob": "2004-09-08",
        "phone": "0905123789",
        "address": "Hải Phòng",
        "type": "Trợ giảng",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002348",
        "name": "Hoàng Minh Đức",
        "email": "duc.hoang95@gmail.com",
        "dob": "1995-12-25",
        "phone": "0945678901",
        "address": "Bình Dương",
        "type": "Nhân viên dịch vụ",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002349",
        "name": "Đặng Thị Lan",
        "email": "lan.dang2002@gmail.com",
        "dob": "2002-04-18",
        "phone": "0923456789",
        "address": "Quảng Ninh",
        "type": "Sinh viên",
        "studentInfo": {
            "school": "Trường Đại học Phenikaa",
            "studentId": "20220418",
            "course": "2020-2025",
            "major": "Quản trị Kinh doanh"
        },
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002350",
        "name": "Bùi Quang Vinh",
        "email": "vinhbui88@yahoo.com",
        "dob": "1988-06-03",
        "phone": "0967890123",
        "address": "Khánh Hòa",
        "type": "Giảng viên",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002351",
        "name": "Ngô Thị Mai",
        "email": "mai.ngo2000@gmail.com",
        "dob": "2000-02-14",
        "phone": "0936789012",
        "address": "Thanh Hóa",
        "type": "Sinh viên",
        "studentInfo": {
            "school": "Trường Đại học Khoa học Tự nhiên",
            "studentId": "20200214",
            "course": "2018-2023",
            "major": "Khoa học Máy tính"
        },
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002352",
        "name": "Lý Văn Tuấn",
        "email": "tuanly97@gmail.com",
        "dob": "1997-10-29",
        "phone": "0989012345",
        "address": "Hưng Yên",
        "type": "Nhà trường",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002353",
        "name": "Trương Thị Hà",
        "email": "ha.truong2005@gmail.com",
        "dob": "2005-01-07",
        "phone": "0917890123",
        "address": "Nam Định",
        "type": "Trợ giảng",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    },
    {
        "id": "TK002354",
        "name": "Đoàn Minh Nhật",
        "email": "nhatdoan93@gmail.com",
        "dob": "1993-08-16",
        "phone": "0941234567",
        "address": "Quảng Nam",
        "type": "Nhân viên dịch vụ",
        "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB7Y+7DYAwDAVf+EjADAxBmXGyCWETRoGOkiGYAVEgQYcQXydxEylXWtadDQS8Q8msNtmPYUhVpl1VJhintafsR7BCaOonlgF6xCFAizgG/iMMge+IuA6UzDdYs+l2WJrzhOmDQ3c7WMCQ9w9F0w6zviXBwrOcKfAuZwh8yx0D/3KHAE1uhZKFRsArdvelKzKR3+PhAAAAAElFTkSuQmCC"
    }
];

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

    // Hiển thị/ẩn phần thông tin sinh viên
    function toggleStudentInfoSection() {
        const accountType = document.getElementById('accountType').value;
        const isStudent = accountType === 'Sinh viên';
        if (studentInfoSection) {
            studentInfoSection.classList.toggle('hidden', !isStudent);
        }
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
                // dd/mm/yyyy -> yyyy-mm-dd
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
            // Nếu không phải sinh viên, reset các trường sinh viên
            document.getElementById('school').value = '';
            document.getElementById('studentId').value = '';
            document.getElementById('course').value = '';
            document.getElementById('major').value = '';
        }
    }

    // Danh sách loại tài khoản
    const ACCOUNT_TYPES = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Sinh viên', value: 'Sinh viên' },
        { label: 'Nhà trường', value: 'Nhà trường' },
        { label: 'Giảng viên', value: 'Giảng viên' },
        { label: 'Trợ giảng', value: 'Trợ giảng' },
        { label: 'Nhân viên dịch vụ', value: 'Nhân viên dịch vụ' }
    ];
    let currentTab = 'all';
    const accountTabsList = document.getElementById('accountTabsList');

    function getAccountTypeCounts() {
        const counts = {
            all: accounts.length,
            'Sinh viên': 0,
            'Nhà trường': 0,
            'Giảng viên': 0,
            'Trợ giảng': 0,
            'Nhân viên dịch vụ': 0
        };
        accounts.forEach(acc => {
            if (counts[acc.type] !== undefined) counts[acc.type]++;
        });
        return counts;
    }

    function renderAccountTabs() {
        if (!accountTabsList) return;
        const counts = getAccountTypeCounts();
        accountTabsList.innerHTML = ACCOUNT_TYPES.map(tab => `
            <button class="account-tabs__button${currentTab === tab.value ? ' account-tabs__button--active' : ''}" data-type="${tab.value}">
                ${tab.label} <span class="account-tabs__count">${counts[tab.value] || 0}</span>
            </button>
        `).join('');
        // Gắn lại sự kiện click
        accountTabsList.querySelectorAll('.account-tabs__button').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                currentTab = type;
                renderAccountTabs();
                filterAndRenderTable();
            });
        });
    }

    function filterAndRenderTable() {
        let data = accounts;
        if (currentTab !== 'all') {
            data = accounts.filter(acc => acc.type === currentTab);
        }
        renderTable(data);
    }

    // Gọi khi thêm/xóa/sửa tài khoản
    function updateTabsAndTable() {
        renderAccountTabs();
        filterAndRenderTable();
    }

    // Thay thế renderTable ban đầu bằng filterAndRenderTable trong init
    function init() {
        renderAccountTabs();
        filterAndRenderTable();
        setupEventListeners();
    }

    // Thiết lập các sự kiện
    function setupEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }
        if (prevPageButton) {
            prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
        }
        if (nextPageButton) {
            nextPageButton.addEventListener('click', () => changePage(currentPage + 1));
        }
        if (downloadExcelButton) {
            downloadExcelButton.addEventListener('click', downloadExcel);
        }
        if (importFileButton) {
            importFileButton.addEventListener('click', handleFileImport);
        }
        if (addAccountButton) {
            addAccountButton.addEventListener('click', openAddAccountModal);
        }
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeAddAccountModal);
        }
        if (cancelModalButton) {
            cancelModalButton.addEventListener('click', closeAddAccountModal);
        }
        if (accountTypeSelect) {
            accountTypeSelect.addEventListener('change', handleAccountTypeChange);
        }

        const addAccountForm = document.getElementById('addAccountForm');
        if (addAccountForm) {
            addAccountForm.addEventListener('submit', handleAddAccountSubmit);
        }

        document.addEventListener('click', function(event) {
            if (event.target.closest('.data-table__action-button--delete')) {
                const button = event.target.closest('.data-table__action-button--delete');
                const accountId = button.dataset.id;
                handleDelete(accountId);
            }
        });

        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.addEventListener('change', function(event) {
            if (event.target.matches('.avatar-upload__file-input')) {
                const file = event.target.files[0];
                if (file) {
                    if (!['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'].includes(file.type)) {
                        showToast('error', 'Định dạng ảnh không hợp lệ! Chỉ hỗ trợ PNG, JPEG, GIF, SVG.');
                        return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        showToast('error', 'Ảnh quá lớn! Kích thước tối đa là 2MB.');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const avatarPreview = event.target.closest('.avatar-upload').querySelector('.avatar-upload__preview');
                        avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar preview" class="avatar-upload__preview-image">`;
                    };
                    reader.onerror = () => showToast('error', 'Lỗi khi đọc file ảnh!');
                    reader.readAsDataURL(file);
                }
            }
        });

        // Đóng modal khi ấn nút Hủy
        if (cancelModalButton && editAccountModal) {
            cancelModalButton.addEventListener('click', function(e) {
                e.preventDefault();
                editAccountModal.classList.add('hidden');
            });
        }

        // Xử lý form cập nhật thông tin
        const editAccountForm = document.getElementById('editAccountForm');
        if (editAccountForm) {
            editAccountForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(editAccountForm);
                const avatarFile = formData.get('file-upload');
                const accountId = getAccountIdFromUrl();

                const validationErrors = validateForm(formData);
                if (validationErrors.length > 0) {
                    showValidationErrors(validationErrors);
                    return;
                }

                let avatarBase64 = null;
                try {
                    avatarBase64 = await readAvatarFileAsync(avatarFile);
                } catch (err) {
                    showToast('error', err.message);
                    return;
                }

                const email = formData.get('email');
                const phone = formData.get('phone');
                const currentAccount = getAccountById(accountId);

                // Kiểm tra email trùng lặp (trừ tài khoản hiện tại)
                if (accounts.some(acc => acc.email === email && acc.id !== accountId)) {
                    showToast('error', 'Email đã tồn tại trong hệ thống!');
                    return;
                }

                // Kiểm tra số điện thoại trùng lặp (trừ tài khoản hiện tại)
                if (accounts.some(acc => acc.phone === phone && acc.id !== accountId)) {
                    showToast('error', 'Số điện thoại đã tồn tại trong hệ thống!');
                    return;
                }

                // Cập nhật thông tin tài khoản
                const updatedAccount = {
                    ...currentAccount,
                    name: formData.get('fullName').trim(),
                    email: email.trim(),
                    dob: convertDateToISO(formData.get('dob')),
                    phone: formatPhoneNumber(formData.get('phone').trim()),
                    address: formData.get('address').trim(),
                    type: formData.get('accountType'),
                    avatar: avatarBase64 || currentAccount.avatar
                };

                if (updatedAccount.type === 'Sinh viên') {
                    updatedAccount.studentInfo = {
                        school: formData.get('school') || '',
                        studentId: formData.get('studentId') || '',
                        course: formData.get('course') || '',
                        major: formData.get('major') || ''
                    };
                } else {
                    delete updatedAccount.studentInfo;
                }

                // Cập nhật vào mảng accounts
                const accountIndex = accounts.findIndex(acc => acc.id === accountId);
                if (accountIndex !== -1) {
                    accounts[accountIndex] = updatedAccount;
                    saveAccountsToLocalStorage();
                    showToast('success', 'Cập nhật thông tin thành công!');
                    // Cập nhật giao diện
                    fillAccountData(updatedAccount);
                    // Đóng modal
                    if (editAccountModal) {
                        editAccountModal.classList.add('hidden');
                    }
                }
            });
        }
    }

    function openAddAccountModal() {
        if (addAccountModal) {
            addAccountModal.classList.remove('hidden');
            document.getElementById('addAccountForm').reset();
            if (studentInfoSection) {
                studentInfoSection.classList.add('hidden');
            }
            const avatarPreview = document.querySelector('.avatar-upload__preview');
            if (avatarPreview) {
                avatarPreview.innerHTML = `
                    <span class="avatar-upload__placeholder-icon">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </span>
                `;
            }
        }
    }

    function closeAddAccountModal() {
        addAccountModal.classList.add('hidden');
    }

    function handleAccountTypeChange() {
        const isStudent = this.value === 'Sinh viên';
        if (studentInfoSection) {
            studentInfoSection.classList.toggle('hidden', !isStudent);
        }
    }

    function readAvatarFileAsync(file) {
        return new Promise((resolve, reject) => {
            if (!file || file.size === 0) return resolve(null);
            if (!['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'].includes(file.type)) {
                reject(new Error('Định dạng ảnh không hợp lệ! Chỉ hỗ trợ PNG, JPEG, GIF, SVG.'));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                reject(new Error('Ảnh quá lớn! Kích thước tối đa là 2MB.'));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Lỗi khi đọc file ảnh!'));
            reader.readAsDataURL(file);
        });
    }

    async function handleAddAccountSubmit(event) {
        event.preventDefault();
        const form = document.getElementById('addAccountForm');
        const formData = new FormData(form);
        const avatarFile = formData.get('file-upload');
        console.log('[DEBUG] FormData:', Object.fromEntries(formData.entries()));

        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            showValidationErrors(validationErrors);
            return;
        }

        let avatarBase64 = null;
        try {
            avatarBase64 = await readAvatarFileAsync(avatarFile);
        } catch (err) {
            showToast('error', err.message);
            return;
        }

        const email = formData.get('email');
        if (accounts.some(acc => acc.email === email)) {
            showToast('error', 'Email đã tồn tại trong hệ thống!');
            return;
        }

        const phone = formData.get('phone');
        if (accounts.some(acc => acc.phone === phone)) {
            showToast('error', 'Số điện thoại đã tồn tại trong hệ thống!');
            return;
        }

        const newAccount = {
            id: generateAccountId(),
            name: formData.get('fullName').trim(),
            email: email.trim(),
            dob: convertDateToISO(formData.get('dob')),
            phone: formatPhoneNumber(formData.get('phone').trim()),
            address: formData.get('address').trim(),
            type: formData.get('accountType'),
            avatar: avatarBase64 || defaultAvatar
        };

        if (newAccount.type === 'Sinh viên') {
            newAccount.studentInfo = {
                school: formData.get('school') || '',
                studentId: formData.get('studentId') || '',
                course: formData.get('course') || '',
                major: formData.get('major') || ''
            };
        }
        console.log('[DEBUG] New Account:', newAccount);

        saveAccountWithAvatar(newAccount);
    }

    function validateForm(formData) {
        const errors = [];
        const requiredFields = {
            'fullName': 'Họ và tên',
            'email': 'Email',
            'dob': 'Ngày sinh',
            'phone': 'Số điện thoại',
            'address': 'Quê quán',
            'accountType': 'Loại tài khoản'
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                errors.push(`${label} không được để trống!`);
            }
        }

        const email = formData.get('email');
        if (email && !isValidEmail(email)) {
            errors.push('Email không đúng định dạng!');
        }

        const phone = formData.get('phone');
        if (phone && !isValidPhone(phone)) {
            errors.push('Số điện thoại không hợp lệ! (Phải bắt đầu bằng 0 và có đúng 10 chữ số)');
        }

        const dob = formData.get('dob');
        if (dob && !isValidDate(dob)) {
            errors.push('Ngày sinh không hợp lệ! (Định dạng DD/MM/YYYY, ngày/tháng/năm phải hợp lý)');
        }

        if (formData.get('accountType') === 'Sinh viên') {
            const studentFields = {
                'school': 'Trường',
                'studentId': 'Mã sinh viên',
                'course': 'Khóa học',
                'major': 'Chuyên ngành'
            };
            for (const [field, label] of Object.entries(studentFields)) {
                const value = formData.get(field);
                if (!value || value.trim() === '') {
                    errors.push(`${label} không được để trống!`);
                }
            }
        }

        return errors;
    }

    function showValidationErrors(errors) {
        if (errors.length > 0) {
            showToast('error', errors.map(e => `• ${e}`).join('<br>'));
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^0[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    function isValidDate(dateString) {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dateString)) return false;

        const [day, month, year] = dateString.split('/').map(Number);
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 1900 || year > new Date().getFullYear()) return false;

        const date = new Date(year, month - 1, day);
        return date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
    }

    function formatPhoneNumber(phone) {
        if (typeof phone !== 'string') return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 9) {
            return '0' + cleaned;
        } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
            return cleaned;
        }
        return cleaned;
    }

    function saveAccountWithAvatar(account) {
        if (!account.id || !account.name || !account.email || !account.type) {
            showToast('error', 'Thiếu thông tin bắt buộc!');
            return;
        }
        if (accounts.some(acc => acc.email === account.email)) {
            showToast('error', 'Email đã tồn tại trong hệ thống!');
            return;
        }
        if (accounts.some(acc => acc.phone === account.phone)) {
            showToast('error', 'Số điện thoại đã tồn tại trong hệ thống!');
            return;
        }
        accounts.push(account);
        saveAccountsToLocalStorage();
        updateTabsAndTable();
        closeAddAccountModal();
        showToast('success', 'Thêm tài khoản mới thành công!');
    }

    function generateAccountId() {
        const lastId = accounts.length > 0 ? 
            parseInt(accounts[accounts.length - 1].id.replace('TK', '')) : 0;
        return `TK${String(lastId + 1).padStart(6, '0')}`;
    }

    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredAccounts = accounts.filter(account => 
            account.id.toLowerCase().includes(searchTerm) || 
            account.email.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredAccounts);
    }

    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable();
        updatePaginationUI();
    }

    function updatePaginationUI() {
        if (prevPageButton) {
            prevPageButton.disabled = currentPage === 1;
        }
        if (nextPageButton) {
            nextPageButton.disabled = currentPage === totalPages;
        }
        if (paginationInfo) {
            paginationInfo.innerHTML = `Trang <span class="pagination__info-page">${currentPage}</span> trong <span class="pagination__info-page">${totalPages}</span>`;
        }
    }

    function renderTable(data = accounts) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        totalPages = Math.ceil(data.length / itemsPerPage);
        updatePaginationUI();

        if (tableBody) {
            tableBody.innerHTML = paginatedData.map(account => `
                <tr>
                    <td><input type="checkbox" class="form-checkbox"></td>
                    <td><strong>${account.id}</strong></td>
                    <td><strong>${account.name}</strong></td>
                    <td>${account.email}</td>
                    <td>${formatDate(account.dob)}</td>
                    <td>${formatPhoneNumber(account.phone || '')}</td>
                    <td>${account.address}</td>
                    <td>
                        <span class="status-badge status-badge--${getStatusBadgeClass(account.type)}">${account.type}</span>
                    </td>
                    <td>
                        <div class="data-table__actions">
                            <button class="data-table__action-button data-table__action-button--delete" data-id="${account.id}">
                                <img src="../images/trash-2.png" alt="delete">
                            </button>
                            <a href="edit-account.html?id=${account.id}" class="data-table__action-button data-table__action-button--edit">
                                <img src="../images/edit-2.png" alt="edit">
                            </a>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    function getInitials(name) {
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

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

    function formatDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function saveAccountsToLocalStorage() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    function downloadExcel() {
        const excelData = accounts.map(account => ({
            'Mã tài khoản': account.id,
            'Họ và tên': account.name,
            'Email': account.email,
            'Ngày sinh': formatDate(account.dob),
            'Số điện thoại': formatPhoneNumber(account.phone || ''),
            'Quê quán': account.address,
            'Loại': account.type,
            'Trường': account.studentInfo?.school || '',
            'Mã sinh viên': account.studentInfo?.studentId || '',
            'Khóa': account.studentInfo?.course || '',
            'Chuyên ngành': account.studentInfo?.major || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách tài khoản");
        XLSX.writeFile(workbook, "danh_sach_tai_khoan.xlsx");
    }

    function normalizeHeader(header) {
        return String(header).trim().replace(/\s+/g, ' ');
    }

    function checkRequiredColumns(headers, requiredFields) {
        const normalizedHeaders = headers.map(normalizeHeader);
        const missingColumns = Object.keys(requiredFields).filter(field => 
            !normalizedHeaders.includes(field)
        );
        return missingColumns;
    }

    function validateImportedAccount(item, index) {
        const errors = [];
        const requiredFields = {
            'Mã tài khoản': 'Mã tài khoản',
            'Họ và tên': 'Họ và tên',
            'Email': 'Email',
            'Số điện thoại': 'Số điện thoại',
            'Quê quán': 'Quê quán',
            'Loại': 'Loại tài khoản'
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            const value = item[field] !== undefined ? String(item[field]).trim() : '';
            if (!value) {
                errors.push(`Dòng ${index + 1}: ${label} không được để trống!`);
            }
        }

        const email = item['Email'] !== undefined ? String(item['Email']).trim() : '';
        if (email && !isValidEmail(email)) {
            errors.push(`Dòng ${index + 1}: Email không đúng định dạng!`);
        }
        if (email && accounts.some(acc => acc.email === email)) {
            errors.push(`Dòng ${index + 1}: Email đã tồn tại trong hệ thống!`);
        }

        let phone = item['Số điện thoại'] !== undefined ? String(item['Số điện thoại']).trim() : '';
        phone = formatPhoneNumber(phone);
        if (phone && !isValidPhone(phone)) {
            errors.push(`Dòng ${index + 1}: Số điện thoại không hợp lệ! (Phải bắt đầu bằng 0 và có đúng 10 chữ số)`);
        }
        if (phone && accounts.some(acc => acc.phone === phone)) {
            errors.push(`Dòng ${index + 1}: Số điện thoại đã tồn tại trong hệ thống!`);
        }

        const dob = item['Ngày sinh'];
        if (dob && !isValidExcelDate(String(dob))) {
            errors.push(`Dòng ${index + 1}: Ngày sinh không hợp lệ! (Định dạng DD/MM/YYYY, ngày/tháng/năm phải hợp lý)`);
        }

        const accountType = item['Loại'] !== undefined ? String(item['Loại']).trim() : '';
        if (accountType === 'Sinh viên') {
            const studentFields = {
                'Trường': 'Trường',
                'Mã sinh viên': 'Mã sinh viên',
                'Khóa': 'Khóa học',
                'Chuyên ngành': 'Chuyên ngành'
            };
            for (const [field, label] of Object.entries(studentFields)) {
                const value = item[field] !== undefined ? String(item[field]).trim() : '';
                if (!value) {
                    errors.push(`Dòng ${index + 1}: ${label} không được để trống!`);
                }
            }
        }

        return errors;
    }

    function isValidExcelDate(dateValue) {
        if (!dateValue) return false;

        if (typeof dateValue === 'string' && dateValue.includes('/')) {
            return isValidDate(dateValue);
        }

        if (typeof dateValue === 'string' && dateValue.includes('-')) {
            const [year, month, day] = dateValue.split('-').map(Number);
            const reformatted = `${day}/${month}/${year}`;
            return isValidDate(reformatted);
        }

        if (!isNaN(dateValue) && Number.isInteger(Number(dateValue))) {
            const excelEpoch = new Date(1900, 0, 1);
            const days = Number(dateValue) - 2;
            const date = new Date(excelEpoch.getTime() + days * 86400000);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return year >= 1900 && year <= new Date().getFullYear() && month >= 1 && month <= 12 && day >= 1 && day <= 31;
        }

        return false;
    }

    function convertExcelDateToISO(dateValue) {
        if (!dateValue) return '';

        if (typeof dateValue === 'string' && dateValue.includes('/')) {
            const [day, month, year] = dateValue.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        if (typeof dateValue === 'string' && dateValue.includes('-')) {
            return dateValue;
        }

        if (!isNaN(dateValue) && Number.isInteger(Number(dateValue))) {
            const excelEpoch = new Date(1900, 0, 1);
            const days = Number(dateValue) - 2;
            const date = new Date(excelEpoch.getTime() + days * 86400000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        return '';
    }

    function handleFileImport() {
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
                        const requiredFields = {
                            'Mã tài khoản': 'Mã tài khoản',
                            'Họ và tên': 'Họ và tên',
                            'Email': 'Email',
                            'Số điện thoại': 'Số điện thoại',
                            'Quê quán': 'Quê quán',
                            'Loại': 'Loại tài khoản'
                        };

                        const missingColumns = checkRequiredColumns(headers, requiredFields);
                        if (missingColumns.length > 0) {
                            showToast('error', `File Excel thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
                            return;
                        }

                        const normalizedData = jsonData.slice(1).map(row => {
                            const rowData = {};
                            headers.forEach((header, index) => {
                                const normalizedHeader = normalizeHeader(header);
                                rowData[normalizedHeader] = row[index];
                            });
                            return rowData;
                        }).filter(row => Object.values(row).some(val => val !== undefined && val !== ''));

                        const errors = [];
                        const newAccounts = normalizedData.map((item, index) => {
                            const validationErrors = validateImportedAccount(item, index);
                            if (validationErrors.length > 0) {
                                errors.push(...validationErrors);
                                return null;
                            }

                            const id = String(item['Mã tài khoản'] || generateAccountId()).trim();
                            const email = String(item['Email'] || '').trim();
                            let phone = String(item['Số điện thoại'] || '').trim();
                            phone = formatPhoneNumber(phone);

                            const account = {
                                id: id,
                                name: String(item['Họ và tên'] || '').trim(),
                                email: email,
                                dob: convertExcelDateToISO(item['Ngày sinh']),
                                phone: phone,
                                address: String(item['Quê quán'] || '').trim(),
                                type: String(item['Loại'] || '').trim(),
                                avatar: item['Avatar'] ? String(item['Avatar']).trim() : defaultAvatar
                            };

                            if (account.type === 'Sinh viên') {
                                account.studentInfo = {
                                    school: String(item['Trường'] || '').trim(),
                                    studentId: String(item['Mã sinh viên'] || '').trim(),
                                    course: String(item['Khóa'] || '').trim(),
                                    major: String(item['Chuyên ngành'] || '').trim()
                                };
                            }

                            return account;
                        }).filter(account => account !== null);

                        if (errors.length > 0) {
                            showToast('error', errors.join('<br>'));
                            return;
                        }

                        accounts = [...accounts, ...newAccounts];
                        localStorage.setItem('accounts', JSON.stringify(accounts));
                        updateTabsAndTable();
                        showToast('success', 'Thêm tài khoản mới thành công!');
                    } catch (err) {
                        showToast('error', 'Lỗi khi nhập file! Vui lòng kiểm tra định dạng.');
                        console.error('[handleFileImport Error]', err);
                    }
                };
                reader.onerror = () => showToast('error', 'Lỗi khi đọc file!');
                reader.readAsArrayBuffer(file);
            }
        });
        
        fileInput.click();
    }

    function convertDateToISO(dateString) {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    function handleDelete(accountId) {
        const confirmModal = document.getElementById('deleteConfirmModal');
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const cancelDeleteButton = document.getElementById('cancelDeleteButton');

        if (confirmModal && confirmDeleteButton && cancelDeleteButton) {
            confirmModal.classList.remove('hidden');

            confirmDeleteButton.onclick = () => {
                accounts = accounts.filter(account => account.id !== accountId);
                saveAccountsToLocalStorage();
                updateTabsAndTable();
                confirmModal.classList.add('hidden');
                showToast('trash', 'Đã xóa tài khoản thành công!');
            };

            cancelDeleteButton.onclick = () => {
                confirmModal.classList.add('hidden');
            };
        }
    }

    function handleEdit(event) {
        const accountId = event.currentTarget.href.split('=')[1];
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
        fillAccountData(account);
    }

    init();
});