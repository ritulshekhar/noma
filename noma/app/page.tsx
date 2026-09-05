"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePlus,
  FileText,
  Home,
  MoreHorizontal,
  NotebookPen,
  Plus,
  Search,
  Settings,
  Trophy,
  Users,
  X,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  tag: string;
  due: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finish AIoT report",
    tag: "Education",
    due: "Today",
    completed: false,
  },
  {
    id: 2,
    title: "Submit assignment",
    tag: "Education",
    due: "Today",
    completed: true,
  },
  {
    id: 3,
    title: "Buy printouts",
    tag: "Daily life",
    due: "6:00 PM",
    completed: false,
  },
];

const navItems = [
  { label: "Home", icon: Home },
  { label: "Tasks", icon: Check },
  { label: "Notes", icon: NotebookPen },
  { label: "Academic", icon: CalendarDays },
  { label: "Groups", icon: Users },
];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");

  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  function toggleTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
            ...task,
            completed: !task.completed,
          }
          : task
      )
    );
  }

  function addTask() {
    const title = newTask.trim();

    if (!title) return;

    const task: Task = {
      id: Date.now(),
      title,
      tag: "Others",
      due: "Today",
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, task]);

    setNewTask("");
    setShowAdd(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <span>NOMA</span>
        </div>

        <nav className="desktop-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${label === "Home" ? "active" : ""
                }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}

          <button className="nav-item">
            <Trophy size={19} strokeWidth={1.8} />
            <span>Achievements</span>
          </button>
        </nav>

        <button className="nav-item settings">
          <Settings size={19} strokeWidth={1.8} />
          <span>Settings</span>
        </button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SATURDAY · SEPTEMBER 5</p>

            <h1>Good afternoon</h1>

            <p className="subtitle">
              Let&apos;s get things done.
            </p>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <button
              className="avatar"
              aria-label="Profile"
            >
              N
            </button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="progress-card">
            <div className="progress-copy">
              <p className="card-label">TODAY</p>

              <h2>
                {completedTasks} of {tasks.length} tasks complete
              </h2>

              <p>
                Small progress still counts.
              </p>
            </div>

            <div
              className="progress-ring"
              style={
                {
                  "--progress": `${progress * 3.6}deg`,
                } as React.CSSProperties
              }
            >
              <div>
                <strong>{progress}%</strong>
                <span>done</span>
              </div>
            </div>
          </div>

          <div className="quick-card">
            <div>
              <p className="card-label">QUICK ADD</p>

              <h3>
                Capture something before you forget.
              </h3>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowAdd(true)}
            >
              <Plus size={18} />
              Add task
            </button>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="card-label">YOUR DAY</p>

              <h2>Today&apos;s tasks</h2>
            </div>

            <button className="text-button">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <article
                className={`task-card ${task.completed ? "completed" : ""
                  }`}
                key={task.id}
              >
                <button
                  className={`task-check ${task.completed ? "checked" : ""
                    }`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={
                    task.completed
                      ? "Mark task incomplete"
                      : "Mark task complete"
                  }
                >
                  {task.completed && <Check size={15} />}
                </button>

                <div className="task-main">
                  <h3>{task.title}</h3>

                  <div className="task-meta">
                    <span className="tag">{task.tag}</span>
                    <span>{task.due}</span>
                  </div>
                </div>

                <button
                  className="more-button"
                  aria-label="More options"
                >
                  <MoreHorizontal size={19} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="card-label">UPCOMING</p>

              <h2>
                Don&apos;t let deadlines sneak up.
              </h2>
            </div>
          </div>

          <div className="upcoming-grid">
            <article className="upcoming-card">
              <div className="upcoming-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <strong>DBMS Class Test</strong>
                <span>
                  September 8 · 10:00 AM
                </span>
              </div>
            </article>

            <article className="upcoming-card">
              <div className="upcoming-icon">
                <FileText size={19} />
              </div>

              <div>
                <strong>AIoT Assignment</strong>
                <span>
                  September 10 · 11:59 PM
                </span>
              </div>
            </article>
          </div>
        </section>
      </section>

      <nav className="mobile-nav">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`mobile-nav-item ${label === "Home" ? "active" : ""
              }`}
          >
            <Icon size={19} strokeWidth={1.8} />

            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button
        className="mobile-fab"
        onClick={() => setShowAdd(true)}
        aria-label="Add task"
      >
        <CirclePlus size={24} />
      </button>

      {showAdd && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setShowAdd(false)}
        >
          <div
            className="add-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="card-label">
                  QUICK ADD
                </p>

                <h2>New task</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAdd(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <input
              autoFocus
              value={newTask}
              onChange={(event) =>
                setNewTask(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addTask();
                }
              }}
              placeholder="What needs to get done?"
            />

            <button
              className="primary-button full"
              onClick={addTask}
            >
              Add task
            </button>
          </div>
        </div>
      )}
    </main>
  );
}