const menuItems = document.querySelectorAll(".menu-item[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");
const pageTitle = document.getElementById("pageTitle");
const headIcon = document.getElementById("headIcon");

const pageData = {
  overview: {
    title: "Overview",
    icon: '<i class="fa-solid fa-chart-line"></i>'
  },
  goal: {
    title: "Goal",
    icon: '<i class="fa-solid fa-bullseye"></i>'
  },
  planner: {
    title: "Planner",
    icon: '<i class="fa-regular fa-calendar"></i>'
  },
  history: {
    title: "History",
    icon: '<i class="fa-solid fa-clock-rotate-left"></i>'
  }
};

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const tabName = item.getAttribute("data-tab");

    menuItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");

    tabPanels.forEach((panel) => panel.classList.remove("show"));

    const currentPanel = document.getElementById(tabName);
    if (currentPanel) {
      currentPanel.classList.add("show");
    }

    if (pageData[tabName]) {
      pageTitle.textContent = pageData[tabName].title;
      headIcon.innerHTML = pageData[tabName].icon;
    }
  });
});

/* user data */
const savedName = localStorage.getItem("userName");
const savedContact = localStorage.getItem("userContact");

const sideUserName = document.getElementById("sideUserName");
const sideUserEmail = document.getElementById("sideUserEmail");
const sideUserIcon = document.getElementById("sideUserIcon");
const topMiniUser = document.getElementById("topMiniUser");

let finalName = "User";
let finalEmail = "user@email.com";

if (savedName && savedName.trim() !== "") {
  finalName = savedName.trim();
}

if (savedContact && savedContact.trim() !== "") {
  finalEmail = savedContact.trim();
}

if (sideUserName) {
  sideUserName.textContent = finalName;
}

if (sideUserEmail) {
  sideUserEmail.textContent = finalEmail;
}

const firstLetter = finalName.charAt(0).toUpperCase() || "U";

if (sideUserIcon) {
  sideUserIcon.textContent = firstLetter;
}

if (topMiniUser) {
  topMiniUser.textContent = firstLetter;
}

/* saving logic */
const addSavingBtn = document.getElementById("addSavingBtn");
const saveAmount = document.getElementById("saveAmount");
const saveNote = document.getElementById("saveNote");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");

const totalSavedEl = document.getElementById("totalSaved");
const targetAmountEl = document.getElementById("targetAmount");
const remainingAmountEl = document.getElementById("remainingAmount");

const goalPercent = document.getElementById("goalPercent");
const goalPercent2 = document.getElementById("goalPercent2");
const mainProgress = document.getElementById("mainProgress");
const goalProgress = document.getElementById("goalProgress");
const savedText = document.getElementById("savedText");
const savedText2 = document.getElementById("savedText2");
const targetText = document.getElementById("targetText");
const targetText2 = document.getElementById("targetText2");

let totalSaved = 8000;
let targetAmount = 10000;

function formatINR(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function updateSavingUI() {
  const remaining = Math.max(targetAmount - totalSaved, 0);
  const percent = Math.min(Math.round((totalSaved / targetAmount) * 100), 100);

  totalSavedEl.textContent = formatINR(totalSaved);
  targetAmountEl.textContent = formatINR(targetAmount);
  remainingAmountEl.textContent = formatINR(remaining);

  goalPercent.textContent = percent + "%";
  goalPercent2.textContent = percent + "%";

  mainProgress.style.width = percent + "%";
  goalProgress.style.width = percent + "%";

  savedText.textContent = formatINR(totalSaved) + " saved";
  savedText2.textContent = formatINR(totalSaved) + " saved";
  targetText.textContent = formatINR(targetAmount) + " target";
  targetText2.textContent = formatINR(targetAmount) + " target";
}

updateSavingUI();

if (addSavingBtn) {
  addSavingBtn.addEventListener("click", () => {
    const amount = Number(saveAmount.value.trim());
    const note = saveNote.value.trim();

    if (!amount || amount <= 0) {
      alert("Please enter a valid saving amount.");
      return;
    }

    totalSaved += amount;
    updateSavingUI();

    const item = document.createElement("div");
    item.className = "item";

    const today = new Date();
    const dateText = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    item.innerHTML = `
      <div>
        <p class="item-title">${note === "" ? "New Saving Added" : note}</p>
        <p class="item-date">${dateText}</p>
      </div>
      <span class="plus">+ ${formatINR(amount)}</span>
    `;

    historyList.prepend(item);

    saveAmount.value = "";
    saveNote.value = "";

    tabPanels.forEach((panel) => panel.classList.remove("show"));
    document.getElementById("history").classList.add("show");

    menuItems.forEach((btn) => btn.classList.remove("active"));
    document.querySelector('.menu-item[data-tab="history"]').classList.add("active");

    pageTitle.textContent = "History";
    headIcon.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
  });
}