const createBtn = document.getElementById("create");
const loginBtn = document.getElementById("loginBtn");
let firstNameInput = document.getElementById("fName");
const lastNameInput = document.getElementById("lName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const form = document.querySelector("form");
let users = [];

// Clear inputs
function clearInputs() {
  firstNameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
}

// Go to login page
function goToLogin() {
  window.location.href = "singIn.html";
}
loginBtn.addEventListener("click", goToLogin);

// Real-time validation
firstNameInput.addEventListener("input", validateFirstName);
lastNameInput.addEventListener("input", validateLastName);
emailInput.addEventListener("input", validateEmailOrPhone);
passwordInput.addEventListener("input", validatePassword);

// Form submit
form.addEventListener("submit", function (e) {
  e.preventDefault(); // يمنع الريلود

  // تحقق من كل الحقول
  let isFirstNameValid = validateFirstName();
  let isLastNameValid = validateLastName();
  let isEmailValid = validateEmailOrPhone();
  let isPasswordValid = validatePassword();

  if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) {
    // جلب البيانات القديمة من لوكل
    users = JSON.parse(localStorage.getItem("productData")) || [];

    let userData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    users.push(userData);
    localStorage.setItem("productData", JSON.stringify(users));
    clearInputs();

    // تحويل للصفحة التالية
    window.location.href = "singIn.html";
  }
});

// Validation functions
function validateFirstName() {
  let regex = /^[A-Z][a-z]{2,16}$/;
  if (regex.test(firstNameInput.value)) {
    firstNameInput.classList.add("is-valid");
    firstNameInput.classList.remove("is-invalid");
    return true;
  } else {
    firstNameInput.classList.remove("is-valid");
    firstNameInput.classList.add("is-invalid");
    return false;
  }
}

function validateLastName() {
  let regex = /^[A-Z][a-z]{2,16}$/;
  if (regex.test(lastNameInput.value)) {
    lastNameInput.classList.add("is-valid");
    lastNameInput.classList.remove("is-invalid");
    return true;
  } else {
    lastNameInput.classList.remove("is-valid");
    lastNameInput.classList.add("is-invalid");
    return false;
  }
}

function validateEmailOrPhone() {
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (emailRegex.test(emailInput.value) || phoneRegex.test(emailInput.value)) {
    emailInput.classList.add("is-valid");
    emailInput.classList.remove("is-invalid");
    return true;
  } else {
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
    return false;
  }
}

function validatePassword() {
  let regex = /^.{4,60}$/;
  if (regex.test(passwordInput.value)) {
    passwordInput.classList.add("is-valid");
    passwordInput.classList.remove("is-invalid");
    return true;
  } else {
    passwordInput.classList.remove("is-valid");
    passwordInput.classList.add("is-invalid");
    return false;
  }
}
