const oweList = document.getElementById("oweList");
const takeList = document.getElementById("takeList");
const oweEmpty = document.getElementById("oweEmpty");

const takeEmpty = document.getElementById("takeEmpty");
const settledList = document.getElementById("settledList");
const noSettled = document.getElementById("noSettled");

const totalIOwe = document.getElementById("totalIOwe");
const totalOwedMe = document.getElementById("totalOwedMe");
const netBalance = document.getElementById("netBalance");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");

const saveEntryBtn = document.getElementById("saveEntryBtn");
const clearSettled = document.getElementById("clearSettled");
const entryName = document.getElementById("entryName");

const entryAmount = document.getElementById("entryAmount");
const entryNote = document.getElementById("entryNote");
const entryDate = document.getElementById("entryDate");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userIcon = document.getElementById("userIcon");

let activeType = "owe";

let data = JSON.parse(localStorage.getItem("debtData")) || {
  owe: [],
  take: [],
  settled: []
};

function saveData() {
  localStorage.setItem("debtData", JSON.stringify(data));
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function openModal(type) {
  activeType = type;

  if (type === "owe") {
    modalTitle.textContent = "Add - I Owe";
  } else {
    modalTitle.textContent = "Add - They Owe Me";
  }

  entryName.value = "";
  entryAmount.value = "";
  entryNote.value = "";
  entryDate.value = new Date().toISOString().split("T")[0];

  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

function addEntry() {
  let name = entryName.value.trim();
  let amount = Number(entryAmount.value);
  let note = entryNote.value.trim();
  let date = entryDate.value;

  if (name === "" || amount <= 0 || date === "") {
    alert("Fill name, amount and date properly");
    return;
  }

  let entry = {
    id: Date.now(),
    name: name,
    amount: amount,
    note: note,
    date: date,
    type: activeType
  };

  if (activeType === "owe") {
    data.owe.push(entry);
  } else {
    data.take.push(entry);
  }

  saveData();
  render();
  closeModal();
}

function setUser() {
  let name = localStorage.getItem("userName") || "User";
  let email = localStorage.getItem("userEmail") || "No email added";

  userName.textContent = name;
  userEmail.textContent = email;
  userIcon.textContent = name.charAt(0).toUpperCase();
}
function render() {
  showList("owe");
  showList("take");
  showSettled();
  updateTotals();
}

function showList(type) {
  let list;
  let box;
  let empty;

  if (type === "owe") {
    list = data.owe;
    box = oweList;
    empty = oweEmpty;
  } else {
    list = data.take;
    box = takeList;
    empty = takeEmpty;
  }

  box.innerHTML = "";

  if (list.length === 0) {
    empty.style.display = "flex";
    return;
  }

  empty.style.display = "none";

  for (let i = 0; i < list.length; i++) {
    let item = list[i];

    let avatarClass = type === "owe" ? "owe-avatar" : "take-avatar";
    let amountClass = type === "owe" ? "owe-amt" : "take-amt";
    let cardClass = type === "owe" ? "owe-card" : "take-card";

    box.innerHTML += `
      <div class="entry-card ${cardClass}">
        <div class="entry-avatar ${avatarClass}">
          ${item.name.charAt(0).toUpperCase()}
        </div>

        <div class="entry-info">
          <h4>${item.name}</h4>
          <p>${item.note || "No note"}</p>
          <span class="entry-date">${item.date}</span>
        </div>

        <div class="entry-right">
          <span class="entry-amt ${amountClass}">${money(item.amount)}</span>

          <div class="entry-actions">
            <button class="act-btn settle-btn" onclick="settleEntry(${item.id}, '${type}')">Settle</button>
            <button class="act-btn del-btn" onclick="deleteEntry(${item.id}, '${type}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
}

function settleEntry(id, type) {
  let list = type === "owe" ? data.owe : data.take;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].settledAt = new Date().toLocaleDateString("en-IN");
      data.settled.unshift(list[i]);
      list.splice(i, 1);
      break;
    }
  }

  saveData();
  render();
}

function deleteEntry(id, type) {
  let list = type === "owe" ? data.owe : data.take;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list.splice(i, 1);
      break;
    }
  }

  saveData();
  render();
}

function showSettled() {
  settledList.innerHTML = "";

  if (data.settled.length === 0) {
    noSettled.style.display = "block";
    settledList.appendChild(noSettled);
    return;
  }

  noSettled.style.display = "none";

  for (let i = 0; i < data.settled.length; i++) {
    let item = data.settled[i];
    let typeText = item.type === "owe" ? "I Owed" : "They Owed";

    settledList.innerHTML += `
      <div class="settled-entry">
        <div>
          <p class="settled-name">${item.name}</p>
          <p class="settled-meta">${item.note || "No note"} • ${item.settledAt}</p>
        </div>

        <div>
          <span class="settled-amt">${money(item.amount)}</span>
          <span class="settled-type">${typeText}</span>
        </div>
      </div>
    `;
  }
}

function updateTotals() {
  let iOwe = 0;
  let owedMe = 0;

  for (let i = 0; i < data.owe.length; i++) {
    iOwe = iOwe + data.owe[i].amount;
  }

  for (let i = 0; i < data.take.length; i++) {
    owedMe = owedMe + data.take[i].amount;
  }

  let net = owedMe - iOwe;

  totalIOwe.textContent = money(iOwe);
  totalOwedMe.textContent = money(owedMe);

  if (net >= 0) {
    netBalance.textContent = "+" + money(net);
    netBalance.style.color = "#14e58f";
  } else {
    netBalance.textContent = "-" + money(Math.abs(net));
    netBalance.style.color = "#ff5a5a";
  }
}

function clearSettledList() {
  data.settled = [];
  saveData();
  render();
}

const addButtons = document.querySelectorAll(".add-entry-btn");

for (let i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener("click", function () {
    openModal(addButtons[i].getAttribute("data-type"));
  });
}

modalClose.addEventListener("click", closeModal);
saveEntryBtn.addEventListener("click", addEntry);
clearSettled.addEventListener("click", clearSettledList);

setUser();
render();