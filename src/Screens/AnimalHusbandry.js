const animalTypeSelect = document.getElementById("animalType");
const animalFieldsDiv = document.getElementById("animalFields");

animalTypeSelect.addEventListener("change", () => {
  const type = animalTypeSelect.value;
  animalFieldsDiv.innerHTML = ""; // reset

  if (!type) return;

  fetch(`forms/${type.toLowerCase()}.html`)
    .then(res => res.text())
    .then(html => {
      animalFieldsDiv.innerHTML = html;
    });
});

document.getElementById("animalForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  const res = await fetch("https://agritechv2-0.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
});
