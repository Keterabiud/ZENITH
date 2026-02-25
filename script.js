// Firebase Modular SDK imports via CDN (v12.x – latest stable as of 2026)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Your real Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdRs0u8eER-pelhQfEZU19EebU-tECFqc",
  authDomain: "zenith-3100.firebaseapp.com",
  projectId: "zenith-3100",
  storageBucket: "zenith-3100.firebasestorage.app",
  messagingSenderId: "738142475747",
  appId: "1:738142475747:web:6def439f5bc8e4812f7cd6",
  measurementId: "G-PPZDK2W0G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

// Auth state change listener
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const loginScreen = document.getElementById("login-screen");
  const mainApp = document.getElementById("main-app");
  const loginBtn = document.getElementById("login-btn");
  const userInfo = document.getElementById("user-info");

  if (user) {
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");

    document.getElementById("user-name").textContent = user.displayName.split(" ")[0];
    document.getElementById("user-photo").src = user.photoURL || "https://via.placeholder.com/64?text=You";
    document.getElementById("profile-name").textContent = user.displayName;

    loadPosts();           // Load feed
    switchTab(0);          // Default to feed
  } else {
    loginScreen.classList.remove("hidden");
    mainApp.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }
});

// Google Sign In
window.signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Google sign-in failed. Please try again.");
  }
};

// Sign Out
window.signOutUser = () => {
  signOut(auth).catch((error) => {
    console.error("Sign-out error:", error);
  });
};

// Load posts from Firestore
async function loadPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = '<p class="text-center text-zinc-500 py-10">Loading activities...</p>';

  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    feed.innerHTML = "";

    if (querySnapshot.empty) {
      feed.innerHTML = '<p class="text-center text-zinc-500 py-10">No posts yet. Be the first! 🚀</p>';
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const postEl = document.createElement("div");
      postEl.className = "bg-zinc-900 rounded-3xl p-5 post";
      postEl.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <img src="${data.photoURL || 'https://via.placeholder.com/40'}" alt="" class="w-10 h-10 rounded-full object-cover">
          <div>
            <div class="font-semibold">${data.displayName}</div>
            <div class="text-xs text-zinc-500">
              ${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString([], {hour: '2-digit', minute:'2-digit', day:'numeric', month:'short'}) : 'recent'}
            </div>
          </div>
        </div>
        <p class="text-lg mb-4 leading-relaxed">${data.text}</p>
        <div class="flex items-center gap-6 text-sm text-zinc-400">
          <button class="flex items-center gap-1.5 hover:text-emerald-400 transition">
            <i class="fa-solid fa-heart"></i> ${data.kudos || 0}
          </button>
          <button class="flex items-center gap-1.5 hover:text-emerald-400 transition">
            <i class="fa-solid fa-comment"></i> 0
          </button>
        </div>
      `;
      feed.appendChild(postEl);
    });
  } catch (err) {
    console.error("Feed load error:", err);
    feed.innerHTML = '<p class="text-red-400 text-center py-10">Error loading feed</p>';
  }
}

// Create new post
window.createPost = async () => {
  const textArea = document.getElementById("post-text");
  const text = textArea.value.trim();
  if (!text || !currentUser) return;

  try {
    await addDoc(collection(db, "posts"), {
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      text,
      timestamp: serverTimestamp(),
      kudos: 0,
      createdAt: new Date()
    });
    textArea.value = "";
    loadPosts();
  } catch (err) {
    console.error("Post error:", err);
    alert("Failed to post. Check console.");
  }
};

// Log workout and auto-post
window.logWorkout = async () => {
  const type = document.getElementById("workout-type").value.trim() || "Workout";
  const dist = document.getElementById("distance").value.trim();
  const dur = document.getElementById("duration").value.trim();

  let message = type;
  if (dist) message += ` • ${dist} km`;
  if (dur) message += ` • ${dur} min`;

  if (currentUser) {
    try {
      await addDoc(collection(db, "posts"), {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        text: `${message} logged ✅`,
        timestamp: serverTimestamp(),
        kudos: 0
      });
      alert("Workout logged and shared!");
      document.getElementById("workout-type").value = "";
      document.getElementById("distance").value = "";
      document.getElementById("duration").value = "";
      loadPosts();
      switchTab(0);
    } catch (err) {
      alert("Failed to log workout.");
    }
  }
};

// Tab switching
window.switchTab = (index) => {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));
  document.getElementById(`tab-${index}`).classList.remove("hidden");

  document.querySelectorAll(".tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
};

// Start with feed tab on load (after auth check)
