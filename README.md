# StellarSync 🌠 - Memory Game Challenge

![React](https://img.shields.io/badge/React-19-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow.svg) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-teal.svg) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)

**StellarSync** is a celestial-themed responsive memory card game created for an interactive coding challenge. The goal is simple: find 4 matching pairs (Star, Moon, Sun, Comet) before the 30-second timer runs out.

🌍 **Live Demo:** [https://stellarsync.joanreva.com/](https://stellarsync.joanreva.com/)  
🐙 **Repository:** [https://github.com/JoanReva/StellarSync](https://github.com/JoanReva/StellarSync)

---

## 🚀 Features & Requirements

The game flow strictly follows the core challenge requirements while maintaining a polished and responsive layout.

- **Start Screen:** Welcomes the player with a logo sliding in from the top and a "Start" button sliding up from the bottom. Hovering over the button triggers a playful bounce effect.
- **Game Screen:**
  - **Memory Board:** Built with a grid approach, it features 8 cards (4 matching pairs) organized randomly on every new game. The card backs have a blue background with a central yellow question mark.
  - **Interactions:** Clicking a card triggers a smooth 3D flip animation and temporarily blocks other clicks to prevent glitched states.
  - **Match Logic:** Correct pairs trigger a "Nice! It's a match" modal alongside a success chime. Incorrect pairs show "Sorry, but this is not a match" with an error chime, before flipping back down.
  - **Timer & Audio:** The top-right corner offers global mute controls. The board runs on a 30-second timer. When the clock hits 10 seconds, it visually pulses and plays a ticking warning sound.
- **Resolve Screen:** Depending on the outcome, the player is met with a "You did it!" success message or an "Oops, you didn't find them all" failure message. The bouncing "Play again" button loops the user right back into the action.

---

## ✨ Bonus Enhancements

The challenge mentioned we could go beyond the baseline, so I added several extra features to elevate the project to a more complete, production-ready application:

- **Global Scoreboard (Supabase):** Instead of just winning, players can submit their name and remaining time to a live cloud database. The top results are fetched and displayed in a global leaderboard modal, adding replay value.
- **Internationalization (i18n):** The entire application supports fully dynamic switching between English and Spanish, handled via a global store.
- **Accessibility & "Color-Safe" Modes:** There is a dedicated settings menu offering visual cues, togglable symbols underneath the cards, and a specific high-contrast color palette to help color-blind players enjoy the game comfortably.
- **Progress Saving (Prevent Unload):** Ever accidentally refreshed a game mid-match? A custom hook guards against accidental page reloads or backward navigation while the timer is running.
- **Automated Testing:** Important logic utilities (like the shuffling algorithm and scoreboard API mockups) are covered by Vitest suites.
- **Confetti on Win:** A satisfying burst of confetti triggers behind the scenes when a player completes the board.

---

## 🛠 Tech Stack & Technical Decisions

- **React 19 + TypeScript (via Vite):** I chose Vite purely for practicality and rapid development. Its out-of-the-box support for TypeScript and lightning-fast Hot Module Replacement (HMR) makes iterating on UI components effortless.
- **Tailwind CSS:** Selected for the exact same reasons as Vite. Tailwind allows for incredibly fast styling and iteration. Getting the grid responsive (`grid-cols-2` scaling to `grid-cols-4` on larger screens) took seconds without needing to maintain large separate stylesheet files or complex media queries.
- **Zustand:** I opted for Zustand over traditional React Context. It provides simple, hook-based global state management without the boilerplate or the unnecessary re-renders associated with large Context providers. The state is cleanly split into three distinct stores (Game, i18n, Settings).
- **Framer Motion:** Used to satisfy the challenge's animation requirements (bouncing effects, slides, complex layout transitions, and card flipping) using an intuitive declarative syntax API.
- **Howler.js:** Used to manage all sound effects seamlessly across browsers.
- **Supabase:** Serves as a fast, lightweight backend for the scoreboard. With just a simple SQL table and their SDK, data fetching and score submission were easily wired up.

---

## 📂 Project Hierarchy

I kept the folder structure highly modular to ensure scalability:

```text
├── public/                 # Static assets (logo, font imports)
├── scripts/                # Utility node scripts (e.g., scoreboard connection checker)
├── src/
│   ├── assets/             # Raw media (audio files, SVG card icons)
│   ├── components/
│   │   ├── Common/         # Reusable UI elements (Buttons, generic Modals, Layout wrappers)
│   │   ├── Game/           # Core match logic tools (Board, Cards, Timer, Feedback UI)
│   │   ├── Screens/        # The three main states of the app (Start, Game, Resolve)
│   │   └── Settings/       # Controls for Language, Audio, and Accessibility
│   ├── hooks/              # Custom reusable logic (useAudio, usePreventPageUnload)
│   ├── services/           # External API controllers (Supabase scoreboard logic)
│   ├── store/              # Zustand state managers (Game flow, i18n, User preferences)
│   ├── utils/              # Helper functions (Fisher-Yates shuffle algorithm, constants)
│   ├── App.tsx             # Main router handling screen transitions
│   └── main.tsx            # React application entry point
├── supabase/
│   └── leaderboard.sql     # Database schema to recreate the scoreboard table
├── test/                   # Vitest unit and component testing suites
├── eslint.config.js        # Strict linting rules
├── tailwind.config.cjs     # Custom color tokens and theme setup
└── vite.config.ts          # Vite build pipeline setup
```

---

## 📦 Local Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JoanReva/StellarSync.git
   cd StellarSync
   ```

2. **Install dependencies:**
   This project relies on `pnpm` as its package manager.

   ```bash
   pnpm install
   ```

3. **Environment Configuration (Supabase Scoreboard):**
   If you want to run the global scoreboard locally:
   - Create a free project on [Supabase](https://supabase.com/).
   - Execute the SQL snippet found in `supabase/leaderboard.sql` within your Supabase project's SQL editor.
   - Create a `.env.local` file at the root of the project with your credentials:
     ```env
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
     ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

   Open `http://localhost:5173`. Make sure your system audio is enabled!

5. **Run the testing suite:**
   ```bash
   pnpm test
   ```

_(Built by [JoanReva](https://github.com/JoanReva))_
