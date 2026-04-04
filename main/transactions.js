const savedName = localStorage.getItem("userName");
const savedContact = localStorage.getItem("userContact");

const userName = document.getElementById("userName");
const userIcon = document.getElementById("userIcon");

if (userName) {
  if (savedName && savedName.trim() !== "") {
    userName.textContent = savedName;
  } else if (savedContact && savedContact.trim() !== "") {
    userName.textContent = savedContact;
  } else {
    userName.textContent = "User";
  }
}

if (userIcon && userName) {
  const firstLetter = userName.textContent.trim().charAt(0).toUpperCase();
  userIcon.textContent = firstLetter || "U";
}

const filterButtons = document.querySelectorAll(".filter-btn");
const rows = document.querySelectorAll("#transactionTable tr");
const searchInput = document.getElementById("searchInput");

let currentFilter = "all";

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.getAttribute("data-filter");
    showRows();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", showRows);
}

function showRows() {
  const searchValue = searchInput.value.toLowerCase().trim();

  rows.forEach((row) => {
    const type = row.getAttribute("data-type");
    const text = row.textContent.toLowerCase();

    const matchesFilter = currentFilter === "all" || currentFilter === type;
    const matchesSearch = text.includes(searchValue);

    if (matchesFilter && matchesSearch) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}