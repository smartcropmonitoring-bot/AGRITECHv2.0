// Simulated role (later fetched from server after login)
let userRole = localStorage.getItem("role") || "user"; // "user" or "admin"

const menu = document.getElementById("menu");

// Define role-based menu items
const menuItems = {
  user: [
    { name: "Information", link: "Information.html" },
    { name: "Farming", link: "Farming.html" },
    { name: "Animal Husbandry", link: "AnimalHusbandry.html" }
  ],
  admin: [
    { name: "Information", link: "Information.html" },
    { name: "Farming", link: "Farming.html" },
    { name: "Animal Husbandry", link: "AnimalHusbandry.html" },
    { name: "Records", link: "Record.html" }
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
  window.location.href = "LoginPage.html";
});
