# FocusFlow — Personal Energy & Productivity Lab ⚡🧠

A modern, visually impressive, responsive web development project built for a college presentation. FocusFlow is a personal productivity dashboard designed with a dark, futuristic SaaS aesthetic that balances daily tasks with personal energy levels.

![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Animations-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-yellow?style=for-the-badge&logo=javascript)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3.2-purple?style=for-the-badge&logo=bootstrap)

---

## 📸 Overview & Key Features

### 1. Sidebar Navigation
- Sleek fixed desktop sidebar (and responsive offcanvas drawer for mobile) with links to:
  - **Dashboard**
  - **My Tasks**
  - **Focus Timer**
  - **Activity**
- Smooth scrolling and active state indicators.

### 2. Today's Overview
Three compact statistic cards with dynamic progress bars:
- **Tasks Completed**: Dynamically calculates ratio (e.g., `2 / 4`) and percentage.
- **Focus Time**: Displays logged daily deep work (e.g., `50 mins`).
- **Current Streak**: Displays ongoing streak (e.g., `5 Days`).

### 3. Daily Energy Check-in
- Four interactive emoji options:
  - 😴 **Low** (Drained / Fatigued)
  - 😐 **Okay** (Steady / Neutral)
  - ⚡ **Good** (Focused / Energetic)
  - 🔥 **Excellent** (Peak Hyperflow)
- Visibly highlights selected energy with glow effects and provides customized encouraging advice.
- Persisted across page refreshes via `localStorage`.

### 4. My Tasks
- Priority tags: **High**, **Medium**, and **Low**.
- Interactive checkboxes with instant strike-through animations and dynamic stat updates.
- Simple, intuitive form to add new tasks.
- Delete button for each task.
- Clean **empty state** when all tasks are cleared.
- Toast alert feedback upon adding or completing tasks.
- Fully persisted via `localStorage`.

### 5. Focus Timer (Circular SVG Ring)
- Aesthetic circular/ring countdown timer set to standard **25:00** Pomodoro.
- Animated SVG progress ring that depletes smoothly as the timer runs.
- Controls: **Start**, **Pause**, and **Reset**.
- Browser tab title synchronization (e.g., `(24:45) FocusFlow`).
- Completion alert notification.

### 6. Weekly Productivity Chart
- Lightweight, zero-dependency **CSS bar chart** representing focus minutes across Mon–Sun.
- Interactive hover tooltips showing exact minutes for each day.
- Highlighted peak day (Wednesday).

---

## 🎨 Visual Design Specifications

- **Background Color**: Dark Navy (`#0B1020`)
- **Panel / Card Color**: Lighter Navy (`#141B2D`, `#1E2742`)
- **Accents**: Electric Purple (`#8B5CF6`, `#7C3AED`) and Soft Blue (`#38BDF8`, `#00D2FF`)
- **Typography**: 
  - `Plus Jakarta Sans` for clean, modern headings and UI prose.
  - `JetBrains Mono` for digits, timer, and badges.
- **Components**: Glassmorphism cards with subtle borders (`rgba(255, 255, 255, 0.08)`), soft glows, and smooth hover lifts.
- **Responsiveness**: Fully responsive across desktop, tablet, and mobile via Bootstrap 5 grid and custom CSS media queries.

---

## 📂 Project Structure

```
focusflow/
│── index.html       # Semantic single-page HTML5 structure & Bootstrap layout
│── style.css        # Custom CSS styling, dark palette, animations & bar chart
│── script.js        # Vanilla JS: state, tasks CRUD, timer & LocalStorage
│── README.md        # Project documentation & presentation guide
└── .gitignore       # Standard git ignore file
```

> **Zero Node Modules & Zero Build Steps**: No React, Next.js, Tailwind, npm packages, external databases, or backend servers are required. Double-click `index.html` to run in any browser.

---

## 🚀 How to Run the Project

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/focusflow.git
   cd focusflow
   ```
2. Double-click `index.html` in File Explorer, or open it with your favorite browser (Chrome, Edge, Firefox, Safari).
3. *(Optional)* Run with any local server:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then open `http://localhost:8000`.

---

## 📤 How to Push to GitHub

To push this project to a new repository on GitHub:

1. Open a terminal in the project directory:
   ```bash
   cd C:\Users\aarth\.gemini\antigravity\scratch\focusflow
   ```
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FocusFlow Personal Energy & Productivity Lab"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `focusflow`.
4. Link and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/focusflow.git
   git push -u origin main
   ```

---

## 🎓 College Presentation Talking Points (2-3 Minutes)

1. **Problem Statement**:
   > *"Most productivity systems treat all working hours equally. FocusFlow introduces energy-awareness by pairing task prioritization with a daily biological energy check-in."*
2. **Technical Architecture**:
   > *"Built strictly adhering to core web fundamentals: Semantic HTML5, CSS3 transitions, and modular ES6+ JavaScript with Bootstrap 5. All data persists client-side via LocalStorage without requiring a heavy backend."*
3. **Key Highlights to Demo**:
   > - *Select an energy level (Low to Excellent) to see the encouraging recommendation update.*
   > - *Add a new task with a priority tag and check it off to watch the completion counter update in real-time.*
   > - *Click 'Start' on the SVG circular timer to demonstrate the mathematical countdown ring animation.*
   > - *Hover over the weekly CSS bar chart to show the zero-dependency visualization.*
