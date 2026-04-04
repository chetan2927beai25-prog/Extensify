const STORAGE_KEYS = {
  dashboard: "expenseflow_dashboard",
  transactions: "expenseflow_transactions",
  budget: "budgetData",
  userName: "userName",
  userContact: "userContact",
  reminder: "budgetReminder",
  role: "userRole",
  currency: "currencySymbol",
  theme: "themeMode",
  joined: "joinedDate",
  savings: "expenseflow_savings"
};

const topUserName = document.getElementById("topUserName");
const topUserIcon = document.getElementById("topUserIcon");

const profileName = document.getElementById("profileName");
const profileContact = document.getElementById("profileContact");
const mainAvatar = document.getElementById("mainAvatar");
const joinedText = document.getElementById("joinedText");

const nameInput = document.getElementById("nameInput");
const contactInput = document.getElementById("contactInput");
const roleInput = document.getElementById("roleInput");

const reminderToggle = document.getElementById("reminderToggle");
const themeToggle = document.getElementById("themeToggle");
const currencySelect = document.getElementById("currencySelect");

const totalTransactions = document.getElementById("totalTransactions");
const totalSavings = document.getElementById("totalSavings");
const totalBudgetCategories = document.getElementById("totalBudgetCategories");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const clearDataBtn = document.getElementById("clearDataBtn");
const logoutBtn = document.getElementById("logoutBtn");

function getStorageValue(key, fallback = "") {
  return localStorage.getItem(key) || fallback;
}

function formatMoney(value) {
  const currency = getStorageValue(STORAGE_KEYS.currency, "₹");
  return currency + Number(value || 0).toLocaleString("en-IN");
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

function getJoinedDate() {
  let joined = localStorage.getItem(STORAGE_KEYS.joined);

  if (!joined) {
    joined = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    localStorage.setItem(STORAGE_KEYS.joined, joined);
  }

  return joined;
}

function getTransactionsCount() {
  try {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
    return Array.isArray(transactions) ? transactions.length : 0;
  } catch (error) {
    return 0;
  }
}

function getBudgetCount() {
  try {
    const budget = JSON.parse(localStorage.getItem(STORAGE_KEYS.budget)) || [];
    return Array.isArray(budget) ? budget.length : 0;
  } catch (error) {
    return 0;
  }
}

function getSavingsAmount() {
  try {
    const savings = JSON.parse(localStorage.getItem(STORAGE_KEYS.savings)) || [];
    if (!Array.isArray(savings)) return 0;

    return savings.reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);
  } catch (error) {
    return 0;
  }
}

function applyTheme() {
  const themeMode = getStorageValue(STORAGE_KEYS.theme, "dark");

  if (themeMode === "light") {
    document.body.style.background = "#eaf4ef";
    document.body.style.color = "#05261f";
  } else {
    document.body.style.background = "#02241c";
    document.body.style.color = "white";
  }
}

function fillProfile() {
  const savedName = getStorageValue(STORAGE_KEYS.userName, "User");
  const savedContact = getStorageValue(STORAGE_KEYS.userContact, "No contact added");
  const savedRole = getStorageValue(STORAGE_KEYS.role, "Student");
  const firstLetter = getFirstLetter(savedName);

  topUserName.textContent = savedName;
  topUserIcon.textContent = firstLetter;

  profileName.textContent = savedName;
  profileContact.textContent = savedContact;
  mainAvatar.textContent = firstLetter;
  joinedText.textContent = "Joined " + getJoinedDate();

  nameInput.value = savedName === "User" ? "" : savedName;
  contactInput.value = savedContact === "No contact added" ? "" : savedContact;
  roleInput.value = savedRole;

  reminderToggle.checked = localStorage.getItem(STORAGE_KEYS.reminder) === "true";
  themeToggle.checked = getStorageValue(STORAGE_KEYS.theme, "dark") === "light";
  currencySelect.value = getStorageValue(STORAGE_KEYS.currency, "₹");

  totalTransactions.textContent = getTransactionsCount();
  totalSavings.textContent = formatMoney(getSavingsAmount());
  totalBudgetCategories.textContent = getBudgetCount();
}

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", () => {
    const newName = nameInput.value.trim();
    const newContact = contactInput.value.trim();
    const newRole = roleInput.value.trim();

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
    localStorage.setItem(STORAGE_KEYS.role, newRole || "Student");
    localStorage.setItem(STORAGE_KEYS.reminder, reminderToggle.checked ? "true" : "false");
    localStorage.setItem(STORAGE_KEYS.theme, themeToggle.checked ? "light" : "dark");
    localStorage.setItem(STORAGE_KEYS.currency, currencySelect.value);

    fillProfile();
    applyTheme();
    alert("Profile updated successfully.");
  });
}

if (exportDataBtn) {
  exportDataBtn.addEventListener("click", () => {
    const exportObject = {
      userName: localStorage.getItem(STORAGE_KEYS.userName),
      userContact: localStorage.getItem(STORAGE_KEYS.userContact),
      role: localStorage.getItem(STORAGE_KEYS.role),
      reminder: localStorage.getItem(STORAGE_KEYS.reminder),
      currency: localStorage.getItem(STORAGE_KEYS.currency),
      dashboard: localStorage.getItem(STORAGE_KEYS.dashboard),
      transactions: localStorage.getItem(STORAGE_KEYS.transactions),
      budget: localStorage.getItem(STORAGE_KEYS.budget),
      savings: localStorage.getItem(STORAGE_KEYS.savings)
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expense-tracker-data.json";
    a.click();

    URL.revokeObjectURL(url);
  });
}

if (clearDataBtn) {
  clearDataBtn.addEventListener("click", () => {
    const ok = confirm("Do you want to clear all saved app data?");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEYS.dashboard);
    localStorage.removeItem(STORAGE_KEYS.transactions);
    localStorage.removeItem(STORAGE_KEYS.budget);
    localStorage.removeItem(STORAGE_KEYS.savings);
    localStorage.removeItem(STORAGE_KEYS.userName);
    localStorage.removeItem(STORAGE_KEYS.userContact);
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.reminder);
    localStorage.removeItem(STORAGE_KEYS.currency);
    localStorage.removeItem(STORAGE_KEYS.theme);

    alert("All saved data cleared.");
    location.reload();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.userName);
    localStorage.removeItem(STORAGE_KEYS.userContact);
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.reminder);

    alert("Logged out successfully.");
    window.location.href = "landing.html";
  });
}

applyTheme();
fillProfile();