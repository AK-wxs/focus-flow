/**
 * ============================================================================
 * FocusFlow — Personal Energy & Productivity Lab
 * Main JavaScript Application Logic (Vanilla JS ES6+)
 * 
 * Clean, modular architecture designed for student presentations:
 * 1. State Management & LocalStorage Persistence
 * 2. Today's Overview Dynamic Counter
 * 3. Daily Energy Check-in Engine
 * 4. Task Manager (Add, Toggle, Delete, Empty State)
 * 5. 25-Minute Circular SVG Focus Timer
 * 6. Smooth Navigation & ScrollSpy
 * 7. Feedback Toast Notifications
 * ============================================================================
 */

(function () {
  'use strict';

  // --- 1. LOCAL STORAGE KEYS & DEFAULT DATA ---
  const STORAGE_KEYS = {
    TASKS: 'focusflow_tasks_list',
    ENERGY: 'focusflow_energy_level'
  };

  // Initial 4 sample tasks provided on first launch
  const DEFAULT_TASKS = [
    { id: 1, title: 'Complete Operating Systems Assignment', priority: 'High', completed: true },
    { id: 2, title: 'Review Web Development Presentation Slides', priority: 'Medium', completed: true },
    { id: 3, title: 'Read Research Paper on Circadian Rhythms', priority: 'Medium', completed: false },
    { id: 4, title: 'Organize Project GitHub Repository', priority: 'Low', completed: false }
  ];

  // Motivational messages tailored to each energy level
  const ENERGY_FEEDBACK = {
    low: {
      title: 'Restorative Pace Recommended',
      text: 'Energy is low right now. Be kind to yourself — tackle light tasks, drink water, or take a short break.',
      badge: 'Low Energy Selected'
    },
    okay: {
      title: 'Steady & Balanced State',
      text: 'Steady and calm. A balanced pace is perfect for routine work and consistent progress today.',
      badge: 'Okay Energy Selected'
    },
    good: {
      title: 'Solid Focus Zone',
      text: 'Great energy level! You are in an optimal state to tackle your high-priority objectives.',
      badge: 'Good Energy Selected'
    },
    excellent: {
      title: 'Peak Hyperfocus Engaged',
      text: 'Peak cognitive power! Dive straight into your most challenging, high-impact creative tasks.',
      badge: 'Peak Energy Selected'
    }
  };

  // --- 2. APPLICATION STATE ---
  let tasks = [];
  let selectedEnergy = 'good';

  // Timer Variables
  const TIMER_TOTAL_SECONDS = 25 * 60; // 25 minutes = 1500 seconds
  let timerRemainingSeconds = TIMER_TOTAL_SECONDS;
  let timerInterval = null;
  let isTimerRunning = false;

  // SVG Ring Constants (Radius = 100, Circumference = 2 * PI * 100 ≈ 628.318)
  const RING_CIRCUMFERENCE = 2 * Math.PI * 100;

  // --- 3. DOM ELEMENT REFERENCES ---
  const elements = {
    // Current Date Display
    currentDateDisplay: document.getElementById('currentDateDisplay'),

    // Overview Stats
    statCompletedDisplay: document.getElementById('statCompletedDisplay'),
    statCompletedPercent: document.getElementById('statCompletedPercent'),
    statProgressBar: document.getElementById('statProgressBar'),
    taskHeaderCountBadge: document.getElementById('taskHeaderCountBadge'),

    // Energy Check-in
    energyButtons: document.querySelectorAll('.energy-btn'),
    energyStateBadge: document.getElementById('energyStateBadge'),
    energyMessageTitle: document.getElementById('energyMessageTitle'),
    energyMessageText: document.getElementById('energyMessageText'),

    // Tasks Management
    addTaskForm: document.getElementById('addTaskForm'),
    newTaskInput: document.getElementById('newTaskInput'),
    newTaskPriority: document.getElementById('newTaskPriority'),
    taskListContainer: document.getElementById('taskListContainer'),
    taskEmptyState: document.getElementById('taskEmptyState'),

    // Focus Timer
    timerDisplay: document.getElementById('timerDisplay'),
    timerProgressRing: document.getElementById('timerProgressRing'),
    timerStatePill: document.getElementById('timerStatePill'),
    timerStatusLabel: document.getElementById('timerStatusLabel'),
    btnTimerStart: document.getElementById('btnTimerStart'),
    btnTimerPause: document.getElementById('btnTimerPause'),
    btnTimerReset: document.getElementById('btnTimerReset'),

    // Navigation Links
    navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),

    // Toast Notification
    feedbackToast: document.getElementById('feedbackToast'),
    toastMessage: document.getElementById('toastMessage'),
    toastIconBox: document.getElementById('toastIconBox')
  };

  // Bootstrap Toast instance
  let toastInstance = null;

  // ==========================================================================
  // 4. INITIALIZATION & LOCAL STORAGE
  // ==========================================================================

  /**
   * Loads persisted data from browser localStorage or assigns defaults
   */
  function loadStoredData() {
    // Load tasks
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (storedTasks) {
      try {
        tasks = JSON.parse(storedTasks);
      } catch (err) {
        console.warn('Error parsing stored tasks, resetting to defaults.', err);
        tasks = [...DEFAULT_TASKS];
      }
    } else {
      tasks = [...DEFAULT_TASKS];
    }

    // Load energy choice
    const storedEnergy = localStorage.getItem(STORAGE_KEYS.ENERGY);
    if (storedEnergy && ENERGY_FEEDBACK[storedEnergy]) {
      selectedEnergy = storedEnergy;
    } else {
      selectedEnergy = 'good';
    }
  }

  /**
   * Persists current tasks list to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.warn('Unable to save tasks to localStorage.', err);
    }
  }

  /**
   * Persists chosen energy level to localStorage
   */
  function saveEnergy(level) {
    try {
      localStorage.setItem(STORAGE_KEYS.ENERGY, level);
    } catch (err) {
      console.warn('Unable to save energy to localStorage.', err);
    }
  }

  // ==========================================================================
  // 5. TODAY'S OVERVIEW STATS MODULE
  // ==========================================================================

  /**
   * Recalculates and updates the 3 Overview Statistic Cards
   */
  function updateOverviewStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;

    // Update Tasks Completed Card
    if (elements.statCompletedDisplay) {
      elements.statCompletedDisplay.textContent = `${completed} / ${total}`;
    }

    // Calculate percentage
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    if (elements.statCompletedPercent) {
      elements.statCompletedPercent.textContent = `${percent}% completed`;
    }
    if (elements.statProgressBar) {
      elements.statProgressBar.style.width = `${percent}%`;
    }

    // Update header badge on task list
    if (elements.taskHeaderCountBadge) {
      elements.taskHeaderCountBadge.textContent = `${remaining} Remaining`;
    }
  }

  // ==========================================================================
  // 6. DAILY ENERGY CHECK-IN MODULE
  // ==========================================================================

  /**
   * Initializes interactive emoji buttons for energy selection
   */
  function initEnergyCheckin() {
    applyEnergySelection(selectedEnergy, false);

    elements.energyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const energyKey = button.getAttribute('data-energy');
        if (ENERGY_FEEDBACK[energyKey]) {
          selectedEnergy = energyKey;
          saveEnergy(energyKey);
          applyEnergySelection(energyKey, true);
        }
      });
    });
  }

  /**
   * Highlights the chosen energy button and displays encouraging advice
   * @param {string} energyKey - 'low' | 'okay' | 'good' | 'excellent'
   * @param {boolean} showToastFlag - Whether to trigger a feedback toast
   */
  function applyEnergySelection(energyKey, showToastFlag = false) {
    // Toggle active class on buttons
    elements.energyButtons.forEach(btn => {
      const match = btn.getAttribute('data-energy') === energyKey;
      btn.classList.toggle('active', match);
    });

    const info = ENERGY_FEEDBACK[energyKey];
    if (info) {
      if (elements.energyStateBadge) elements.energyStateBadge.textContent = info.badge;
      if (elements.energyMessageTitle) elements.energyMessageTitle.textContent = info.title;
      if (elements.energyMessageText) elements.energyMessageText.textContent = info.text;

      if (showToastFlag) {
        showFeedback(`Energy updated to "${energyKey.toUpperCase()}". ${info.title}`, 'info');
      }
    }
  }

  // ==========================================================================
  // 7. TASK MANAGER MODULE (CRUD)
  // ==========================================================================

  /**
   * Initializes task list rendering and add-task submission
   */
  function initTaskManager() {
    renderTasks();

    if (elements.addTaskForm) {
      elements.addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddTask();
      });
    }
  }

  /**
   * Adds a new task to the array, saves, and updates the UI
   */
  function handleAddTask() {
    const text = elements.newTaskInput.value.trim();
    const priority = elements.newTaskPriority.value || 'Medium';

    if (!text) return;

    const newTask = {
      id: Date.now(),
      title: text,
      priority: priority,
      completed: false
    };

    // Add to top of list
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateOverviewStats();

    // Reset input field
    elements.newTaskInput.value = '';

    // Show brief success alert
    showFeedback(`Task "${text}" added to your queue!`, 'success');
  }

  /**
   * Renders the task items into the DOM with priority tags and empty state toggle
   */
  function renderTasks() {
    if (!elements.taskListContainer) return;
    elements.taskListContainer.innerHTML = '';

    // Handle Empty State
    if (tasks.length === 0) {
      elements.taskEmptyState.classList.remove('d-none');
    } else {
      elements.taskEmptyState.classList.add('d-none');

      tasks.forEach(task => {
        const item = createTaskElement(task);
        elements.taskListContainer.appendChild(item);
      });
    }

    updateOverviewStats();
  }

  /**
   * Builds an individual task card DOM element
   */
  function createTaskElement(task) {
    const card = document.createElement('div');
    card.className = `task-item-card ${task.completed ? 'completed' : ''}`;
    card.id = `task-item-${task.id}`;

    // Priority badge class
    let priorityClass = 'badge-priority-medium';
    if (task.priority === 'High') priorityClass = 'badge-priority-high';
    else if (task.priority === 'Low') priorityClass = 'badge-priority-low';

    card.innerHTML = `
      <input type="checkbox" class="task-checkbox-custom" ${task.completed ? 'checked' : ''} aria-label="Toggle task status">
      <span class="task-title-text">${escapeHtml(task.title)}</span>
      <span class="badge-priority ${priorityClass}">${task.priority}</span>
      <button class="btn-delete-task" title="Delete Task" aria-label="Delete Task">
        <i class="bi bi-trash3"></i>
      </button>
    `;

    // Event listener: Toggle Complete
    const checkbox = card.querySelector('.task-checkbox-custom');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      card.classList.toggle('completed', task.completed);
      saveTasks();
      updateOverviewStats();

      if (task.completed) {
        showFeedback(`Completed: "${task.title}" 🎉`, 'success');
      }
    });

    // Event listener: Delete Task
    const btnDelete = card.querySelector('.btn-delete-task');
    btnDelete.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      showFeedback('Task removed from list.', 'info');
    });

    return card;
  }

  // ==========================================================================
  // 8. 25-MINUTE CIRCULAR SVG FOCUS TIMER
  // ==========================================================================

  /**
   * Initializes the Pomodoro focus timer and control buttons
   */
  function initFocusTimer() {
    updateTimerVisuals();

    // Start Button
    elements.btnTimerStart.addEventListener('click', startTimer);

    // Pause Button
    elements.btnTimerPause.addEventListener('click', pauseTimer);

    // Reset Button
    elements.btnTimerReset.addEventListener('click', resetTimer);
  }

  /**
   * Starts the countdown timer
   */
  function startTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    elements.btnTimerStart.disabled = true;
    elements.btnTimerPause.disabled = false;
    elements.timerStatePill.textContent = 'Focusing...';
    elements.timerStatePill.className = 'badge badge-cyber-blue';
    elements.timerStatusLabel.textContent = 'DEEP WORK INTERVAL';

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timerRemainingSeconds > 0) {
        timerRemainingSeconds--;
        updateTimerVisuals();
      } else {
        // Timer reached 00:00
        clearInterval(timerInterval);
        onTimerComplete();
      }
    }, 1000);
  }

  /**
   * Pauses the countdown timer
   */
  function pauseTimer() {
    if (!isTimerRunning) return;

    isTimerRunning = false;
    clearInterval(timerInterval);

    elements.btnTimerStart.disabled = false;
    elements.btnTimerPause.disabled = true;
    elements.timerStatePill.textContent = 'Paused';
    elements.timerStatePill.className = 'badge badge-cyber-purple';
  }

  /**
   * Resets the timer back to default 25:00
   */
  function resetTimer() {
    pauseTimer();
    timerRemainingSeconds = TIMER_TOTAL_SECONDS;
    updateTimerVisuals();

    elements.btnTimerStart.disabled = false;
    elements.btnTimerPause.disabled = true;
    elements.timerStatePill.textContent = 'Ready';
    elements.timerStatePill.className = 'badge badge-cyber-purple';
    elements.timerStatusLabel.textContent = 'POMODORO';
    document.title = 'FocusFlow — Personal Energy & Productivity Lab';
  }

  /**
   * Triggered when timer countdown reaches zero
   */
  function onTimerComplete() {
    isTimerRunning = false;
    timerRemainingSeconds = TIMER_TOTAL_SECONDS;
    updateTimerVisuals();

    elements.btnTimerStart.disabled = false;
    elements.btnTimerPause.disabled = true;
    elements.timerStatePill.textContent = 'Completed!';
    elements.timerStatePill.className = 'badge bg-success';

    showFeedback('Pomodoro session completed! Take a 5-minute restorative break. ⚡', 'success');
    document.title = '🎉 (Done) FocusFlow';
  }

  /**
   * Updates timer MM:SS text and SVG circular progress stroke offset
   */
  function updateTimerVisuals() {
    const mins = Math.floor(timerRemainingSeconds / 60);
    const secs = timerRemainingSeconds % 60;
    const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (elements.timerDisplay) {
      elements.timerDisplay.textContent = formattedTime;
    }

    // Dynamic browser tab title ticker
    if (isTimerRunning) {
      document.title = `(${formattedTime}) FocusFlow`;
    }

    // Update SVG stroke-dashoffset:
    // Fraction of time passed: (1 - remaining / total)
    if (elements.timerProgressRing) {
      const fractionRemaining = timerRemainingSeconds / TIMER_TOTAL_SECONDS;
      const offset = RING_CIRCUMFERENCE * (1 - fractionRemaining);
      elements.timerProgressRing.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
      elements.timerProgressRing.style.strokeDashoffset = `${offset}`;
    }
  }

  // ==========================================================================
  // 9. NAVIGATION & SMOOTH SCROLLING
  // ==========================================================================

  /**
   * Initializes smooth sidebar link scrolling and active state toggle
   */
  function initNavigation() {
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }

          // Update active styling
          elements.navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Format current date badge
    if (elements.currentDateDisplay) {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      elements.currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  // ==========================================================================
  // 10. TOAST NOTIFICATION HELPER
  // ==========================================================================

  /**
   * Displays brief floating success/info toast messages
   * @param {string} message - Text message to show
   * @param {string} type - 'success' | 'info'
   */
  function showFeedback(message, type = 'success') {
    if (!elements.feedbackToast) return;

    if (!toastInstance) {
      toastInstance = new bootstrap.Toast(elements.feedbackToast, { delay: 3500 });
    }

    if (elements.toastMessage) {
      elements.toastMessage.textContent = message;
    }

    if (elements.toastIconBox) {
      if (type === 'success') {
        elements.toastIconBox.innerHTML = '<i class="bi bi-check2-circle text-success fs-5"></i>';
      } else {
        elements.toastIconBox.innerHTML = '<i class="bi bi-info-circle text-cyan fs-5"></i>';
      }
    }

    toastInstance.show();
  }

  // Utility: Sanitize text for HTML injection
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 11. BOOTSTRAP APPLICATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    initNavigation();
    initEnergyCheckin();
    initTaskManager();
    initFocusTimer();
  });

})();
