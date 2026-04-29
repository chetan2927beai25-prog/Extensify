const savedName = localStorage.getItem("userName");
const savedContact = localStorage.getItem("userContact");

const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

let finalName = "User";

if (savedName && savedName.trim() !== "") {
  finalName = savedName.trim();
} else if (savedContact && savedContact.trim() !== "") {
  finalName = savedContact.trim();
}

if (userName) {
  userName.textContent = finalName;
}

if (userAvatar) {
  userAvatar.textContent = finalName.charAt(0).toUpperCase();
}

const addSavingBtn = document.getElementById("addSavingBtn");
const saveAmount = document.getElementById("saveAmount");
const saveNote = document.getElementById("saveNote");
const clearBtn = document.getElementById("clearBtn");

const totalSavedEl = document.getElementById("totalSaved");
const targetAmountEl = document.getElementById("targetAmount");
const remainingAmountEl = document.getElementById("remainingAmount");

const savedText = document.getElementById("savedText");
const goalPercent = document.getElementById("goalPercent");
const progressFill = document.getElementById("progressFill");
const targetText = document.getElementById("targetText");
const historyList = document.getElementById("historyList");

let totalSaved = Number(localStorage.getItem("totalSaved")) || 8000;
let targetAmount = Number(localStorage.getItem("targetAmount")) || 10000;

function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function updateSavingUI() {
  const remaining = Math.max(targetAmount - totalSaved, 0);
  const percent = Math.min(Math.round((totalSaved / targetAmount) * 100), 100);

  totalSavedEl.textContent = formatINR(totalSaved);
  targetAmountEl.textContent = formatINR(targetAmount);
  remainingAmountEl.textContent = formatINR(remaining);

  savedText.textContent = `${formatINR(totalSaved)} saved out of ${formatINR(targetAmount)}`;
  goalPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  targetText.textContent = `${formatINR(targetAmount)} target`;

  localStorage.setItem("totalSaved", totalSaved);
  localStorage.setItem("targetAmount", targetAmount);
}

function addHistoryItem(amount, note) {
  const today = new Date();

  const dateText = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const emptyHistory = document.querySelector(".empty-history");

  if (emptyHistory) {
    emptyHistory.remove();
  }

  const item = document.createElement("div");
  item.className = "history-item";

  item.innerHTML = `
    <div>
      <h4>${note || "New saving added"}</h4>
      <p>${dateText}</p>
    </div>
    <span>+${formatINR(amount)}</span>
  `;

  historyList.prepend(item);
}

updateSavingUI();

if (addSavingBtn) {
  addSavingBtn.addEventListener("click", function () {
    const amount = Number(saveAmount.value);
    const note = saveNote.value.trim();

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    totalSaved = totalSaved + amount;

    updateSavingUI();
    addHistoryItem(amount, note);

    saveAmount.value = "";
    saveNote.value = "";
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    historyList.innerHTML = `
      <p class="empty-history">No saving history yet.</p>
    `;
  });
}