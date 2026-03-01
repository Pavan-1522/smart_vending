




import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { doc, getDoc, setDoc } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let otp = "";
let verified = false;
let timer;
let timeLeft = 45;

/* SEND OTP */
window.sendOTP = async () => {

  if (!email.value) return msg.innerText = "Enter email first";

  otp = Math.floor(100000 + Math.random() * 900000).toString();

  await emailjs.send("service_lcq83am", "template_f4ztyn6", {
    to_email: email.value,
    otp
  });

  otpBox.style.display = "block";
  sendOtpBtn.innerText = "OTP Sent";

  startTimer();
};

/* TIMER */
function startTimer() {

  clearInterval(timer);
  timeLeft = 45;

  timer = setInterval(() => {

    timerText.innerText = `OTP expires in ${timeLeft}s`;
    timeLeft--;

    if (timeLeft < 0) {

      clearInterval(timer);
      otp = "";

      timerText.innerText = "OTP expired";
      sendOtpBtn.innerText = "Resend OTP";
    }

  }, 1000);
}

/* VERIFY OTP */
window.verifyOTP = () => {

  if (otpInput.value === otp) {

    clearInterval(timer);
    verified = true;

    password.disabled = false;
    registerBtn.disabled = false;
    sendOtpBtn.style.display = "none";

    msg.innerText = "OTP verified ✅";

  } else alert("Wrong OTP");
};

/* REGISTER */
window.register = async () => {

  if (!verified) return msg.innerText = "Verify OTP first";

  // username check
  const uSnap = await getDoc(doc(db, "users", username.value));
  if (uSnap.exists()) return msg.innerText = "Username exists";

  // email check
  const eSnap = await getDoc(doc(db, "emails", email.value));
  if (eSnap.exists()) return msg.innerText = "Email exists";

  try {

    await createUserWithEmailAndPassword(auth, email.value, password.value);

    await setDoc(doc(db, "users", username.value), {
      email: email.value
    });

    await setDoc(doc(db, "emails", email.value), {
      username: username.value
    });

    alert("Registered Successfully");
    location = "index.html";

  } catch (e) {
    msg.innerText = e.code;
  }
};
