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

const defaultBudgetData = [
  { category: "Food", budget: 5000, spent: 3200 },
  { category: "Travel", budget: 2000, spent: 1200 },
  { category: "Shopping", budget: 3000, spent: 2600 },
  { category: "Bills", budget: 1500, spent: 1000 },
  { category: "Study", budget: 2500, spent: 800 },
  { category: "Other", budget: 1000, spent: 300 }
];

let budgetData = JSON.parse(localStorage.getItem("budgetData")) || defaultBudgetData;

const totalBudget = document.getElementById("totalBudget");
const totalSpent = document.getElementById("totalSpent");
const remainingBudget = document.getElementById("remainingBudget");
const budgetOverview = document.getElementById("budgetOverview");
const budgetTable = document.getElementById("budgetTable");

const categoryInput = document.getElementById("categoryInput");
const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function getStatus(spent, budget) {
  if (budget <= 0) {
    return {
      text: "No Budget",
      className: "warning"
    };
  }

  const percent = (spent / budget) * 100;

  if (percent < 80) {
    return {
      text: "Safe",
      className: "safe"
    };
  } else if (percent <= 100) {
    return {
      text: "Warning",
      className: "warning"
    };
  } else {
    return {
      text: "Limit Crossed",
      className: "crossed"
    };
  }
}

function formatMoney(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function renderSummary() {
  const totalBudgetValue = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpentValue = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const remainingValue = totalBudgetValue - totalSpentValue;

  totalBudget.textContent = formatMoney(totalBudgetValue);
  totalSpent.textContent = formatMoney(totalSpentValue);
  remainingBudget.textContent = formatMoney(remainingValue);
}

function renderOverview() {
  budgetOverview.innerHTML = "";

  budgetData.forEach((item) => {
    const status = getStatus(item.spent, item.budget);
    const percent = item.budget > 0 ? Math.min((item.spent / item.budget) * 100, 100) : 0;

    const box = document.createElement("div");
    box.className = "overview-item";

    box.innerHTML = `
      <div class="overview-top">
        <div>
          <p class="overview-name">${item.category}</p>
          <p class="overview-text">${formatMoney(item.spent)} / ${formatMoney(item.budget)}</p>
        </div>
        <span>${status.text}</span>
      </div>
      <div class="line">
        <div class="fill ${status.className}" style="width: ${percent}%"></div>
      </div>
    `;

    budgetOverview.appendChild(box);
  });
}

function renderTable() {
  budgetTable.innerHTML = "";

  budgetData.forEach((item) => {
    const remaining = item.budget - item.spent;
    const status = getStatus(item.spent, item.budget);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.category}</td>
      <td>${formatMoney(item.budget)}</td>
      <td>${formatMoney(item.spent)}</td>
      <td>${formatMoney(remaining)}</td>
      <td><span class="status ${status.className}-status">${status.text}</span></td>
    `;

    budgetTable.appendChild(row);
  });
}

function saveBudgetData() {
  localStorage.setItem("budgetData", JSON.stringify(budgetData));
}

function addHistory(category, amount) {
  const today = new Date();
  const dateText = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const item = document.createElement("div");
  item.className = "item";

  item.innerHTML = `
    <div>
      <p class="item-title">${category} budget updated</p>
      <p class="item-date">${dateText}</p>
    </div>
    <span class="plus">${formatMoney(Number(amount))}</span>
  `;

  historyList.prepend(item);
}

function renderAll() {
  renderSummary();
  renderOverview();
  renderTable();
}

renderAll();

if (setBudgetBtn) {
  setBudgetBtn.addEventListener("click", () => {
    const category = categoryInput.value;
    const amount = Number(budgetInput.value);

    if (category === "") {
      alert("Please choose a category.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    const found = budgetData.find((item) => item.category === category);

    if (found) {
      found.budget = amount;
    } else {
      budgetData.push({
        category: category,
        budget: amount,
        spent: 0
      });
    }

    saveBudgetData();
    addHistory(category, amount);
    renderAll();

    categoryInput.value = "";
    budgetInput.value = "";
  });
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
  });
}