const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

const storyList = document.getElementById("storyList");
const storyPrev = document.getElementById("storyPrev");
const storyNext = document.getElementById("storyNext");

if (storyPrev && storyNext && storyList) {
  storyPrev.addEventListener("click", () => {
    storyList.scrollBy({
      left: -320,
      behavior: "smooth"
    });
  });

  storyNext.addEventListener("click", () => {
    storyList.scrollBy({
      left: 320,
      behavior: "smooth"
    });
  });
}

const tabButtons = document.querySelectorAll(".tab-btn");

const tabData = {
  employees: [
    {
      icon: "fa-receipt",
      title: "1. Scan receipts",
      text: "Scan receipts in the mobile app, drag and drop files, or forward them by email."
    },
    {
      icon: "fa-file-lines",
      title: "2. Submit reports",
      text: "Create reports automatically and submit your expenses for reimbursement."
    },
    {
      icon: "fa-paper-plane",
      title: "3. Get reimbursed",
      text: "Get paid back quickly to your bank account with less follow-up work."
    }
  ],

  owners: [
    {
      icon: "fa-sliders",
      title: "1. Set rules",
      text: "Set category limits and other expense rules to keep employee spend under control."
    },
    {
      icon: "fa-check-double",
      title: "2. Approve reports",
      text: "Review and approve every expense report, or ask Concierge AI to only flag the outliers."
    },
    {
      icon: "fa-money-bill-wave",
      title: "3. Reimburse employees",
      text: "Pay employees back in as little as one business day."
    }
  ],

  controllers: [
    {
      icon: "fa-sliders",
      title: "1. Set rules",
      text: "Set category limits and other expense rules to keep employee spend under control."
    },
    {
      icon: "fa-check-double",
      title: "2. Approve reports",
      text: "Review and approve every expense report, or ask Concierge AI to only flag the outliers."
    },
    {
      icon: "fa-file-invoice-dollar",
      title: "3. Update accounts",
      text: "Keep expense records organized and updated for easier tracking and reporting."
    }
  ]
};

function updateCards(tabName) {
  const items = tabData[tabName];
  if (!items) return;

  document.getElementById("icon1").innerHTML = `<i class="fa-solid ${items[0].icon}"></i>`;
  document.getElementById("title1").textContent = items[0].title;
  document.getElementById("text1").textContent = items[0].text;

  document.getElementById("icon2").innerHTML = `<i class="fa-solid ${items[1].icon}"></i>`;
  document.getElementById("title2").textContent = items[1].title;
  document.getElementById("text2").textContent = items[1].text;

  document.getElementById("icon3").innerHTML = `<i class="fa-solid ${items[2].icon}"></i>`;
  document.getElementById("title3").textContent = items[2].title;
  document.getElementById("text3").textContent = items[2].text;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedTab = button.getAttribute("data-tab");
    updateCards(selectedTab);
  });
});

const featureBtn = document.getElementById("featureBtn");
const featureGrid = document.getElementById("featureGrid");

if (featureBtn && featureGrid) {
  featureBtn.addEventListener("click", () => {
    featureGrid.classList.toggle("show-all");
    featureBtn.textContent = featureGrid.classList.contains("show-all")
      ? "Show Less"
      : "See All Features";
  });
}
const openLogin = document.getElementById("openLogin");
const closeLogin = document.getElementById("closeLogin");
const loginOverlay = document.getElementById("loginOverlay");

if (openLogin && closeLogin && loginOverlay) {
  openLogin.addEventListener("click", function (e) {
    e.preventDefault();
    loginOverlay.classList.add("show");
  });

  closeLogin.addEventListener("click", function () {
    loginOverlay.classList.remove("show");
  });

  loginOverlay.addEventListener("click", function (e) {
    if (e.target === loginOverlay) {
      loginOverlay.classList.remove("show");
    }
  });
}
const OpenLogin = document.getElementById("openLogin");
const CloseLogin = document.getElementById("closeLogin");
const popupBg = document.getElementById("popupBg");

if (openLogin && closeLogin && popupBg) {
  openLogin.addEventListener("click", function (e) {
    e.preventDefault();
    popupBg.classList.add("show");
  });

  closeLogin.addEventListener("click", function () {
    popupBg.classList.remove("show");
  });

  popupBg.addEventListener("click", function (e) {
    if (e.target === popupBg) {
      popupBg.classList.remove("show");
    }
  });
}