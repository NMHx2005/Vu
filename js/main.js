const addAccountModal = document.getElementById('addAccountModal');
const openAddAccountModalButton = document.querySelector('.button--primary');
const closeAddAccountModalButton = document.getElementById('closeModalButton');
const cancelAddAccountModalButton = document.getElementById('cancelModalButton');
const accountTypeSelect = document.getElementById('accountType');
const studentInfoSectionContainer = document.getElementById('studentInfoSectionContainer');
const fileInput = document.getElementById('file-upload');
const avatarPreview = document.querySelector('.avatar-upload__preview');

/* === New Delete Confirmation Modal & Toast Code === */
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteSuccessToast = document.getElementById('deleteSuccessToast');
const tableBody = document.querySelector('.data-table__body');
let toastTimer = null; // Variable to hold the timeout ID for the toast

console.log('Modal JS Loaded'); // Check if script runs

/* === Add Account Modal Functions === */
const openAddModal = () => {
    if (addAccountModal) {
        addAccountModal.classList.remove('hidden');
        console.log('Add Account Modal opened');
    } else {
        console.error('Add Account Modal element not found for opening');
    }
};
const closeAddModal = () => {
    if (addAccountModal) {
        addAccountModal.classList.add('hidden');
        console.log('Add Account Modal closed');
    } else {
        console.error('Add Account Modal element not found for closing');
    }
};

// Gán sự kiện mở modal Thêm tài khoản
if (openAddAccountModalButton) {
    console.log('Open Add Account modal button found, attaching listener.');
    openAddAccountModalButton.addEventListener('click', openAddModal);
} else {
    console.error('Open Add Account modal button (.button--primary) not found.');
}

// Gán sự kiện đóng modal Thêm tài khoản
if (closeAddAccountModalButton) {
    console.log('Close Add Account modal button found, attaching listener.');
    closeAddAccountModalButton.addEventListener('click', closeAddModal);
}
if (cancelAddAccountModalButton) {
    console.log('Cancel Add Account modal button found, attaching listener.');
    cancelAddAccountModalButton.addEventListener('click', closeAddModal);
}

// Đóng modal Thêm tài khoản khi click bên ngoài
if (addAccountModal) {
    console.log('Add Account Modal found, attaching outside click listener.');
    addAccountModal.addEventListener('click', (event) => {
        const modalContent = addAccountModal.querySelector('.modal-content');
        if (event.target === addAccountModal && modalContent && !modalContent.contains(event.target)) {
            console.log('Outside click detected on Add Account modal, closing.');
            closeAddModal();
        }
    });
    // Đóng modal bằng phím Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !addAccountModal.classList.contains('hidden')) {
            console.log('Escape key pressed, closing Add Account modal.');
            closeAddModal();
        }
    });
} else {
    console.error('Modal element not found, cannot attach listeners.');
}

// Xử lý upload ảnh
if (fileInput && avatarPreview) {
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`; // Added border-radius
                 console.log('Avatar preview updated.');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Xử lý form thông tin sinh viên
const toggleStudentInfo = () => {
    console.log('Toggling student info section...');
    // Select the container that holds both description and form for student info
    if (accountTypeSelect && studentInfoSectionContainer) {
        const selectedValue = accountTypeSelect.value.trim();
        console.log(`Account type selected: "${selectedValue}"`);
        const isStudent = selectedValue === 'Sinh viên';
        studentInfoSectionContainer.classList.toggle('hidden', !isStudent);
        console.log(`Student section container hidden: ${!isStudent}`);
    } else {
         console.error('Required elements for toggleStudentInfo not found:', {
            accountTypeSelectExists: !!accountTypeSelect,
            studentInfoSectionContainerExists: !!studentInfoSectionContainer
        });
    }
};

if (accountTypeSelect) {
    console.log('Account type select found, attaching change listener and running initial toggle.');
    accountTypeSelect.addEventListener('change', toggleStudentInfo);
    // Run on load
    toggleStudentInfo();
} else {
    console.error('Account type select (#accountType) not found.');
}


/* === Delete Confirmation Modal Functions === */
const openDeleteModal = () => {
    if (deleteConfirmModal) {
        deleteConfirmModal.classList.remove('hidden');
        console.log('Delete Confirm Modal opened');
    } else {
        console.error('Delete Confirm Modal element not found for opening');
    }
};
const closeDeleteModal = () => {
    if (deleteConfirmModal) {
        deleteConfirmModal.classList.add('hidden');
        console.log('Delete Confirm Modal closed');
    } else {
        console.error('Delete Confirm Modal element not found for closing');
    }
};

// Gán sự kiện mở modal Xóa (Event Delegation on Table Body)
if (tableBody) {
    tableBody.addEventListener('click', (event) => {
        // Find the closest delete button ancestor
        const deleteButton = event.target.closest('.data-table__action-button--delete');
        if (deleteButton) {
            console.log('Delete button clicked in table.');
            openDeleteModal();
        }
    });
} else {
    console.error('Table body (.data-table__body) not found for delete button delegation.');
}

// Gán sự kiện đóng modal Xóa
if (cancelDeleteButton) {
    console.log('Cancel Delete button found, attaching listener.');
    cancelDeleteButton.addEventListener('click', closeDeleteModal);
}
if (confirmDeleteButton) {
    console.log('Confirm Delete button found, attaching listener.');
    confirmDeleteButton.addEventListener('click', () => {
        console.log('Confirm Delete button clicked.');
        closeDeleteModal();
        showDeleteSuccessToast();
    });
}

// Đóng modal Xóa khi click bên ngoài
if (deleteConfirmModal) {
    console.log('Delete Confirm Modal found, attaching outside click listener.');
    deleteConfirmModal.addEventListener('click', (event) => {
        const modalContent = deleteConfirmModal.querySelector('.confirm-modal-content');
        if (event.target === deleteConfirmModal && modalContent && !modalContent.contains(event.target)) {
            console.log('Outside click detected on Delete modal, closing.');
            closeDeleteModal();
        }
    });
}

/* === Success Toast Functions === */
const showDeleteSuccessToast = () => {
    if (deleteSuccessToast) {
        // Clear any existing timer to prevent premature hiding if clicked again quickly
        if (toastTimer) {
            clearTimeout(toastTimer);
            console.log('Cleared existing toast timer.');
        }

        console.log('Showing success toast.');
        deleteSuccessToast.classList.remove('hidden');
        deleteSuccessToast.classList.add('show'); // Trigger CSS transition

        // Set timer to hide the toast after 3 seconds (3000 milliseconds)
        toastTimer = setTimeout(() => {
            console.log('Hiding success toast due to timer.');
            deleteSuccessToast.classList.remove('show');
            // Optional: Add hidden back after transition ends if needed
            // setTimeout(() => deleteSuccessToast.classList.add('hidden'), 300); // Match transition duration
            toastTimer = null; // Reset timer variable
        }, 3000);
    } else {
        console.error('Success Toast element not found.');
    }
};


/* === General Event Listeners (like Escape key) === */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Close Add Account Modal if open
        if (addAccountModal && !addAccountModal.classList.contains('hidden')) {
            console.log('Escape key pressed, closing Add Account modal.');
            closeAddModal();
        }
        // Close Delete Confirm Modal if open
        if (deleteConfirmModal && !deleteConfirmModal.classList.contains('hidden')) {
            console.log('Escape key pressed, closing Delete modal.');
            closeDeleteModal();
        }
    }
});