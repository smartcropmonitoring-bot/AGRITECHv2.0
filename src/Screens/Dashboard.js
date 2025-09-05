// Simulated role (later fetched from server after login)
let userRole = localStorage.getItem("role") || "user"; // "user" or "admin"

const menu = document.getElementById("menu");

// Define role-based menu items
const menuItems = {
  user: [
    { name: "Information", link: "information.html" },
    { name: "Farming", link: "farming.html" },
    { name: "Animal Husbandry", link: "animal.html" }
  ],
  admin: [
    { name: "Information", link: "information.html" },
    { name: "Farming", link: "farming.html" },
    { name: "Animal Husbandry", link: "animal.html" },
    { name: "Records", link: "records.html" }
  ]
};

// Populate menu based on role
menuItems[userRole].forEach(item => {
  const btn = document.createElement("button");
  btn.textContent = item.name;
  btn.onclick = () => window.location.href = item.link;
  menu.appendChild(btn);
});

// Toggle sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("role");
  window.location.href = "loginPage.html";
});
