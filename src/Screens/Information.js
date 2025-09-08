document.getElementById("infoForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("https://agritechv2-0.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Information saved successfully!");
      this.reset(); // Clear form
    } else {
      alert("❌ Failed to save information: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Server error. Please try again.");
  }
});
