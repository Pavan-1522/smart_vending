



import { auth, db } from "./firebase.js";

import {
 signInWithEmailAndPassword,
 sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { doc,getDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* LOGIN */
window.login = async ()=>{

 const username=document.getElementById("username").value;
 const password=document.getElementById("password").value;

 if(!username || !password){
  msg.innerText="Enter username & password";
  return;
 }

 const snap=await getDoc(doc(db,"users",username));

 if(!snap.exists()){
  msg.innerText="Username not found";
  return;
 }

 try{
  await signInWithEmailAndPassword(auth,snap.data().email,password);
  location="dashboard.html";
 }
 catch(e){
  msg.innerText="Wrong password";
 }
};

/* RESET PASSWORD */
window.resetPassword=async()=>{

 if(!forgotEmail.value){
  forgotMsg.innerText="Enter email";
  return;
 }

 try{
  await sendPasswordResetEmail(auth,forgotEmail.value);
  forgotMsg.innerText="Mail sent";
 }
 catch(e){
  forgotMsg.innerText="Email not found";
 }
};
