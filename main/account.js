const menuItems = document.querySelectorAll(".menu-item[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");
const pageTitle = document.getElementById("pageTitle");
const headIcon = document.getElementById("headIcon");

const userTopName = document.querySelector(".user-text h3");
const userTopEmail = document.querySelector(".user-text p");
const profileName = document.querySelectorAll(".info-row h4")[0];
const profileEmail = document.querySelectorAll(".info-row h4")[1];

const switches = document.querySelectorAll(".switch");
const editBtn = document.querySelector(".edit-btn");
const shareBtn = document.querySelector(".share-btn");
const reloadBtn = document.getElementById("reloadBtn");
const clearAccountBtn = document.getElementById("clearAccountBtn");

const pageData = {
  profile: ["Profile", '<i class="fa-solid fa-user"></i>'],
  wallet: ["Wallet", '<i class="fa-regular fa-folder"></i>'],
  expenseRules: ["Expense rules", '<i class="fa-solid fa-bolt"></i>'],
  preferences: ["Preferences", '<i class="fa-solid fa-gear"></i>'],
  security: ["Security", '<i class="fa-solid fa-lock"></i>'],
  help: ["Help", '<i class="fa-regular fa-circle-question"></i>'],
  about: ["About", '<i class="fa-solid fa-circle-info"></i>'],
  troubleshoot: ["Troubleshoot", '<i class="fa-regular fa-lightbulb"></i>']
};

function setUser() {
  let name = localStorage.getItem("userName") || "User";
  let email = localStorage.getItem("userContact") || "No email added";

  userTopName.textContent = name;
  userTopEmail.textContent = email;

  profileName.textContent = name;
  profileEmail.textContent = email;
}

function openTab(tabName) {
  for (let i = 0; i < tabPanels.length; i++) {
    tabPanels[i].classList.remove("show");
  }

  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].classList.remove("active");
  }

  let panel = document.getElementById(tabName);

  if (panel) {
    panel.classList.add("show");
  }

  if (pageData[tabName]) {
    pageTitle.textContent = pageData[tabName][0];
    headIcon.innerHTML = pageData[tabName][1];
  }
}

for (let i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener("click", function () {
    let tabName = menuItems[i].getAttribute("data-tab");

    openTab(tabName);
    menuItems[i].classList.add("active");
  });
}

for (let i = 0; i < switches.length; i++) {
  switches[i].addEventListener("click", function () {
    switches[i].classList.toggle("on");
  });
}

if (editBtn) {
  editBtn.addEventListener("click", function () {
    let name = prompt("Enter display name");

    if (name !== null && name.trim() !== "") {
      localStorage.setItem("userName", name.trim());
      setUser();
    }
  });
}

if (shareBtn) {
  shareBtn.addEventListener("click", function () {
    alert("Profile shared successfully");
  });
}

if (reloadBtn) {
  reloadBtn.addEventListener("click", function () {
    location.reload();
  });
}

if (clearAccountBtn) {
  clearAccountBtn.addEventListener("click", function () {
    if (confirm("Clear account data?")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userContact");
      setUser();
    }
  });
}

setUser();