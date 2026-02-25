// Mock posts array (in-memory only)
let posts = [
  { user: "Sarah K", avatar: "🏃‍♀️", time: "12m", text: "5k PR in 21:47 🔥", kudos: 42 },
  { user: "Mike O", avatar: "🏋️", time: "2h", text: "Deadlift 140kg x 5 today", kudos: 19 }
];

function renderFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = posts.map(p => `
    <div class="bg-zinc-900 rounded-3xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-2xl">${p.avatar}</div>
        <div>
          <div class="font-semibold">${p.user}</div>
          <div class="text-xs text-zinc-500">${p.time}</div>
        </div>
      </div>
      <p class="text-lg mb-4">${p.text}</p>
      <button class="flex items-center gap-1 text-zinc-400 hover:text-emerald-400">
        <i class="fa-solid fa-heart"></i> ${p.kudos}
      </button>
    </div>
  `).join('');
}

function createPost() {
  const text = document.getElementById('post-text').value.trim();
  if (!text) return;
  posts.unshift({
    user: "You",
    avatar: "👤",
    time: "now",
    text,
    kudos: 0
  });
  document.getElementById('post-text').value = '';
  renderFeed();
}

function logWorkout() {
  // Similar mock logic...
  alert("Workout logged (demo mode - no backend)");
  switchTab(0);
}

function switchTab(n) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${n}`).classList.remove('hidden');
}

// Init
renderFeed();
switchTab(0);
