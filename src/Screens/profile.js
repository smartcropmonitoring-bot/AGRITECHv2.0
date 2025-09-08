// Get farmer ID from query string ?id=xxxx
const urlParams = new URLSearchParams(window.location.search);
const farmerId = urlParams.get("id");

async function loadProfile() {
  if (!farmerId) {
    document.getElementById("profile-container").innerHTML = "<p>No farmer selected.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/farmers/${farmerId}`);
    const farmer = await res.json();

    if (!farmer._id) {
      document.getElementById("profile-container").innerHTML = "<p>Farmer not found.</p>";
      return;
    }

    document.getElementById("profile-container").innerHTML = `
      <div class="section">
        <h2>Farmer Information</h2>
        <p><b>Farmer ID:</b> ${farmer.farmerId || ""}</p>
        <p><b>Name:</b> ${farmer.fullName || ""}</p>
        <p><b>Contact:</b> ${farmer.contactInfo || ""}</p>
        <p><b>Location:</b> 
          ${farmer.location?.province || ""}, 
          ${farmer.location?.municipality || ""}, 
          ${farmer.location?.barangay || ""}
        </p>
      </div>

      <div class="section">
        <h2>Farming Data</h2>
        <p><b>Land Area:</b> ${farmer.farming?.landArea || ""} hectares</p>
        <p><b>Ownership:</b> ${farmer.farming?.ownership || ""}</p>
        <p><b>Land Type:</b> ${farmer.farming?.landType || ""}</p>
        <p><b>Main Crop:</b> ${farmer.farming?.crops?.mainCrop || ""}</p>
        <p><b>Secondary Crops:</b> ${farmer.farming?.crops?.secondaryCrops || ""}</p>
        <p><b>Planting Season:</b> ${farmer.farming?.crops?.season || ""}</p>
        <p><b>Average Yield:</b> ${farmer.farming?.yield || ""} per hectare</p>
        <p><b>Harvest Frequency:</b> ${farmer.farming?.harvestFrequency || ""}</p>
        <p><b>Usage:</b> ${farmer.farming?.usage || ""}</p>
        <p><b>Farming Method:</b> ${farmer.farming?.method || ""}</p>
        <p><b>Irrigation Source:</b> ${farmer.farming?.irrigation || ""}</p>
        <p><b>Fertilizer Use:</b> ${farmer.farming?.fertilizerUse || ""}</p>
        <p><b>Pesticide Use:</b> ${farmer.farming?.pesticideUse || ""}</p>
        <p><b>Expenses:</b>
          Seeds ₱${farmer.farming?.expenses?.seeds || 0}, 
          Fertilizer ₱${farmer.farming?.expenses?.fertilizers || 0}, 
          Pesticides ₱${farmer.farming?.expenses?.pesticides || 0}, 
          Labor ₱${farmer.farming?.expenses?.labor || 0}, 
          Water ₱${farmer.farming?.expenses?.water || 0}, 
          Fuel ₱${farmer.farming?.expenses?.fuel || 0}, 
          Others ₱${farmer.farming?.expenses?.others || 0}
        </p>
        <p><b>Challenges:</b> ${farmer.farming?.challenges?.join(", ") || "None"}</p>
      </div>

      <div class="section">
        <h2>Animal Husbandry</h2>
        ${farmer.animalHusbandry && Object.keys(farmer.animalHusbandry).length > 0 
          ? Object.entries(farmer.animalHusbandry).map(([type, data]) => `
            <div class="animal">
              <p><b>Type:</b> ${type}</p>
              <p><b>Count:</b> ${data.count || 0}</p>
              <p><b>Breed:</b> ${data.breed || ""}</p>
              <p><b>Purpose:</b> ${data.purpose || ""}</p>
              <p><b>Production:</b> ${data.production || ""}</p>
              <p><b>Expenses:</b> 
                Feed ₱${data.expenses?.feed || 0}, 
                Vet ₱${data.expenses?.vet || 0}, 
                Labor ₱${data.expenses?.labor || 0}, 
                Others ₱${data.expenses?.others || 0}
              </p>
              <p><b>Challenges:</b> ${data.challenges?.join(", ") || "None"}</p>
            </div>
            <hr>
          `).join("") 
          : "<p>No animal data.</p>"
        }
      </div>

      <div class="section">
        <h2>Last Update</h2>
        <p>${new Date(farmer.updatedAt).toLocaleString()}</p>
      </div>
    `;
  } catch (err) {
    console.error("Error loading profile:", err);
    document.getElementById("profile-container").innerHTML = "<p>Error loading profile.</p>";
  }
}

/* 🔹 Action buttons (staff view only) */
function exportPDF() {
  window.print(); // Quick PDF export via browser
}

function exportExcel() {
  alert("Export to Excel coming soon!");
}

loadProfile();
