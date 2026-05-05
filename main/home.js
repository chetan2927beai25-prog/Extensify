const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");
const userBox = document.getElementById("userBox") || document.getElementById("openModal");

const balanceEl = document.getElementById("balanceEl");
const incomeEl = document.getElementById("incomeEl");
const expenseEl = document.getElementById("expenseEl");

const incomeInput = document.getElementById("incomeInput");
const setIncomeBtn = document.getElementById("setIncomeBtn");

const titleInput = document.getElementById("expenseTitle");
const amountInput = document.getElementById("expenseAmount");
const noteInput = document.getElementById("expenseNote");
const dateInput = document.getElementById("expenseDate");
const categoryInput = document.getElementById("expenseCategory");

const saveBtn = document.getElementById("saveExpenseBtn");
const recentList = document.getElementById("recentList");


let data = JSON.parse(localStorage.getItem("homeData")) || {
  income: 0,
  transactions: []
};

const categories = ["food", "travel", "shopping", "bills", "other"];



function saveData() {
  localStorage.setItem("homeData", JSON.stringify(data));
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function setUser() {
  let name = localStorage.getItem("userName") || "User";

  userName.textContent = name;
  userAvatar.textContent = name.charAt(0).toUpperCase();
}

function getIcon(category) {
  if (category === "food") return "fa-utensils";
  if (category === "travel") return "fa-bus";
  if (category === "shopping") return "fa-bag-shopping";
  if (category === "bills") return "fa-file-invoice";
  if (category === "income") return "fa-money-bill-wave";

  return "fa-wallet";
}

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  noteInput.value = "";
  dateInput.value = "";
  categoryInput.value = "";
}

function render() {
  let totalExpense = 0;
  let categoryTotal = {
    food: 0,
    travel: 0,
    shopping: 0,
    bills: 0,
    other: 0
  };

  for (let i = 0; i < data.transactions.length; i++) {
    let item = data.transactions[i];

    if (item.type === "expense") {
      totalExpense = totalExpense + item.amount;
      categoryTotal[item.category] = categoryTotal[item.category] + item.amount;
    }
  }

  incomeEl.textContent = money(data.income);
  expenseEl.textContent = money(totalExpense);
  balanceEl.textContent = money(data.income - totalExpense);

  updateMeters(totalExpense, categoryTotal);
  showTransactions();
}

function updateMeters(totalExpense, categoryTotal) {
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let percent = 0;

    if (totalExpense > 0) {
      percent = Math.round((categoryTotal[category] / totalExpense) * 100);
    }

    document.getElementById(category + "Percent").textContent = percent + "%";
    document.getElementById(category + "Fill").style.width = percent + "%";
  }
}

function showTransactions() {
  recentList.innerHTML = "";

  if (data.transactions.length === 0) {
    recentList.innerHTML = `<p class="empty-text">No transactions yet.</p>`;
    return;
  }

  for (let i = 0; i < data.transactions.length; i++) {
    let item = data.transactions[i];
    let sign = item.type === "income" ? "+" : "-";
    let amountClass = item.type === "income" ? "plus" : "minus";

    recentList.innerHTML += `
      <div class="tx-item" data-id="${item.id}">
        <div class="tx-left">
          <div class="tx-icon ${item.category}">
            <i class="fa-solid ${getIcon(item.category)}"></i>
          </div>

          <div>
            <div class="tx-name">${item.title}</div>
            <div class="tx-date">${item.date}</div>
          </div>
        </div>

        <div class="tx-right">
          <span class="amt ${amountClass}">${sign}${money(item.amount)}</span>
          <button class="del-btn">Delete</button>
        </div>
      </div>
    `;
  }
}
function setIncome() {
  let income = Number(incomeInput.value);

  if (income <= 0) {
    alert("Enter valid income");
    return;
  }

  data.income = income;

  data.transactions = data.transactions.filter(function (item) {
    return item.type !== "income";
  });

  data.transactions.unshift({
    id: Date.now(),
    title: "Monthly Income",
    amount: income,
    type: "income",
    category: "income",
    date: "This month"
  });

  incomeInput.value = "";

  saveData();
  render();
}

function addExpense() {
  let title = titleInput.value.trim();
  let amount = Number(amountInput.value);
  let date = dateInput.value;
  let category = categoryInput.value;

  if (data.income <= 0) {
    alert("First enter your income");
    return;
  }

  if (title === "" || amount <= 0 || date === "" || category === "") {
    alert("Fill all expense details properly");
    return;
  }

  data.transactions.unshift({
    id: Date.now(),
    title: title,
    amount: amount,
    note: noteInput.value.trim(),
    type: "expense",
    category: category,
    date: date
  });

  clearInputs();
  saveData();
  render();
}

function deleteTransaction(event) {
  if (!event.target.classList.contains("del-btn")) {
    return;
  }

  let row = event.target.closest(".tx-item");
  let id = Number(row.getAttribute("data-id"));

  if (confirm("Delete this transaction?")) {
    data.transactions = data.transactions.filter(function (item) {
      return item.id !== id;
    });

    let hasIncome = data.transactions.some(function (item) {
      return item.type === "income";
    });

    if (!hasIncome) {
      data.income = 0;
    }

    saveData();
    render();
  }
}

function changeName() {
  let name = prompt("Enter your name");

  if (name !== null && name.trim() !== "") {
    localStorage.setItem("userName", name.trim());
    setUser();
  }
}

setUser();
render();

setIncomeBtn.addEventListener("click", setIncome);
saveBtn.addEventListener("click", addExpense);
recentList.addEventListener("click", deleteTransaction);

if (userBox) {
  userBox.addEventListener("click", changeName);
}