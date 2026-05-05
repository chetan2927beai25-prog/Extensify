// ========== ELEMENTS ==========
const userName = document.getElementById("userName");
const userIcon = document.getElementById("userIcon");

const statExpense = document.getElementById("statExpense");
const statIncome = document.getElementById("statIncome");
const statCount = document.getElementById("statCount");
const statNet = document.getElementById("statNet");

const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".fbtn");
const txTable = document.getElementById("txTable");
const addBtn = document.getElementById("openAddModal");

let currentFilter = "all";

let data = JSON.parse(localStorage.getItem("homeData")) || {
  income: 0,
  transactions: []
};


// ========== BASIC FUNCTIONS ==========
function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function saveData() {
  localStorage.setItem("homeData", JSON.stringify(data));
}

function setUser() {
  let name = localStorage.getItem("userName") || "User";

  userName.textContent = name;
  userIcon.textContent = name.charAt(0).toUpperCase();
}

function getIcon(category) {
  if (category === "food") return "fa-utensils";
  if (category === "travel") return "fa-bus";
  if (category === "shopping") return "fa-bag-shopping";
  if (category === "bills") return "fa-file-invoice";
  if (category === "income") return "fa-money-bill-wave";

  return "fa-wallet";
}


// ========== SUMMARY ==========
function updateSummary() {
  let income = 0;
  let expense = 0;

  for (let i = 0; i < data.transactions.length; i++) {
    let item = data.transactions[i];

    if (item.type === "income") {
      income = income + item.amount;
    } else {
      expense = expense + item.amount;
    }
  }

  if (income === 0) {
    income = data.income;
  }

  statIncome.textContent = money(income);
  statExpense.textContent = money(expense);
  statNet.textContent = money(income - expense);
  statCount.textContent = data.transactions.length;
}


// ========== FILTER + SEARCH ==========
function getFilteredTransactions() {
  let searchText = searchInput.value.toLowerCase();
  let result = [];

  for (let i = 0; i < data.transactions.length; i++) {
    let item = data.transactions[i];

    let matchFilter = currentFilter === "all" || item.type === currentFilter;

    let matchSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.type.toLowerCase().includes(searchText);

    if (matchFilter && matchSearch) {
      result.push(item);
    }
  }

  return result;
}


// ========== TABLE RENDER ==========
function renderTable() {
  let transactions = getFilteredTransactions();

  txTable.innerHTML = "";

  if (transactions.length === 0) {
    txTable.innerHTML = `
      <tr>
        <td colspan="6">No transactions found.</td>
      </tr>
    `;
    return;
  }

  for (let i = 0; i < transactions.length; i++) {
    let item = transactions[i];

    let sign = item.type === "income" ? "+" : "-";
    let amountClass = item.type === "income" ? "plus" : "minus";
    let note = item.note || "No note";

    txTable.innerHTML += `
      <tr data-id="${item.id}">
        <td>
          <div class="title-box">
            <div class="tx-icon ${item.category}">
              <i class="fa-solid ${getIcon(item.category)}"></i>
            </div>

            <div>
              <div class="tx-name">${item.title}</div>
              <div class="tx-sub">${note}</div>
            </div>
          </div>
        </td>

        <td>
          <span class="tag ${item.category}">${item.category}</span>
        </td>

        <td>${item.date}</td>

        <td>
          <span class="status ${item.type}">${item.type}</span>
        </td>

        <td class="amt ${amountClass}">
          ${sign}${money(item.amount)}
        </td>

        <td>
          <button class="row-btn">Delete</button>
        </td>
      </tr>
    `;
  }
}

function renderPage() {
  updateSummary();
  renderTable();
}


// ========== ACTIONS ==========
function deleteTransaction(event) {
  if (!event.target.classList.contains("row-btn")) {
    return;
  }

  let row = event.target.closest("tr");
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
    renderPage();
  }
}

function changeFilter(event) {
  for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].classList.remove("active");
  }

  event.target.classList.add("active");
  currentFilter = event.target.getAttribute("data-filter");

  renderTable();
}


// ========== START ==========
setUser();
renderPage();

searchInput.addEventListener("input", renderTable);
txTable.addEventListener("click", deleteTransaction);

for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].addEventListener("click", changeFilter);
}

if (addBtn) {
  addBtn.addEventListener("click", function () {
    location.href = "home.html";
  });
}