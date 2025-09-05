// Toggle show/hide password
document.getElementById("showPassword").addEventListener("change", function () {
  const password = document.getElementById("password");
  if (this.checked) {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

// Login button → check credentials via API
document.getElementById("loginBtn").addEventListener("click", async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = "dashboard.html";
    } else {
      error.textContent = data.message;
    }
  } catch (err) {
    error.textContent = "Server error, try again later.";
  }
});

// Register button → go to register page
document.getElementById("registerBtn").addEventListener("click", function () {
  window.location.href = "register.html";
});
