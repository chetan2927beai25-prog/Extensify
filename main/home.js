document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEYS = {
    dashboard: "expenseflow_dashboard",
    transactions: "expenseflow_transactions",
    budget: "budgetData",
    userName: "userName",
    userContact: "userContact",
    reminder: "budgetReminder"
  };

  /* -----------------------------
     Dashboard elements
  ----------------------------- */
  const summaryValues = document.querySelectorAll(".card-row .small-card h3");
  const balanceEl = summaryValues[0] || null;
  const incomeEl = summaryValues[1] || null;
  const expenseEl = summaryValues[2] || null;

  const addCard = document.querySelector(".add-card");
  const titleInput = addCard ? addCard.querySelector('input[type="text"]') : null;
  const amountInput = addCard ? addCard.querySelector('input[type="number"]') : null;
  const categoryInput = addCard ? addCard.querySelector("select") : null;
  const dateInput = addCard ? addCard.querySelector('input[type="date"]') : null;
  const saveExpenseBtn = addCard ? addCard.querySelector(".save-btn") : null;

  const recentCard = document.querySelector(".last-card");
  const recentTitle = recentCard ? recentCard.querySelector(".card-title") : null;

  let recentList = document.getElementById("recentTransactionList");

  if (!recentList && recentCard) {
    recentList = document.createElement("div");
    recentList.id = "recentTransactionList";

    const oldItems = recentCard.querySelectorAll(".item");
    oldItems.forEach((item) => {
      recentList.appendChild(item);
    });

    recentCard.appendChild(recentList);
  }

  /* -----------------------------
     Account popup elements
  ----------------------------- */
  const openAccountPopup = document.getElementById("openAccountPopup");
  const accountPopupBg = document.getElementById("accountPopupBg");
  const closeAccountPopup = document.getElementById("closeAccountPopup");

  const dashboardUserName = document.getElementById("userName");
  const dashboardUserIcon = document.querySelector(".user-icon");

  const popupUserName = document.getElementById("popupUserName");
  const popupUserContact = document.getElementById("popupUserContact");
  const popupAvatar = document.getElementById("popupAvatar");

  const accountNameInput = document.getElementById("accountNameInput");
  const accountContactInput = document.getElementById("accountContactInput");
  const reminderToggle = document.getElementById("reminderToggle");

  const saveAccountBtn = document.getElementById("saveAccountBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");

  /* -----------------------------
     Helpers
  ----------------------------- */
  function parseMoney(value) {
    return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
  }

  function formatMoney(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
  }

  function getFirstLetter(value) {
    return String(value || "").trim().charAt(0).toUpperCase() || "U";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9]{10}$/.test(value);
  }

  function isValidContact(value) {
    return isValidEmail(value) || isValidPhone(value);
  }

  function formatDisplayDate(dateValue) {
    if (!dateValue) return "Today";

    if (String(dateValue).includes("Today") || String(dateValue).includes("Yesterday")) {
      return dateValue;
    }

    const dateObj = new Date(dateValue);
    if (isNaN(dateObj.getTime())) return dateValue;

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const givenOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const diff = Math.round((todayOnly - givenOnly) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
function createTransactionId() {
  return "tx_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
}

function normalizeDashboardTransactions(list) {
  if (!Array.isArray(list)) return [];

  return list.map((tx) => {
    return {
      id: tx.id || createTransactionId(),
      title: tx.title || "Expense",
      date: tx.date || new Date().toISOString().split("T")[0],
      amount: Number(tx.amount || 0),
      type: tx.type || "expense"
    };
  });
}

function normalizeTransactionStorage() {
  let savedTransactions = [];

  try {
    savedTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
  } catch (error) {
    savedTransactions = [];
  }

  if (!Array.isArray(savedTransactions)) {
    savedTransactions = [];
  }

  savedTransactions = savedTransactions.map((tx) => {
    return {
      id: tx.id || createTransactionId(),
      title: tx.title || "Expense",
      category: tx.category || "Other",
      amount: Number(tx.amount || 0),
      date: tx.date || new Date().toISOString().split("T")[0],
      type: tx.type || "expense"
    };
  });

  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(savedTransactions));
  return savedTransactions;
}

function updateSummaryAfterEdit(oldTx, newTx) {
  const oldAmount = Number(oldTx.amount || 0);
  const newAmount = Number(newTx.amount || 0);
  const diff = newAmount - oldAmount;

  if (oldTx.type === "income") {
    dashboardState.income += diff;
    dashboardState.balance += diff;
  } else {
    dashboardState.expense += diff;
    dashboardState.balance -= diff;
  }
}

function updateSummaryAfterDelete(tx) {
  const amount = Number(tx.amount || 0);

  if (tx.type === "income") {
    dashboardState.income -= amount;
    dashboardState.balance -= amount;
  } else {
    dashboardState.expense -= amount;
    dashboardState.balance += amount;
  }
}
  /* -----------------------------
     User data
  ----------------------------- */
  function getSavedName() {
    return localStorage.getItem(STORAGE_KEYS.userName) || "";
  }

  function getSavedContact() {
    return localStorage.getItem(STORAGE_KEYS.userContact) || "";
  }

  function getReminderValue() {
    return localStorage.getItem(STORAGE_KEYS.reminder) === "true";
  }

  function fillUserData() {
    const currentName = getSavedName().trim() || "User";
    const currentContact = getSavedContact().trim() || "No contact added";
    const firstLetter = getFirstLetter(currentName);

    if (dashboardUserName) {
      dashboardUserName.textContent = currentName;
    }

    if (dashboardUserIcon) {
      dashboardUserIcon.textContent = firstLetter;
    }

    if (popupUserName) {
      popupUserName.textContent = currentName;
    }

    if (popupUserContact) {
      popupUserContact.textContent = currentContact;
    }

    if (popupAvatar) {
      popupAvatar.textContent = firstLetter;
    }

    if (accountNameInput) {
      accountNameInput.value = getSavedName();
    }

    if (accountContactInput) {
      accountContactInput.value = getSavedContact();
    }

    if (reminderToggle) {
      reminderToggle.checked = getReminderValue();
    }
  }

  /* -----------------------------
     Dashboard state
  ----------------------------- */
  function getInitialTransactionsFromHTML() {
    if (!recentList) return [];

    const items = recentList.querySelectorAll(".item");

    return Array.from(items).map((item) => {
      const title = item.querySelector(".item-title")?.textContent?.trim() || "Expense";
      const date = item.querySelector(".item-date")?.textContent?.trim() || "Today";
      const amountSpan = item.querySelector(".plus, .minus");
      const amountText = amountSpan ? amountSpan.textContent : "0";
      const amount = parseMoney(amountText);
      const type = amountSpan && amountSpan.classList.contains("plus") ? "income" : "expense";

      return {
        title,
        date,
        amount,
        type
      };
    });
  }

function getInitialDashboardState() {
  return {
    balance: parseMoney(balanceEl ? balanceEl.textContent : 0),
    income: parseMoney(incomeEl ? incomeEl.textContent : 0),
    expense: parseMoney(expenseEl ? expenseEl.textContent : 0),
    transactions: normalizeDashboardTransactions(getInitialTransactionsFromHTML())
  };
}
function loadDashboardState() {
  const raw = localStorage.getItem(STORAGE_KEYS.dashboard);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        parsed.transactions = normalizeDashboardTransactions(parsed.transactions);
        return parsed;
      }
    } catch (error) {
      console.log("Saved dashboard data invalid, using default HTML values.");
    }
  }

  const initialState = getInitialDashboardState();
  localStorage.setItem(STORAGE_KEYS.dashboard, JSON.stringify(initialState));
  return initialState;
}

  let dashboardState = loadDashboardState();

  function saveDashboardState() {
    localStorage.setItem(STORAGE_KEYS.dashboard, JSON.stringify(dashboardState));
  }

  function renderSummary() {
    if (balanceEl) balanceEl.textContent = formatMoney(dashboardState.balance);
    if (incomeEl) incomeEl.textContent = formatMoney(dashboardState.income);
    if (expenseEl) expenseEl.textContent = formatMoney(dashboardState.expense);
  }

function renderTransactions() {
  if (!recentList) return;

  recentList.innerHTML = "";

  if (!dashboardState.transactions || dashboardState.transactions.length === 0) {
    recentList.innerHTML = `
      <div class="item">
        <div>
          <p class="item-title">No transactions yet</p>
          <p class="item-date">Add your first expense</p>
        </div>
        <span class="minus">₹0</span>
      </div>
    `;
    return;
  }

  const latestTransactions = dashboardState.transactions.slice(0, 6);

  latestTransactions.forEach((tx) => {
    const item = document.createElement("div");
    item.className = "item";
    item.setAttribute("data-id", tx.id);

    item.innerHTML = `
      <div class="item-left">
        <p class="item-title">${tx.title}</p>
        <p class="item-date">${formatDisplayDate(tx.date)}</p>
      </div>

      <div class="item-right">
        <span class="${tx.type === "income" ? "plus" : "minus"}">
          ${tx.type === "income" ? "+ " : "- "}${formatMoney(tx.amount)}
        </span>

        <div class="item-actions">
          <button class="action-btn edit-btn" data-action="edit" data-id="${tx.id}">
            Edit
          </button>
          <button class="action-btn delete-btn" data-action="delete" data-id="${tx.id}">
            Delete
          </button>
        </div>
      </div>
    `;

    recentList.appendChild(item);
  });
}

  function renderDashboard() {
    renderSummary();
    renderTransactions();
  }

  /* -----------------------------
     Sync with transaction page storage
  ----------------------------- */
function syncTransactionStorage(id, title, category, amount, dateValue) {
  let savedTransactions = normalizeTransactionStorage();

  savedTransactions.unshift({
    id: id,
    title: title,
    category: category,
    amount: amount,
    date: dateValue || new Date().toISOString().split("T")[0],
    type: "expense"
  });

  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(savedTransactions));
}

function updateTransactionStorage(updatedTx) {
  let savedTransactions = normalizeTransactionStorage();

  savedTransactions = savedTransactions.map((tx) => {
    if (tx.id === updatedTx.id) {
      return {
        ...tx,
        title: updatedTx.title,
        amount: updatedTx.amount,
        date: updatedTx.date
      };
    }
    return tx;
  });

  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(savedTransactions));
}

function deleteTransactionStorage(id) {
  let savedTransactions = normalizeTransactionStorage();

  savedTransactions = savedTransactions.filter((tx) => tx.id !== id);

  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(savedTransactions));
}
  /* -----------------------------
     Sync with budget page storage
  ----------------------------- */
  function syncBudgetData(category, amount) {
    let savedBudget = [];

    try {
      savedBudget = JSON.parse(localStorage.getItem(STORAGE_KEYS.budget)) || [];
    } catch (error) {
      savedBudget = [];
    }

    if (!Array.isArray(savedBudget)) return;

    const found = savedBudget.find((item) => {
      return String(item.category).toLowerCase() === String(category).toLowerCase();
    });

    if (found) {
      found.spent = Number(found.spent || 0) + Number(amount || 0);
      localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(savedBudget));
    }
  }

  /* -----------------------------
     Add expense form
  ----------------------------- */
  if (saveExpenseBtn) {
    saveExpenseBtn.addEventListener("click", function () {
      const titleValue = titleInput ? titleInput.value.trim() : "";
      const amountValue = amountInput ? Number(amountInput.value) : 0;
      const categoryValue = categoryInput ? categoryInput.value.trim() : "";
      const dateValue = dateInput ? dateInput.value : "";

      if (titleValue === "") {
        alert("Please enter expense title.");
        return;
      }

      if (!amountValue || amountValue <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      if (
        categoryValue === "" ||
        categoryValue.toLowerCase().includes("choose")
      ) {
        alert("Please choose a category.");
        return;
      }

      dashboardState.expense += amountValue;
      dashboardState.balance -= amountValue;

     const txId = createTransactionId();

dashboardState.transactions.unshift({
  id: txId,
  title: titleValue,
  date: dateValue || new Date().toISOString().split("T")[0],
  amount: amountValue,
  type: "expense"
});
      saveDashboardState();
      renderDashboard();

syncTransactionStorage(txId, titleValue, categoryValue, amountValue, dateValue);
      syncBudgetData(categoryValue, amountValue);

      if (titleInput) titleInput.value = "";
      if (amountInput) amountInput.value = "";
      if (categoryInput) categoryInput.selectedIndex = 0;
      if (dateInput) dateInput.value = "";

      alert("Expense added successfully.");
    });
  }

  /* -----------------------------
     Account popup
  ----------------------------- */
  function openPopup() {
    if (!accountPopupBg) return;
    fillUserData();
    accountPopupBg.classList.add("show");
    document.body.classList.add("popup-open");
  }

  function closePopup() {
    if (!accountPopupBg) return;
    accountPopupBg.classList.remove("show");
    document.body.classList.remove("popup-open");
  }

  if (openAccountPopup) {
    openAccountPopup.addEventListener("click", function (e) {
      e.preventDefault();
      openPopup();
    });
  }

  if (closeAccountPopup) {
    closeAccountPopup.addEventListener("click", closePopup);
  }

  if (accountPopupBg) {
    accountPopupBg.addEventListener("click", function (e) {
      if (e.target === accountPopupBg) {
        closePopup();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePopup();
    }
  });

  if (saveAccountBtn) {
    saveAccountBtn.addEventListener("click", function () {
      const newName = accountNameInput ? accountNameInput.value.trim() : "";
      const newContact = accountContactInput ? accountContactInput.value.trim() : "";

      if (newName === "") {
        alert("Please enter your name.");
        return;
      }

      if (newContact === "") {
        alert("Please enter email or phone.");
        return;
      }

      if (!isValidContact(newContact)) {
        alert("Please enter a valid email or 10 digit phone number.");
        return;
      }

      localStorage.setItem(STORAGE_KEYS.userName, newName);
      localStorage.setItem(STORAGE_KEYS.userContact, newContact);
      localStorage.setItem(
        STORAGE_KEYS.reminder,
        reminderToggle && reminderToggle.checked ? "true" : "false"
      );

      fillUserData();
      closePopup();
      alert("Profile updated successfully.");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEYS.userName);
      localStorage.removeItem(STORAGE_KEYS.userContact);
      localStorage.removeItem(STORAGE_KEYS.reminder);

      fillUserData();
      closePopup();
      alert("Logged out successfully.");
    });
  }

  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", function () {
      const ok = confirm("Do you want to clear all saved app data?");
      if (!ok) return;

      localStorage.removeItem(STORAGE_KEYS.dashboard);
      localStorage.removeItem(STORAGE_KEYS.transactions);
      localStorage.removeItem(STORAGE_KEYS.budget);
      localStorage.removeItem(STORAGE_KEYS.userName);
      localStorage.removeItem(STORAGE_KEYS.userContact);
      localStorage.removeItem(STORAGE_KEYS.reminder);

      location.reload();
    });
  }

  /* -----------------------------
     First load
  ----------------------------- */
  fillUserData();
  renderDashboard();
});
