// Search farmer records
async function searchRecords() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  try {
    // Use multiple filters: name, farmerId, crop, or animal
    const res = await fetch(`http://localhost:3000/api/farmers/search?name=${query}&farmerId=${query}&crop=${query}&animal=${query}`);
    const data = await res.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultsDiv.innerHTML = "<p>No records found.</p>";
      return;
    }

    // Display each farmer as a card
    data.forEach(farmer => {
      const div = document.createElement("div");
      div.className = "record-card";
      div.innerHTML = `
        <h3>${farmer.fullName || "Unnamed Farmer"}</h3>
        <p><strong>ID:</strong> ${farmer.farmerId || farmer._id}</p>
        <p><strong>Location:</strong> ${farmer.location?.province || ""}, ${farmer.location?.municipality || ""}, ${farmer.location?.barangay || ""}</p>
        <button onclick="viewProfile('${farmer._id}')">View Profile</button>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    alert("Failed to fetch records. Check your server.");
  }
}

// Redirect to read-only profile page
function viewProfile(id) {
  window.location.href = `profile.html?id=${id}`;
}
