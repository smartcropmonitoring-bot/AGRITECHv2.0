// login.js

const API_BASE_URL = "https://agritechv2-0.onrender.com"; 

// Toggle show/hide password
document.getElementById("showPassword").addEventListener("change", function () {
  const password = document.getElementById("password");
  password.type = this.checked ? "text" : "password";
});

// Login button → check credentials via API
document.getElementById("loginBtn").addEventListener("click", async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!username || !password) {
    error.textContent = "Please enter both username and password.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    if (data.success) {
      // Save token/session if backend provides it
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      window.location.href = "Dashboard.html";
    } else {
      error.textContent = data.message || "Invalid username or password.";
    }
  } catch (err) {
    console.error("Login error:", err);
    error.textContent = "Server error, try again later.";
  }
});

// Register button → go to register page
document.getElementById("registerBtn").addEventListener("click", function () {
  window.location.href = "Register.html";
});
