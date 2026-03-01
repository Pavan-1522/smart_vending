import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { getDatabase } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
 apiKey: "AIzaSyD-YgASdaF2bPxVF68Rzl95znYjDrz_oLM",
 authDomain: "sanitarypadvending.firebaseapp.com",
 databaseURL: "https://sanitarypadvending-default-rtdb.firebaseio.com",
 projectId: "sanitarypadvending",
 storageBucket: "sanitarypadvending.firebasestorage.app",
 messagingSenderId: "615976262646",
 appId: "1:615976262646:web:fc8127cb42e0534fc905d7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);   // ⭐ THIS WAS MISSING

