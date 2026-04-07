# 🌙 نور الحروف — Nour Al-Huroof

> Arabic letters PWA for kids aged 4–6 | Islamic Educational Center Oldenburg

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

Test on your phone by opening the local IP shown in the terminal
(e.g. `http://192.168.1.x:5173`) in your phone's browser.

---

## 📁 Project Structure

```
src/
  data/
    letters.json      ← All 28 letters content (edit this for all content changes)
    messages.json     ← Encouraging messages in Arabic + German
  pages/
    Splash.tsx        ← Onboarding (name + avatar)
    Home.tsx          ← Letter map grid
    Letter.tsx        ← Letter display + audio
    Vocabulary.tsx    ← 3 word cards per letter
    Tracing.tsx       ← Finger tracing canvas
    Game.tsx          ← 3 mini-games
    Rewards.tsx       ← Stars, badges, progress
  components/
    AudioButton.tsx       ← Reusable audio play button
    TracingCanvas.tsx     ← HTML5 canvas drawing
    IslamicBackground.tsx ← Decorative elements, crescent, stars
  hooks/
    useProgress.ts    ← localStorage read/write
    useAudio.ts       ← Howler.js + TTS fallback
    useLetters.ts     ← Letter data access
```

---

## 🎵 Audio Setup

### Phase 1 (Default): Web TTS
No setup needed. The app uses the browser's built-in Arabic TTS.

### Phase 2: Add your own MP3 files
Place files in `public/audio/`:
```
public/audio/
  letters/
    alif.mp3          ← Letter name audio
    alif_pronunciation.mp3
    baa.mp3
    ...
  vocabulary/
    asad.mp3          ← Word audio
    arnab.mp3
    ...
  sfx/
    correct.mp3       ← Sound effects (optional)
    wrong.mp3
    stars.mp3
    complete.mp3
```

The app automatically uses MP3 if it exists, falls back to TTS if not.
You can replace files one letter at a time as you record them.

---

## 📝 Adding Content

### Add more letters
Edit `src/data/letters.json`. Follow the exact same structure as the 5 existing letters.
Use the Claude prompt in the architecture plan to generate all 28.

### Change messages
Edit `src/data/messages.json` — all encouraging messages are there.

### Add vocabulary images
Replace emoji with real images by updating the VocabCard component.
Recommended size: 200×200px PNG with transparent background.

---

## 🚀 Deployment

### Option A: Netlify (Recommended, Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Done! Auto-deploys on every push.

### Option B: Your existing website
```bash
npm run build
# Upload the contents of /dist to a subfolder on your server
# e.g. yourwebsite.de/app/
```

### Option C: GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json scripts: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

---

## 📱 Installing as PWA

### Android (Chrome)
1. Open the URL in Chrome
2. Tap the three dots menu → "Add to Home screen"
3. Done — app icon appears on home screen

### iPhone (Safari)
1. Open the URL in Safari (must be Safari, not Chrome)
2. Tap the Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Done

### Parent instruction card
Print and hand out at class:
```
📱 So installierst du نور الحروف:

Android:
1. Öffne [deine-url.de] in Chrome
2. Tippe auf ⋮ → "Zum Startbildschirm hinzufügen"

iPhone:
1. Öffne [deine-url.de] in Safari
2. Tippe auf □↑ → "Zum Home-Bildschirm"
```

---

## 🔮 Phase 2: Convert to APK

When ready to offer an Android APK:
```bash
npm install @capacitor/core @capacitor/android
npx cap init "Nour Al-Huroof" "de.oldenburg.nouralhuroof"
npm run build
npx cap add android
npx cap sync
npx cap open android
# Build APK in Android Studio → upload to website
```

No code changes needed. Same React components, same data.

---

## ✅ MVP Checklist

- [ ] All 5 starter letters work end-to-end
- [ ] Audio plays on tap (TTS at minimum)
- [ ] Tracing works with finger on phone
- [ ] Stars persist after closing app
- [ ] Works offline after first load
- [ ] "Add to Home Screen" tested on Android + iPhone
- [ ] Native Arabic speaker reviewed content
- [ ] Tested with at least one 4–6 year old

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Styling |
| Howler.js | 2 | Audio playback |
| vite-plugin-pwa | 0.20 | PWA + offline |
| react-router-dom | 6 | Navigation |

**Monthly cost: $0**

---

*نور الحروف — Islamic Educational Center Oldenburg*
*Solo Developer Edition | PWA First | APK Later*
