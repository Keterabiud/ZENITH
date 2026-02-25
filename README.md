# Zenith – Social Fitness MVP

Static web app with Firebase Auth (Google) + Firestore backend.

## Features
- Google login
- Post workouts / activities
- Shared global feed
- Log workout → auto post
- Basic profile + kudos
- Dark mode UI

## Deployment (Cloudflare Pages)
1. Create repo on GitHub
2. Push these 4 files
3. Go to Cloudflare Dashboard → Pages → Connect Git → Deploy
4. Done – live at https://your-project.pages.dev

## Security Reminder
- Firestore Rules: Set to `allow read, write: if request.auth != null;`
- Do NOT leave in test mode (`if true;`)

Next steps: Add real-time listener (onSnapshot), user-specific profiles, image uploads, challenges, etc.

Built for @abiudketerr – Nairobi 2026 🚀
