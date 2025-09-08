document.getElementById("farmerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const data = {
    fullName: formData.get("fullName"),
    contact: formData.get("contact"),
    location: {
      province: formData.get("province"),
      municipality: formData.get("municipality"),
      barangay: formData.get("barangay"),
    },
    farming: {
      totalLandArea: Number(formData.get("totalLandArea") || 0),
      ownershipStatus: formData.get("ownershipStatus"),
      crops: {
        mainCrop: formData.get("mainCrop"),
      },
    },
  };

  try {
    const res = await fetch("https://agritechv2-0.onrender.com/api/farmers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Farmer record saved successfully!");
      this.reset();
    } else {
      alert("❌ Failed to save farmer: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("⚠️ Server error. Please try again.");
  }
});
