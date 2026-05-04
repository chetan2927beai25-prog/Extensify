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
  },
  whatsNew: {
    title: "What's new",
    icon: '<i class="fa-regular fa-newspaper"></i>'
  },
  about: {
    title: "About",
    icon: '<i class="fa-solid fa-circle-info"></i>'
  },
  troubleshoot: {
    title: "Troubleshoot",
    icon: '<i class="fa-regular fa-lightbulb"></i>'
  },
  saveWorld: {
    title: "Save the world",
    icon: '<i class="fa-regular fa-heart"></i>'
  }
};

/* Re-trigger CSS animation by removing + forcing reflow + re-adding class */
function popIn(panel) {
  panel.classList.remove("pop-in");
  void panel.offsetWidth; // force reflow so animation restarts
  panel.classList.add("pop-in");
}

/* Also animate the header icon/title */
function animateHeader() {
  const el = document.querySelector(".top-head");
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "accountEnter 0.32s ease both";
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const tabName = item.getAttribute("data-tab");

    menuItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");

    tabPanels.forEach((panel) => {
      panel.classList.remove("show");
      panel.classList.remove("pop-in");
    });

    const currentPanel = document.getElementById(tabName);
    if (currentPanel) {
      currentPanel.classList.add("show");
      popIn(currentPanel);
    }

    if (pageData[tabName]) {
      pageTitle.textContent = pageData[tabName].title;
      headIcon.innerHTML = pageData[tabName].icon;
      animateHeader();
    }
  });
});

/* Trigger pop-in on the default visible panel on page load */
const defaultPanel = document.querySelector(".tab-panel.show");
if (defaultPanel) popIn(defaultPanel);

/* switches */
const switches = document.querySelectorAll(".switch");
switches.forEach((sw) => {
  sw.addEventListener("click", () => {
    sw.classList.toggle("on");
  });
});

/* troubleshoot buttons */
const reloadBtn = document.getElementById("reloadBtn");
const clearAccountBtn = document.getElementById("clearAccountBtn");
if (reloadBtn) reloadBtn.addEventListener("click", () => location.reload());
if (clearAccountBtn) clearAccountBtn.addEventListener("click", () => {
  if (confirm("Clear all account data from localStorage?")) localStorage.clear();
});