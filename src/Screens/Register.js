document.getElementById("showPassword").addEventListener("change", function () {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  if (this.checked) {
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
  }
});

document.getElementById("registerBtn").addEventListener("click", async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const error = document.getElementById("error");

  if (!username || !password || !confirmPassword) {
    error.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Account successfully created!");
      window.location.href = "LoginPage.html";
    } else {
      error.textContent = data.message;
    }
  } catch (err) {
    error.textContent = "Server error, try again later.";
  }
});
