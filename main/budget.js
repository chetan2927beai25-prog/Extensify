const userName = document.getElementById("userName");
const userIcon = document.getElementById("userIcon");

const totalBudgetEl = document.getElementById("totalBudget");
const totalSpentEl = document.getElementById("totalSpent");
const remainingBudgetEl = document.getElementById("remainingBudget");

const categoryInput = document.getElementById("categoryInput");
const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const budgetOverview = document.getElementById("budgetOverview");
const budgetTable = document.getElementById("budgetTable");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let homeData = JSON.parse(localStorage.getItem("homeData")) || {
  income: 0,
  transactions: []
};

let budgetData = JSON.parse(localStorage.getItem("budgetData")) || {
  budgets: [],
  history: []
};

function saveData() {
  localStorage.setItem("budgetData", JSON.stringify(budgetData));
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function setUser() {
  let name = localStorage.getItem("userName") || "User";

  userName.textContent = name;
  userIcon.textContent = name.charAt(0).toUpperCase();
}

function getSpent(category) {
  let spent = 0;

  for (let i = 0; i < homeData.transactions.length; i++) {
    let item = homeData.transactions[i];

    if (item.type === "expense" && item.category === category) {
      spent = spent + item.amount;
    }
  }

  return spent;
}

function getStatus(spent, budget) {
  if (spent > budget) {
    return "crossed";
  } else if (spent >= budget * 0.75) {
    return "warning";
  } else {
    return "safe";
  }
}

function showStatus(status) {
  if (status === "crossed") {
    return "Over Budget";
  } else if (status === "warning") {
    return "Almost Full";
  } else {
    return "Safe";
  }
}

function titleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function render() {
  let totalBudget = 0;
  let totalSpent = 0;

  budgetOverview.innerHTML = "";
  budgetTable.innerHTML = "";
  historyList.innerHTML = "";

  if (budgetData.budgets.length === 0) {
    budgetOverview.innerHTML = `<p class="empty-text">No budget set yet.</p>`;
    budgetTable.innerHTML = `<tr><td colspan="5" class="table-empty">No budget details available.</td></tr>`;
  }

  for (let i = 0; i < budgetData.budgets.length; i++) {
    let item = budgetData.budgets[i];
    let spent = getSpent(item.category);
    let remaining = item.amount - spent;
    let percent = Math.round((spent / item.amount) * 100);

    if (percent > 100) {
      percent = 100;
    }

    let status = getStatus(spent, item.amount);

    totalBudget = totalBudget + item.amount;
    totalSpent = totalSpent + spent;

    budgetOverview.innerHTML += `
      <div class="overview-card">
        <div class="overview-top">
          <div>
            <p class="overview-name">${titleCase(item.category)}</p>
            <p class="overview-text">${money(spent)} spent of ${money(item.amount)}</p>
          </div>
          <span>${percent}%</span>
        </div>

        <div class="progress-line">
          <div class="progress-fill ${status}" style="width:${percent}%"></div>
        </div>

        <p class="overview-text">Remaining: ${money(Math.max(remaining, 0))}</p>
      </div>
    `;

    budgetTable.innerHTML += `
      <tr>
        <td>${titleCase(item.category)}</td>
        <td>${money(item.amount)}</td>
        <td>${money(spent)}</td>
        <td>${money(Math.max(remaining, 0))}</td>
        <td><span class="budget-status ${status}">${showStatus(status)}</span></td>
      </tr>
    `;
  }

  if (budgetData.history.length === 0) {
    historyList.innerHTML = `<p class="empty-text">No budget updates yet.</p>`;
  }

  for (let i = 0; i < budgetData.history.length; i++) {
    let item = budgetData.history[i];

    historyList.innerHTML += `
      <div class="history-item">
        <div>
          <p class="history-title">${titleCase(item.category)} budget updated</p>
          <p class="history-date">${item.date}</p>
        </div>
        <span class="history-amt">${money(item.amount)}</span>
      </div>
    `;
  }

  totalBudgetEl.textContent = money(totalBudget);
  totalSpentEl.textContent = money(totalSpent);
  remainingBudgetEl.textContent = money(Math.max(totalBudget - totalSpent, 0));
}

function setBudget() {
  let category = categoryInput.value;
  let amount = Number(budgetInput.value);

  if (category === "" || amount <= 0) {
    alert("Choose category and enter valid amount");
    return;
  }

  let oldBudget = budgetData.budgets.find(function (item) {
    return item.category === category;
  });

  if (oldBudget) {
    oldBudget.amount = amount;
  } else {
    budgetData.budgets.push({
      category: category,
      amount: amount
    });
  }

  let today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  budgetData.history.unshift({
    category: category,
    amount: amount,
    date: today
  });

  categoryInput.value = "";
  budgetInput.value = "";

  saveData();
  render();
}

function clearHistory() {
  if (confirm("Clear budget history?")) {
    budgetData.history = [];
    saveData();
    render();
  }
}

setUser();
render();

setBudgetBtn.addEventListener("click", setBudget);
clearHistoryBtn.addEventListener("click", clearHistory);