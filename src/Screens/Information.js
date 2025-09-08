const API_BASE_URL = "https://agritechv2-0.onrender.com";

// Handle form submission
document.getElementById("infoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  let data = Object.fromEntries(formData.entries());

  // ✅ Attach logged-in user info
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (username) data.createdBy = username;
  if (role) data.createdByRole = role;

  try {
    const res = await fetch(`${API_BASE_URL}/api/farmers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Information saved successfully!");
      this.reset();
    } else {
      alert("❌ Failed to save information: " + result.message);
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("⚠️ Server error. Please try again.");
  }
});
