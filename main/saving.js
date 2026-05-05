const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

const totalSavedEl = document.getElementById("totalSaved");
const targetAmountEl = document.getElementById("targetAmount");
const remainingAmountEl = document.getElementById("remainingAmount");
const savedText = document.getElementById("savedText");
const goalPercent = document.getElementById("goalPercent");
const progressFill = document.getElementById("progressFill");
const targetText = document.getElementById("targetText");

const goalNameText = document.getElementById("goalNameText");
const goalCardTitle = document.getElementById("goalCardTitle");
const goalNameInput = document.getElementById("goalNameInput");
const goalAmountInput = document.getElementById("goalAmountInput");
const setGoalBtn = document.getElementById("setGoalBtn");

const saveAmount = document.getElementById("saveAmount");
const saveNote = document.getElementById("saveNote");
const addSavingBtn = document.getElementById("addSavingBtn");
const autoSaveBtn = document.getElementById("autoSaveBtn");
const clearBtn = document.getElementById("clearBtn");
const historyList = document.getElementById("historyList");

const homeIncomeText = document.getElementById("homeIncomeText");
const homeExpenseText = document.getElementById("homeExpenseText");
const homeBalanceText = document.getElementById("homeBalanceText");

let data = JSON.parse(localStorage.getItem("savingData")) || {
  goalName: "",
  goalAmount: 0,
  history: []
};

function saveData() {
  localStorage.setItem("savingData", JSON.stringify(data));
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function setUser() {
  let name = localStorage.getItem("userName") || "User";

  userName.textContent = name;
  userAvatar.textContent = name.charAt(0).toUpperCase();
}

function getHomeMoney() {
  let homeData = JSON.parse(localStorage.getItem("homeData")) || {
    income: 0,
    transactions: []
  };

  let income = Number(homeData.income) || 0;
  let expense = 0;

  for (let i = 0; i < homeData.transactions.length; i++) {
    let item = homeData.transactions[i];

    if (item.type === "expense") {
      expense = expense + Number(item.amount);
    }
  }

  return {
    income: income,
    expense: expense,
    balance: income - expense
  };
}

function todayDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function monthKey() {
  let date = new Date();
  return date.getFullYear() + "-" + date.getMonth();
}

function totalSaved() {
  let total = 0;

  for (let i = 0; i < data.history.length; i++) {
    total = total + Number(data.history[i].amount);
  }

  return total;
}

function addAutoSaving() {
  let home = getHomeMoney();

  if (data.goalAmount <= 0) {
    alert("First set your saving goal");
    return;
  }

  if (home.balance <= 0) {
    alert("No balance left for saving");
    return;
  }

  for (let i = 0; i < data.history.length; i++) {
    if (data.history[i].type === "auto" && data.history[i].month === monthKey()) {
      alert("This month saving already added");
      return;
    }
  }

  data.history.unshift({
    note: "Auto saving from monthly balance",
    amount: home.balance,
    date: todayDate(),
    type: "auto",
    month: monthKey()
  });

  saveData();
  render();
}

function render() {
  let home = getHomeMoney();
  let saved = totalSaved();
  let remaining = data.goalAmount - saved;
  let percent = 0;

  if (data.goalAmount > 0) {
    percent = Math.round((saved / data.goalAmount) * 100);
  }

  if (percent > 100) {
    percent = 100;
  }

  homeIncomeText.textContent = money(home.income);
  homeExpenseText.textContent = money(home.expense);
  homeBalanceText.textContent = money(Math.max(home.balance, 0));

  goalNameText.textContent = data.goalName || "Set your goal 🎯";
  goalCardTitle.textContent = data.goalName ? data.goalName + " Progress" : "Goal Progress";

  totalSavedEl.textContent = money(saved);
  targetAmountEl.textContent = money(data.goalAmount);
  remainingAmountEl.textContent = money(Math.max(remaining, 0));

  if (data.goalAmount <= 0) {
    savedText.textContent = "Set your goal first";
  } else {
    savedText.textContent = money(saved) + " saved out of " + money(data.goalAmount);
  }

  goalPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  targetText.textContent = money(data.goalAmount) + " target";

  historyList.innerHTML = "";

  if (data.history.length === 0) {
    historyList.innerHTML = `<p class="empty-history">No saving history yet.</p>`;
    return;
  }

  for (let i = 0; i < data.history.length; i++) {
    let item = data.history[i];

    historyList.innerHTML += `
      <div class="history-item">
        <div>
          <h4>${item.note}</h4>
          <p>${item.date}</p>
        </div>
        <span class="history-money">+${money(item.amount)}</span>
      </div>
    `;
  }
}

function setGoal() {
  let name = goalNameInput.value.trim();
  let amount = Number(goalAmountInput.value);

  if (name === "" || amount <= 0) {
    alert("Enter goal name and valid amount");
    return;
  }

  data.goalName = name;
  data.goalAmount = amount;

  goalNameInput.value = "";
  goalAmountInput.value = "";

  saveData();
  render();
}

function addSaving() {
  let amount = Number(saveAmount.value);
  let note = saveNote.value.trim();

  if (data.goalAmount <= 0) {
    alert("First set your saving goal");
    return;
  }

  if (amount <= 0) {
    alert("Enter valid saving amount");
    return;
  }

  if (note === "") {
    note = "Manual saving";
  }

  data.history.unshift({
    note: note,
    amount: amount,
    date: todayDate(),
    type: "manual"
  });

  saveAmount.value = "";
  saveNote.value = "";

  saveData();
  render();
}

function clearSavings() {
  if (confirm("Clear savings history?")) {
    data.history = [];
    saveData();
    render();
  }
}

setUser();
render();

setGoalBtn.addEventListener("click", setGoal);
addSavingBtn.addEventListener("click", addSaving);
autoSaveBtn.addEventListener("click", addAutoSaving);
clearBtn.addEventListener("click", clearSavings);