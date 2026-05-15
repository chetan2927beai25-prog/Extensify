const openSignin = document.getElementById("openSignin");
const popupBg = document.getElementById("popupBg");
const closePopup = document.getElementById("closePopup");

const closeJoinPopup = document.getElementById("closeJoinPopup");
const connectPopup = document.getElementById("connectPopup");
const joinPopup = document.getElementById("joinPopup");

const popupForm = document.getElementById("popupForm");
const connectOptions = document.querySelectorAll(".connect-option");
const joinValue = document.getElementById("joinValue");

const joinNowBtn = document.getElementById("joinNowBtn");
const heroForm = document.getElementById("heroForm");
const contactInput = document.getElementById("contactInput");

const choices = document.querySelectorAll(".choice");
const featureGrid = document.getElementById("featureGrid");
const featureBtn = document.getElementById("featureBtn");

const storyList = document.getElementById("storyList");
const storyPrev = document.getElementById("storyPrev");
const storyNext = document.getElementById("storyNext");

const tabButtons = document.querySelectorAll(".tab-btn");
const icon1 = document.getElementById("icon1");
const icon2 = document.getElementById("icon2");

const icon3 = document.getElementById("icon3");
const title1 = document.getElementById("title1");
const title2 = document.getElementById("title2");

const title3 = document.getElementById("title3");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");

const text3 = document.getElementById("text3");
const faqQuestions = document.querySelectorAll(".faq-question");
const trialButtons = document.querySelectorAll(".trial-btn");

const googleButtons = document.querySelectorAll(".google-btn");
const socialButtons = document.querySelectorAll(".social-circle");

let finalUserName = "";
let finalEmail = "";
let finalPhone = "";
let featuresOpen = false;

function showSignupForm() {
  const popupTitle = document.querySelector("#connectPopup .popup-title");

  if (popupTitle) {
    popupTitle.textContent = "Create your Extensify account";
  }

  for (let i = 0; i < connectOptions.length; i++) {
    connectOptions[i].style.display = "none";
  }

  popupForm.classList.remove("hidden");

  popupForm.innerHTML =
    '<label for="usernameInput">Username</label>' +
    '<input type="text" id="usernameInput" placeholder="Enter your username">' +

    '<label for="emailInput">Email</label>' +
    '<input type="email" id="emailInput" placeholder="Enter your email">' +

    '<label for="phoneInput">Phone Number</label>' +
    '<input type="text" id="phoneInput" placeholder="Enter your phone number">' +

    '<button type="submit" class="popup-continue-btn">Continue</button>';
}

function openSignupPopup() {
  popupBg.classList.add("show");
  connectPopup.classList.remove("hidden");
  joinPopup.classList.add("hidden");

  showSignupForm();
}

function closeAllPopups() {
  popupBg.classList.remove("show");
}

function isPhoneValid(phone) {
  if (phone.length < 10) {
    return false;
  }

  for (let i = 0; i < phone.length; i++) {
    if (phone[i] < "0" || phone[i] > "9") {
      return false;
    }
  }

  return true;
}

function saveUserData() {
  localStorage.setItem("userName", finalUserName);
  localStorage.setItem("userEmail", finalEmail);
  localStorage.setItem("userPhone", finalPhone);

  // baki pages userContact read kar rahe hain
  localStorage.setItem("userContact", finalEmail);
}

function checkSignupForm(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (username === "") {
    alert("Please enter username");
    return;
  }

  if (email === "") {
    alert("Please enter email");
    return;
  }

  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    alert("Please enter valid email");
    return;
  }

  if (phone === "") {
    alert("Please enter phone number");
    return;
  }

  if (isPhoneValid(phone) === false) {
    alert("Please enter valid 10 digit phone number");
    return;
  }

  finalUserName = username;
  finalEmail = email;
  finalPhone = phone;

  connectPopup.classList.add("hidden");
  joinPopup.classList.remove("hidden");

  joinValue.textContent = finalUserName;
}

if (openSignin) {
  openSignin.addEventListener("click", function (event) {
    event.preventDefault();
    openSignupPopup();
  });
}

if (closePopup) {
  closePopup.addEventListener("click", closeAllPopups);
}

if (closeJoinPopup) {
  closeJoinPopup.addEventListener("click", closeAllPopups);
}

if (popupForm) {
  popupForm.addEventListener("submit", checkSignupForm);
}

if (joinNowBtn) {
  joinNowBtn.addEventListener("click", function () {
    saveUserData();
    location.href = "home.html";
  });
}

if (heroForm) {
  heroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = contactInput.value.trim();

    openSignupPopup();

    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");

    if (value.indexOf("@") !== -1) {
      emailInput.value = value;
    } else {
      phoneInput.value = value;
    }
  });
}

for (let i = 0; i < trialButtons.length; i++) {
  trialButtons[i].addEventListener("click", function () {
    openSignupPopup();
  });
}

for (let i = 0; i < googleButtons.length; i++) {
  googleButtons[i].addEventListener("click", function (event) {
    event.preventDefault();
    openSignupPopup();
  });
}

for (let i = 0; i < socialButtons.length; i++) {
  socialButtons[i].addEventListener("click", function (event) {
    event.preventDefault();
    openSignupPopup();
  });
}

/* choice buttons */
for (let i = 0; i < choices.length; i++) {
  choices[i].addEventListener("click", function () {
    for (let j = 0; j < choices.length; j++) {
      choices[j].classList.remove("active");
    }

    this.classList.add("active");
  });
}

/* features show / hide */
if (featureBtn) {
  featureBtn.addEventListener("click", function () {
    if (featuresOpen === false) {
      featureGrid.classList.add("show-all");
      featureBtn.textContent = "Show Less";
      featuresOpen = true;
    } else {
      featureGrid.classList.remove("show-all");
      featureBtn.textContent = "See All Features";
      featuresOpen = false;
    }
  });
}

/* story slider */
if (storyNext) {
  storyNext.addEventListener("click", function () {
    storyList.scrollLeft = storyList.scrollLeft + 340;
  });
}

if (storyPrev) {
  storyPrev.addEventListener("click", function () {
    storyList.scrollLeft = storyList.scrollLeft - 340;
  });
}

/* trial tabs */
function changeTrialTab(tabName) {
  if (tabName === "employees") {
    icon1.innerHTML = '<i class="fa-solid fa-receipt"></i>';
    title1.textContent = "1. Scan receipts";
    text1.textContent = "Scan receipts in the mobile app, drag and drop files, or forward them by email.";

    icon2.innerHTML = '<i class="fa-solid fa-file-lines"></i>';
    title2.textContent = "2. Submit reports";
    text2.textContent = "Create reports automatically and submit your expenses for reimbursement.";

    icon3.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
    title3.textContent = "3. Get reimbursed";
    text3.textContent = "Get paid back quickly to your bank account with less follow-up work.";
  } else if (tabName === "owners") {
    icon1.innerHTML = '<i class="fa-solid fa-users"></i>';
    title1.textContent = "1. Add your team";
    text1.textContent = "Create a workspace and invite your small business team.";

    icon2.innerHTML = '<i class="fa-solid fa-wallet"></i>';
    title2.textContent = "2. Track spending";
    text2.textContent = "Watch expenses category wise and control monthly spending.";

    icon3.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
    title3.textContent = "3. Review reports";
    text3.textContent = "Check reports and understand where your money is going.";
  } else if (tabName === "controllers") {
    icon1.innerHTML = '<i class="fa-solid fa-file-invoice"></i>';
    title1.textContent = "1. Collect data";
    text1.textContent = "Collect employee expenses and organize them in one place.";

    icon2.innerHTML = '<i class="fa-solid fa-check"></i>';
    title2.textContent = "2. Approve expenses";
    text2.textContent = "Review expenses and approve the correct entries.";

    icon3.innerHTML = '<i class="fa-solid fa-chart-pie"></i>';
    title3.textContent = "3. Control budget";
    text3.textContent = "Use reports to manage company budget better.";
  }
}

for (let i = 0; i < tabButtons.length; i++) {
  tabButtons[i].addEventListener("click", function () {
    for (let j = 0; j < tabButtons.length; j++) {
      tabButtons[j].classList.remove("active");
    }

    this.classList.add("active");

    const tabName = this.getAttribute("data-tab");
    changeTrialTab(tabName);
  });
}

/* FAQ open / close */
for (let i = 0; i < faqQuestions.length; i++) {
  faqQuestions[i].addEventListener("click", function () {
    const faqItem = this.parentElement;

    if (faqItem.classList.contains("open")) {
      faqItem.classList.remove("open");
    } else {
      faqItem.classList.add("open");
    }
  });
}