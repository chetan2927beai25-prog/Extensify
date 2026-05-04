const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

const totalSavedEl = document.getElementById("totalSaved");
const targetAmountEl = document.getElementById("targetAmount");
const remainingAmountEl = document.getElementById("remainingAmount");
const savedText = document.getElementById("savedText");
const goalPercent = document.getElementById("goalPercent");
const progressFill = document.getElementById("progressFill");
const targetText = document.getElementById("targetText");

const saveAmount = document.getElementById("saveAmount");
const saveNote = document.getElementById("saveNote");
const addSavingBtn = document.getElementById("addSavingBtn");
const clearBtn = document.getElementById("clearBtn");
const historyList = document.getElementById("historyList");

const key = "savingPageData";

let data = JSON.parse(localStorage.getItem(key)) || {
  totalSaved: 8000,
  targetAmount: 10000,
  history: [
    { note: "Monthly savings deposit", amount: 2000, date: "01 Apr 2026" },
    { note: "Skipped eating out", amount: 500, date: "28 Apr 2026" },
    { note: "Freelance bonus", amount: 2500, date: "15 Mar 2026" }
  ]
};

function setUser() {
  let name = localStorage.getItem("userName") || "User";

  userName.textContent = name;
  userAvatar.textContent = name.charAt(0).toUpperCase();
}

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function saveData() {
  localStorage.setItem(key, JSON.stringify(data));
}

function render() {
  const total = data.totalSaved;
  const target = data.targetAmount;
  const remaining = target - total;
  const percent = Math.min(Math.round((total / target) * 100), 100);

  totalSavedEl.textContent = money(total);
  targetAmountEl.textContent = money(target);
  remainingAmountEl.textContent = money(Math.max(remaining, 0));

  savedText.textContent = money(total) + " saved out of " + money(target);
  goalPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  targetText.textContent = money(target) + " target";

  historyList.innerHTML = "";

  if (data.history.length === 0) {
    historyList.innerHTML = `<p class="empty-history">No saving history yet.</p>`;
    return;
  }

  data.history.forEach(function (item) {
    historyList.innerHTML += `
      <div class="history-item">
        <div>
          <h4>${item.note}</h4>
          <p>${item.date}</p>
        </div>
        <span>+${money(item.amount)}</span>
      </div>
    `;
  });
}

function addSaving() {
  let amount = Number(saveAmount.value);
  let note = saveNote.value;

  if (amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  if (note === "") {
    note = "New saving added";
  }

  let today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  data.totalSaved = data.totalSaved + amount;

  data.history.unshift({
    note: note,
    amount: amount,
    date: today
  });

  saveAmount.value = "";
  saveNote.value = "";

  saveData();
  render();
}

function clearHistory() {
  let answer = confirm("Clear saving history?");

  if (answer) {
    data.totalSaved = 0;
    data.history = [];
    saveData();
    render();
  }
}

setUser();
render();

addSavingBtn.addEventListener("click", addSaving);
clearBtn.addEventListener("click", clearHistory);