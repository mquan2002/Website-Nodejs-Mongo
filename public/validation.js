// validation.js
// Thêm sự kiện input cho từng ô nhập
document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('registerEmail');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const genderInput = document.getElementById('gender');
    const passwordInput = document.getElementById('registerPassword');
    const registrationForm = document.getElementById('registrationForm');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneNumberError = document.getElementById('phoneNumberError');
    const genderError = document.getElementById('genderError');
    const passwordError = document.getElementById('passwordError');

    // Thêm sự kiện input cho từng ô nhập
    nameInput.addEventListener('input', async function () {
        let name = nameInput.value;
        name = removeDiacritics(name); // Loại bỏ các dấu trong tên
        name = name.replace(/[^a-zA-Z0-9 ]/g, ''); // Loại bỏ các ký tự không phải chữ cái, số và khoảng trắng
        nameInput.value = name; // Gán lại giá trị đã loại bỏ dấu và ký tự không mong muốn vào trường nhập

        if (name.length < 5) {
            nameError.innerText = 'Tên phải có ít nhất 5 ký tự.';
        } else {
            nameError.innerText = '';
            const isDuplicate = await checkDuplicateData();
            if (isDuplicate && isDuplicate.nameExists) {
                nameError.innerText = 'Tên đã được sử dụng.';
            }
        }
    });

    emailInput.addEventListener('blur', async function () {
        const email = emailInput.value;
        if (!validateEmail(email)) {
            emailError.innerText = 'Email không hợp lệ.';
            return;
        }

        const isDuplicate = await checkDuplicateData();
        if (isDuplicate && isDuplicate.emailExists) {
            emailError.innerText = 'Email đã được sử dụng.';
        } else {
            emailError.innerText = '';
        }
    });

    phoneNumberInput.addEventListener('blur', async function () {
        const phoneNumber = phoneNumberInput.value;
        if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 10) {
            phoneNumberError.innerText = 'Số điện thoại không hợp lệ.';
        } else {
            phoneNumberError.innerText = '';
            const isDuplicate = await checkDuplicateData();
            if (isDuplicate && isDuplicate.phoneNumberExists) {
                phoneNumberError.innerText = 'Số điện thoại đã được sử dụng.';
            } else {
                phoneNumberError.innerText = '';
            }
        }
    });

    genderInput.addEventListener('change', function () {
        const gender = genderInput.value;
        if (gender === '') {
            genderError.innerText = 'Vui lòng chọn giới tính.';
        } else {
            genderError.innerText = '';
        }
    });

    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        if (password.length < 8 || !/[A-Z]/.test(password)) {
            passwordError.innerText = 'Mật khẩu phải có ít nhất 8 ký tự và ít nhất 1 chữ cái in hoa.';
        } else {
            passwordError.innerText = '';
        }
    });

    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn việc submit mặc định của form

        const name = nameInput.value;
        const email = emailInput.value;
        const phoneNumber = phoneNumberInput.value;
        const gender = genderInput.value;
        const password = passwordInput.value;

        console.log("Dữ liệu đầu vào:", { name, email, phoneNumber, gender, password }); // Thêm console.log ở đây để ghi log dữ liệu đầu vào

        let valid = true; // Biến này để kiểm tra xem có lỗi không

        // Kiểm tra điều kiện cho từng trường
        if (name.length < 5) {
            nameError.innerText = 'Tên phải có ít nhất 5 ký tự.';
            valid = false;
        } else {
            nameError.innerText = '';
            const isDuplicate = await checkDuplicateData();
            if (isDuplicate && isDuplicate.nameExists) {
                nameError.innerText = 'Tên đã được sử dụng.';
                valid = false;
            }
        }

        if (!validateEmail(email)) {
            emailError.innerText = 'Email không hợp lệ.';
            valid = false;
        } else {
            emailError.innerText = '';
            const isDuplicate = await checkDuplicateData();
            if (isDuplicate && isDuplicate.emailExists) {
                emailError.innerText = 'Email đã được sử dụng.';
                valid = false;
            }
        }

        if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 10) {
            phoneNumberError.innerText = 'Số điện thoại không hợp lệ.';
            valid = false;
        } else {
            phoneNumberError.innerText = '';
            const isDuplicate = await checkDuplicateData();
            if (isDuplicate && isDuplicate.phoneNumberExists) {
                phoneNumberError.innerText = 'Số điện thoại đã được sử dụng.';
                valid = false;
            }
        }

        if (gender === '') {
            genderError.innerText = 'Vui lòng chọn giới tính.';
            valid = false;
        } else {
            genderError.innerText = '';
        }

        if (password.length < 8 || !/[A-Z]/.test(password)) {
            passwordError.innerText = 'Mật khẩu phải có ít nhất 8 ký tự và ít nhất 1 chữ cái in hoa.';
            valid = false;
        } else {
            passwordError.innerText = '';
        }

        // Nếu không có lỗi, cho phép submit
        if (valid) {
            registrationForm.submit();
        }
    });

    async function checkDuplicateData() {
        try {
            const response = await fetch('/check_duplicate_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    phoneNumber: phoneNumberInput.value,
                    name: nameInput.value
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return true; // Trả về true nếu có lỗi xảy ra
        }
    }

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // Thêm hàm removeDiacritics
    function removeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
});
