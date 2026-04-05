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

/* choice select */
const choices = document.querySelectorAll(".choice");

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");
  });
});

/* popup logic */
const openSignin = document.getElementById("openSignin");
const popupBg = document.getElementById("popupBg");
const connectPopup = document.getElementById("connectPopup");
const joinPopup = document.getElementById("joinPopup");
const closePopup = document.getElementById("closePopup");
const closeJoinPopup = document.getElementById("closeJoinPopup");

const contactInput = document.getElementById("contactInput");
const getStartedBtn = document.getElementById("getStartedBtn");

const connectOptions = document.querySelectorAll(".connect-option");
const popupForm = document.getElementById("popupForm");
const popupInput = document.getElementById("popupInput");
const popupLabel = document.getElementById("popupLabel");

const joinValue = document.getElementById("joinValue");
const joinNowBtn = document.getElementById("joinNowBtn");

let selectedType = "";

function openPopup() {
  if (!popupBg) return;
  popupBg.classList.add("show");
  connectPopup.classList.remove("hidden");
  joinPopup.classList.add("hidden");
  popupForm.classList.add("hidden");
  popupInput.value = "";
}

function closeAllPopups() {
  if (!popupBg) return;
  popupBg.classList.remove("show");
  connectPopup.classList.remove("hidden");
  joinPopup.classList.add("hidden");
  popupForm.classList.add("hidden");
  popupInput.value = "";
}

function showJoinPopup(value) {
  joinValue.textContent = value;
  connectPopup.classList.add("hidden");
  joinPopup.classList.remove("hidden");
  popupBg.classList.add("show");
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

function makeUserName(value) {
  if (isValidEmail(value)) {
    const firstPart = value.split("@")[0];
    const cleanName = firstPart.replace(/[._-]/g, " ").trim();

    return cleanName
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "User";
}

function saveUserAndGo(value) {
  localStorage.setItem("userContact", value);
  localStorage.setItem("userName", makeUserName(value));
  window.location.href = "home.html";
}

if (openSignin) {
  openSignin.addEventListener("click", (e) => {
    e.preventDefault();
    openPopup();
  });
}

if (closePopup) {
  closePopup.addEventListener("click", closeAllPopups);
}

if (closeJoinPopup) {
  closeJoinPopup.addEventListener("click", closeAllPopups);
}

if (popupBg) {
  popupBg.addEventListener("click", (e) => {
    if (e.target === popupBg) {
      closeAllPopups();
    }
  });
}

connectOptions.forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.getAttribute("data-type");

    popupForm.classList.remove("hidden");

    if (selectedType === "email") {
      popupLabel.textContent = "Email";
      popupInput.placeholder = "Enter your email";
      popupInput.value = "";
    } else if (selectedType ==="phone"){
      popupLabel.textContent = "Phone Number";
      popupInput.placeholder = "Enter your phone number";
      popupInput.value = "";
    }
    else{
      popupLabel.textContent = "UserName";
      popupInput.placeholder = "Enter your Name";
      popupInput.value = "";
    }

    popupInput.focus();
  });
});

if (popupForm) {
  popupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = popupInput.value.trim();

    if (value === "") {
      alert("Email ya phone number dalna zaruri hai.");
      return;
    }

    if (selectedType === "email" && !isValidEmail(value)) {
      alert("Please valid email dalo.");
      return;
    }

    if (selectedType === "phone" && !isValidPhone(value)) {
      alert("Please valid 10 digit phone number dalo.");
      return;
    }

    saveUserAndGo(value);
  });
}

if (getStartedBtn) {
  getStartedBtn.addEventListener("click", () => {
    const value = contactInput.value.trim();

    if (value === "") {
      alert("Email ya phone number dalna zaruri hai.");
      return;
    }

    if (!isValidContact(value)) {
      alert("Valid email ya 10 digit phone number dalo.");
      return;
    }

    showJoinPopup(value);
  });
}

if (joinNowBtn) {
  joinNowBtn.addEventListener("click", () => {
    const value = joinValue.textContent.trim();

    if (!value) {
      alert("Email ya phone number dalna zaruri hai.");
      return;
    }

    saveUserAndGo(value);
  });
}