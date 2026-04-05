const menuItems = document.querySelectorAll(".menu-item[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");
const pageTitle = document.getElementById("pageTitle");
const headIcon = document.getElementById("headIcon");

const pageData = {
  profile: {
    title: "Profile",
    icon: '<i class="fa-solid fa-user"></i>'
  },
  preferences: {
    title: "Preferences",
    icon: '<i class="fa-solid fa-gears"></i>'
  },
  security: {
    title: "Security",
    icon: '<i class="fa-solid fa-lock"></i>'
  },
  help: {
    title: "Help",
    icon: '<i class="fa-regular fa-life-ring"></i>'
  },
  subscription: {
    title: "Subscription",
    icon: '<i class="fa-regular fa-credit-card"></i>'
  },
  wallet: {
    title: "Wallet",
    icon: '<i class="fa-regular fa-folder"></i>'
  },
  expenseRules: {
    title: "Expense rules",
    icon: '<i class="fa-solid fa-bolt"></i>'
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

/* switches */
const switches = document.querySelectorAll(".switch");
switches.forEach((sw) => {
  sw.addEventListener("click", () => {
    sw.classList.toggle("on");
  });
});