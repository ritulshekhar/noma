"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Task = {
    id: string;
    title: string;
    description: string;
    tag: string;
    dueDate: string;
    dueTime: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
    createdAt: string;
};

const STORAGE_KEY = "noma_tasks";

const defaultTasks: Task[] = [
    {
        id: "1",
        title: "Finish AIoT report",
        description: "",
        tag: "Education",
        dueDate: new Date().toISOString().split("T")[0],
        dueTime: "",
        priority: "High",
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Submit assignment",
        description: "",
        tag: "Education",
        dueDate: new Date().toISOString().split("T")[0],
        dueTime: "",
        priority: "Medium",
        completed: true,
        createdAt: new Date().toISOString(),
    },
];

const tags = [
    "Education",
    "Home",
    "Daily life",
    "Personal",
    "Work",
    "Others",
];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("Education");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [priority, setPriority] =
        useState<Task["priority"]>("Medium");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            setTasks(JSON.parse(stored));
        } else {
            setTasks(defaultTasks);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultTasks)
            );
        }
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(tasks)
            );
        }
    }, [tasks]);

    function resetForm() {
        setTitle("");
        setDescription("");
        setTag("Education");
        setDueDate("");
        setDueTime("");
        setPriority("Medium");
        setEditingTask(null);
    }

    function openCreate() {
        resetForm();
        setShowModal(true);
    }

    function openEdit(task: Task) {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setTag(task.tag);
        setDueDate(task.dueDate);
        setDueTime(task.dueTime);
        setPriority(task.priority);
        setShowModal(true);
    }

    function saveTask() {
        if (!title.trim()) return;

        if (editingTask) {
            setTasks((current) =>
                current.map((task) =>
                    task.id === editingTask.id
                        ? {
                            ...task,
                            title: title.trim(),
                            description,
                            tag,
                            dueDate,
                            dueTime,
                            priority,
                        }
                        : task
                )
            );
        } else {
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: title.trim(),
                description,
                tag,
                dueDate,
                dueTime,
                priority,
                completed: false,
                createdAt: new Date().toISOString(),
            };

            setTasks((current) => [newTask, ...current]);
        }

        setShowModal(false);
        resetForm();
    }

    function toggleTask(id: string) {
        setTasks((current) =>
            current.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        completed: !task.completed,
                    }
                    : task
            )
        );
    }

    function deleteTask(id: string) {
        setTasks((current) =>
            current.filter((task) => task.id !== id)
        );
    }

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                task.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filter === "All" ||
                (filter === "Active" && !task.completed) ||
                (filter === "Completed" && task.completed) ||
                task.tag === filter;

            return matchesSearch && matchesFilter;
        });
    }, [tasks, search, filter]);

    const activeCount = tasks.filter(
        (task) => !task.completed
    ).length;

    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    function formatDate(date: string) {
        if (!date) return "No deadline";

        const parsed = new Date(`${date}T00:00:00`);

        return parsed.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });
    }

    return (
        <main className="tasks-page">
            <header className="tasks-header">
                <div className="tasks-title-area">
                    <button
                        className="back-button"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <p className="card-label">NOMA</p>
                        <h1>Tasks</h1>
                    </div>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    New task
                </button>
            </header>

            <section className="task-summary">
                <div>
                    <span>Active</span>
                    <strong>{activeCount}</strong>
                </div>

                <div>
                    <span>Completed</span>
                    <strong>{completedCount}</strong>
                </div>

                <div>
                    <span>Total</span>
                    <strong>{tasks.length}</strong>
                </div>
            </section>

            <section className="task-toolbar">
                <div className="search-box">
                    <Search size={17} />
                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search tasks..."
                    />
                </div>

                <div className="filter-row">
                    {[
                        "All",
                        "Active",
                        "Completed",
                        ...tags,
                    ].map((item) => (
                        <button
                            key={item}
                            className={
                                filter === item
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() => setFilter(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="tasks-list-page">
                {filteredTasks.length === 0 ? (
                    <div className="empty-tasks">
                        <Check size={30} />
                        <h2>No tasks found</h2>
                        <p>
                            Add something to your day and get moving.
                        </p>

                        <button
                            className="primary-button"
                            onClick={openCreate}
                        >
                            <Plus size={17} />
                            Create task
                        </button>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <article
                            className={`full-task-card ${task.completed ? "completed" : ""
                                }`}
                            key={task.id}
                        >
                            <button
                                className={`large-task-check ${task.completed ? "checked" : ""
                                    }`}
                                onClick={() => toggleTask(task.id)}
                            >
                                {task.completed && <Check size={16} />}
                            </button>

                            <div
                                className="full-task-content"
                                onClick={() => openEdit(task)}
                            >
                                <div className="full-task-title">
                                    <h2>{task.title}</h2>

                                    <span
                                        className={`priority ${task.priority.toLowerCase()}`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>

                                {task.description && (
                                    <p>{task.description}</p>
                                )}

                                <div className="full-task-meta">
                                    <span className="task-tag">
                                        {task.tag}
                                    </span>

                                    <span>
                                        <CalendarDays size={13} />
                                        {formatDate(task.dueDate)}
                                    </span>

                                    {task.dueTime && (
                                        <span>{task.dueTime}</span>
                                    )}
                                </div>
                            </div>

                            <div className="task-actions">
                                <button
                                    className="more-button"
                                    onClick={() => openEdit(task)}
                                >
                                    <MoreHorizontal size={19} />
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </section>

            {showModal && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() => setShowModal(false)}
                >
                    <div
                        className="task-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    {editingTask
                                        ? "EDIT TASK"
                                        : "NEW TASK"}
                                </p>

                                <h2>
                                    {editingTask
                                        ? "Update task"
                                        : "Create a task"}
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Task name</label>

                            <input
                                autoFocus
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="What needs to get done?"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Add a little context..."
                                rows={3}
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Tag</label>

                                <div className="select-wrapper">
                                    <select
                                        value={tag}
                                        onChange={(event) =>
                                            setTag(event.target.value)
                                        }
                                    >
                                        {tags.map((item) => (
                                            <option key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Priority</label>

                                <div className="select-wrapper">
                                    <select
                                        value={priority}
                                        onChange={(event) =>
                                            setPriority(
                                                event.target
                                                    .value as Task["priority"]
                                            )
                                        }
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Due date</label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) =>
                                        setDueDate(event.target.value)
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Due time</label>

                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(event) =>
                                        setDueTime(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={saveTask}
                        >
                            {editingTask
                                ? "Save changes"
                                : "Create task"}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}