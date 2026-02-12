

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set, get, update, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// 🔴 PASTE YOUR REAL CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyD-YgASdaF2bPxVF68Rzl95znYjDrz_oLM",
  authDomain: "sanitarypadvending.firebaseapp.com",
  databaseURL: "https://sanitarypadvending-default-rtdb.firebaseio.com",
  projectId: "sanitarypadvending",
  storageBucket: "sanitarypadvending.firebasestorage.app",
  messagingSenderId: "615976262646",
  appId: "1:615976262646:web:fc8127cb42e0534fc905d7",
  measurementId: "G-GSVH4DY9YW"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ REGISTER
window.register = function () {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((cred) => {
      set(ref(db, "users/" + cred.user.uid), {
        lastUsedDate: "",
        monthlyCount: 0,
        month: new Date().getMonth() + 1
      });
      alert("Registered Successfully");
    })
    .catch(err => alert(err.message));
};

// ✅ LOGIN
window.login = function () {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location = "dashboard.html";
    })
    .catch(err => alert(err.message));
};

// 🔁 DATE
function today() {
  return new Date().toISOString().split("T")[0];
}

// ✅ PAD LOGIC
window.selectPad = async function (size) {
  const uid = auth.currentUser.uid;
  const userRef = ref(db, "users/" + uid);
  const snap = await get(userRef);
  let data = snap.val();
  let currentMonth = new Date().getMonth() + 1;

  if (data.month !== currentMonth) {
    data.monthlyCount = 0;
    data.month = currentMonth;
  }

  if (data.lastUsedDate === today()) {
    alert("Already taken today ❌");
    return;
  }

  if (data.monthlyCount >= 5) {
    alert("Monthly limit reached ❌");
    return;
  }

  await update(userRef, {
    lastUsedDate: today(),
    monthlyCount: data.monthlyCount + 1,
    month: currentMonth
  });

  push(ref(db, "pads"), {
    uid: uid,
    size: size,
    date: today()
  });

  alert("Pad Allowed ✅");
};
function login() {
  const roll = document.getElementById("roll").value;
  const pass = document.getElementById("pass").value;
  // DEMO login check
  if (roll === "21EC123" && pass === "1234") {
    localStorage.setItem("user", roll);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "❌ Invalid Login";
  }
}
// OTP Generator
function generateOTP() {
  const otp = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("otp").innerText = otp;
  // Here you will send OTP to Firebase later
}

