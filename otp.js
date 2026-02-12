import { auth, rtdb } from "./firebase.js";
import { ref, set, get, update, onValue, off } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const otpButtons = document.querySelectorAll(".otp-btn");
const otpText = document.getElementById("otp");
const timerText = document.getElementById("timerText");
const activeSlotLabel = document.getElementById("activeSlot");

let timer;
let timeLeft = 60;
let currentSlotRef = null; // To keep track of the active listener

// Helper functions
const today = () => new Date().toISOString().split("T")[0];
const currentMonth = () => new Date().getMonth() + 1;

otpButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const slot = btn.getAttribute("data-slot");
    generateOTP(slot);
  });
});

async function generateOTP(slotID) {
  if (!auth.currentUser) {
    alert("Login first");
    return;
  }

  const uid = auth.currentUser.uid;
  const userRef = ref(rtdb, "users/" + uid);

  let snap = await get(userRef);
  let data = snap.val() || { lastUsedDate: "", monthlyCount: 0, month: currentMonth() };

  if (data.month !== currentMonth()) { data.month = currentMonth(); data.monthlyCount = 0; }
  if (data.monthlyCount >= 5) { alert("❌ Monthly limit reached"); return; }
  if (data.lastUsedDate === today()) { alert("❌ Daily limit reached"); return; }
  const allowed = ['1', '3', '4', '6', '7', '9', 'A', 'B', 'C', 'D'];
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += allowed[Math.floor(Math.random() * allowed.length)];
  }

  await update(userRef, {
    lastUsedDate: today(),
    monthlyCount: data.monthlyCount + 1,
    month: currentMonth()
  });

  const slotPath = `otp/slot${slotID}`;
  await set(ref(rtdb, slotPath), {
    otp: otp,
    uid: uid,
    used: false,
    timestamp: Date.now()
  });

  // UI Updates
  activeSlotLabel.innerText = slotID;
  otpText.innerText = otp;
  disableButtons(true);
  startTimer();

  // --- NEW: LISTEN FOR VOID STATUS ---
  listenForVending(slotID);
}

function listenForVending(slotID) {
  // If there's an old listener, turn it off
  if (currentSlotRef) off(currentSlotRef);

  currentSlotRef = ref(rtdb, `otp/slot${slotID}/otp`);

  onValue(currentSlotRef, (snapshot) => {
    const val = snapshot.val();
    
    // If ESP32 changed the value to "VOID" or empty
    if (val === "VOID" || val === "") {
      stopOperation("✅ Dispensed Successfully!");
    }
  });
}

function stopOperation(message) {
  clearInterval(timer);
  timerText.innerText = message;
  otpText.innerText = "----";
  disableButtons(false);
  
  // Clean up listener
  if (currentSlotRef) {
    off(currentSlotRef);
    currentSlotRef = null;
  }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timer = setInterval(() => {
    timerText.innerText = `OTP expires in ${timeLeft}s`;
    timeLeft--;
    if (timeLeft < 0) {
      stopOperation("OTP expired");
    }
  }, 1000);
}

function disableButtons(state) {
  otpButtons.forEach(btn => btn.disabled = state);
}