import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc,
  increment 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdRs0u8eER-pelhQfEZU19EebU-tECFqc",
  authDomain: "zenith-3100.firebaseapp.com",
  projectId: "zenith-3100",
  storageBucket: "zenith-3100.firebasestorage.app",
  messagingSenderId: "738142475747",
  appId: "1:738142475747:web:6def439f5bc8e4812f7cd6",
  measurementId: "G-PPZDK2W0G8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const currentUser = {
  displayName: "Abiud K",
  photoURL: "https://via.placeholder.com/128/10b981/ffffff?text=AK"
};

async function loadPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '<div class="text-center text-zinc-500 py-8">Loading live feed...</div>';

  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    feed.innerHTML = '';

    snapshot.forEach((d) => {
      const p = d.data();
      const html = `
        <div class="bg-zinc-900 rounded-3xl p-5 post">
          <div class="flex items-center gap-3 mb-3">
            <img src="${p.photoURL}" class="w-10 h-10 rounded-2xl">
            <div>
              <div class="font-semibold">${p.displayName}</div>
              <div class="text-xs text-zinc-500">${p.timestamp ? new Date(p.timestamp.toDate()).toLocaleString() : 'recent'}</div>
            </div>
          </div>
          <p class="text-lg mb-4">${p.text}</p>
          <button onclick="giveKudos('${d.id}')" class="flex items-center gap-2 hover:text-emerald-400">
            <i class="fa-solid fa-heart"></i> ${p.kudos || 0}
          </button>
        </div>`;
      feed.innerHTML += html;
    });
  } catch (e) {
    console.error(e);
    feed.innerHTML = '<div class="text-red-400">Error loading feed</div>';
  }
}

window.createPost = async () => {
  const text = document.getElementById('post-text').value.trim();
  if (!text) return alert("Write something!");
  
  await addDoc(collection(db, 'posts'), {
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    text: text,
    timestamp: serverTimestamp(),
    kudos: 0
  });
  
  document.getElementById('post-text').value = '';
  loadPosts();
};

window.giveKudos = async (id) => {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, { kudos: increment(1) });
  loadPosts();
};

window.logWorkout = async () => {
  const type = document.getElementById('workout-type').value || "Workout";
  const dist = document.getElementById('distance').value;
  const dur = document.getElementById('duration').value;
  let msg = type;
  if (dist) msg += ` • ${dist}km`;
  if (dur) msg += ` • ${dur}min`;

  await addDoc(collection(db, 'posts'), {
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    text: msg + " logged ✅",
    timestamp: serverTimestamp(),
    kudos: 0
  });

  alert("✅ Workout logged & posted live to everyone!");
  loadPosts();
  switchTab(0);
};

window.switchTab = (n) => {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${n}`).classList.add('active');
};

// Leaderboard (mock – easy to make real later)
function renderLeaderboard() {
  document.getElementById('leaderboard').innerHTML = `
    <div class="flex items-center justify-between bg-zinc-800 px-5 py-4 rounded-2xl">
      <div class="flex items-center gap-3"><span class="text-2xl">🥇</span><span>Abiud K</span></div>
      <span class="font-mono text-emerald-400">1,450 pts</span>
    </div>
    <div class="flex items-center justify-between bg-zinc-800 px-5 py-4 rounded-2xl">
      <div class="flex items-center gap-3"><span class="text-2xl">🥈</span><span>Sarah K</span></div>
      <span class="font-mono text-emerald-400">1,320 pts</span>
    </div>
  `;
}

// Init
loadPosts();
renderLeaderboard();
switchTab(0);
