document.addEventListener("DOMContentLoaded", function () {

  /* ================= عناصر الفورم ================= */
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signInBtn = document.getElementById("sign-in");
  const registerBtn = document.getElementById("register");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  /* ================= حماية من null ================= */
  if (!emailInput || !passwordInput || !signInBtn) {
    console.error("Missing required form elements in HTML");
    return;
  }

  /* ================= الانتقال لصفحة التسجيل ================= */
  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      window.location.href = "./register.html";
    });
  }

  /* ================= Regex ================= */
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  const passwordRegex = /^.{4,60}$/;

  /* ================= VALIDATION ================= */
  function validateEmailOrPhone() {
    const value = emailInput.value.trim();

    const isValid =
      emailRegex.test(value) || phoneRegex.test(value);

    emailInput.classList.toggle("is-valid", isValid);
    emailInput.classList.toggle("is-invalid", !isValid);

    if (emailError) {
      emailError.style.display = isValid ? "none" : "block";
      emailError.innerText = "Please enter a valid email or mobile number";
    }

    return isValid;
  }

  function validatePassword() {
    const value = passwordInput.value.trim();
    const isValid = passwordRegex.test(value);

    passwordInput.classList.toggle("is-valid", isValid);
    passwordInput.classList.toggle("is-invalid", !isValid);

    if (passwordError) {
      passwordError.style.display = isValid ? "none" : "block";
      passwordError.innerText =
        "Password must be between 4 and 60 characters";
    }

    return isValid;
  }

  /* ================= Real-time validation ================= */
  emailInput.addEventListener("input", validateEmailOrPhone);
  passwordInput.addEventListener("input", validatePassword);

  /* ================= LOGIN ================= */
  signInBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const emailValid = validateEmailOrPhone();
    const passwordValid = validatePassword();

    if (!emailValid || !passwordValid) return;

    // جلب المستخدمين
    const users = JSON.parse(localStorage.getItem("productData")) || [];

    // البحث عن المستخدم
    const user = users.find((u) => {
      return (
        (u.email &&
          u.email.trim().toLowerCase() === emailInput.value.trim().toLowerCase()) ||
        (u.phone &&
          u.phone.trim() === emailInput.value.trim())
      );
    });

    if (!user) {
      emailInput.classList.add("is-invalid");

      if (emailError) {
        emailError.innerText = "Email or mobile not found";
        emailError.style.display = "block";
      }
      return;
    }

    // التحقق من الباسورد
    if (user.password.trim() !== passwordInput.value.trim()) {
      passwordInput.classList.add("is-invalid");

      if (passwordError) {
        passwordError.innerText = "Password is incorrect";
        passwordError.style.display = "block";
      }
      return;
    }

    // تسجيل الدخول
    localStorage.setItem("currentUser", JSON.stringify(user));

    // مهم لـ GitHub Pages
    window.location.href = "./index.html";
  });

});