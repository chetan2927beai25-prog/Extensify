const savedName = localStorage.getItem("userName");
const savedContact = localStorage.getItem("userContact");

const userName = document.getElementById("userName");
const userIcon = document.getElementById("userIcon");

if (userName) {
  if (savedName && savedName.trim() !== "") {
    userName.textContent = savedName;
  } else if (savedContact && savedContact.trim() !== "") {
    userName.textContent = savedContact;
  } else {
    userName.textContent = "User";
  }
}

if (userIcon && userName) {
  const firstLetter = userName.textContent.trim().charAt(0).toUpperCase();
  userIcon.textContent = firstLetter || "U";
}

const addSavingBtn = document.getElementById("addSavingBtn");
const saveAmount = document.getElementById("saveAmount");
const saveNote = document.getElementById("saveNote");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");

if (addSavingBtn) {
  addSavingBtn.addEventListener("click", () => {
    const amount = saveAmount.value.trim();
    const note = saveNote.value.trim();

    if (amount === "" || Number(amount) <= 0) {
      alert("Please enter a valid saving amount.");
      return;
    }

    const item = document.createElement("div");
    item.className = "item";

    const today = new Date();
    const dateText = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    item.innerHTML = `
      <div>
        <p class="item-title">${note === "" ? "New Saving Added" : note}</p>
        <p class="item-date">${dateText}</p>
      </div>
      <span class="plus">+ ₹${amount}</span>
    `;

    historyList.prepend(item);
    saveAmount.value = "";
    saveNote.value = "";
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
  });
}