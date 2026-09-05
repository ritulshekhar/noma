"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Bell,
    Check,
    ChevronDown,
    Clock3,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Reminder = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    category: string;
    repeat: string;
    completed: boolean;
};

const STORAGE_KEY = "noma_reminders";

const categories = [
    "Education",
    "Home",
    "Daily life",
    "Personal",
    "Work",
    "Others",
];

const repeatOptions = [
    "Does not repeat",
    "Every day",
    "Every week",
    "Every month",
];

const defaultReminders: Reminder[] = [
    {
        id: "1",
        title: "Submit attendance form",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "09:30",
        category: "Education",
        repeat: "Does not repeat",
        completed: false,
    },
    {
        id: "2",
        title: "Call project teammate",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "13:00",
        category: "Work",
        repeat: "Does not repeat",
        completed: false,
    },
    {
        id: "3",
        title: "Buy printouts",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "18:00",
        category: "Daily life",
        repeat: "Does not repeat",
        completed: true,
    },
];

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] =
        useState<Reminder | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("Education");
    const [repeat, setRepeat] = useState("Does not repeat");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            setReminders(JSON.parse(stored));
        } else {
            setReminders(defaultReminders);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultReminders)
            );
        }
    }, []);

    useEffect(() => {
        if (reminders.length > 0) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(reminders)
            );
        }
    }, [reminders]);

    function resetForm() {
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setCategory("Education");
        setRepeat("Does not repeat");
        setEditingReminder(null);
    }

    function openCreate() {
        resetForm();

        setDate(new Date().toISOString().split("T")[0]);

        setShowModal(true);
    }

    function openEdit(reminder: Reminder) {
        setEditingReminder(reminder);

        setTitle(reminder.title);
        setDescription(reminder.description);
        setDate(reminder.date);
        setTime(reminder.time);
        setCategory(reminder.category);
        setRepeat(reminder.repeat);

        setShowModal(true);
    }

    function saveReminder() {
        if (!title.trim()) {
            return;
        }

        if (editingReminder) {
            setReminders((current) =>
                current.map((reminder) =>
                    reminder.id === editingReminder.id
                        ? {
                            ...reminder,
                            title: title.trim(),
                            description,
                            date,
                            time,
                            category,
                            repeat,
                        }
                        : reminder
                )
            );
        } else {
            const reminder: Reminder = {
                id: crypto.randomUUID(),
                title: title.trim(),
                description,
                date,
                time,
                category,
                repeat,
                completed: false,
            };

            setReminders((current) => [
                ...current,
                reminder,
            ]);
        }

        setShowModal(false);
        resetForm();
    }

    function toggleReminder(id: string) {
        setReminders((current) =>
            current.map((reminder) =>
                reminder.id === id
                    ? {
                        ...reminder,
                        completed: !reminder.completed,
                    }
                    : reminder
            )
        );
    }

    function deleteReminder(id: string) {
        setReminders((current) =>
            current.filter(
                (reminder) => reminder.id !== id
            )
        );
    }

    const filteredReminders = useMemo(() => {
        return [...reminders]
            .filter((reminder) => {
                const searchText = search.toLowerCase();

                const matchesSearch =
                    reminder.title
                        .toLowerCase()
                        .includes(searchText) ||
                    reminder.description
                        .toLowerCase()
                        .includes(searchText);

                let matchesFilter = true;

                if (filter === "Active") {
                    matchesFilter = !reminder.completed;
                }

                if (filter === "Completed") {
                    matchesFilter = reminder.completed;
                }

                if (categories.includes(filter)) {
                    matchesFilter =
                        reminder.category === filter;
                }

                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }

                return a.time.localeCompare(b.time);
            });
    }, [reminders, search, filter]);

    const activeCount = reminders.filter(
        (reminder) => !reminder.completed
    ).length;

    const completedCount = reminders.filter(
        (reminder) => reminder.completed
    ).length;

    function formatDate(dateValue: string) {
        if (!dateValue) {
            return "No date";
        }

        const dateObject = new Date(
            `${dateValue}T00:00:00`
        );

        return dateObject.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatTime(timeValue: string) {
        if (!timeValue) {
            return "";
        }

        const [hours, minutes] = timeValue
            .split(":")
            .map(Number);

        const dateObject = new Date();

        dateObject.setHours(hours);
        dateObject.setMinutes(minutes);

        return dateObject.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    return (
        <main className="reminders-page">
            <header className="reminders-header">
                <div className="reminders-title-area">
                    <button
                        className="back-button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <p className="card-label">NOMA</p>
                        <h1>Reminders</h1>
                    </div>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    New reminder
                </button>
            </header>

            <section className="reminder-summary">
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
                    <strong>{reminders.length}</strong>
                </div>
            </section>

            <section className="reminder-toolbar">
                <div className="search-box">
                    <Search size={17} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search reminders..."
                    />
                </div>

                <div className="filter-row">
                    {[
                        "All",
                        "Active",
                        "Completed",
                        ...categories,
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

            <section className="reminders-list">
                {filteredReminders.length === 0 ? (
                    <div className="empty-reminders">
                        <Bell size={30} />

                        <h2>No reminders found</h2>

                        <p>
                            Nothing is waiting for your attention.
                        </p>

                        <button
                            className="primary-button"
                            onClick={openCreate}
                        >
                            <Plus size={17} />
                            Create reminder
                        </button>
                    </div>
                ) : (
                    filteredReminders.map((reminder) => (
                        <article
                            className={`reminder-card ${reminder.completed
                                    ? "completed"
                                    : ""
                                }`}
                            key={reminder.id}
                        >
                            <button
                                className={`reminder-check ${reminder.completed
                                        ? "checked"
                                        : ""
                                    }`}
                                onClick={() =>
                                    toggleReminder(reminder.id)
                                }
                            >
                                {reminder.completed && (
                                    <Check size={15} />
                                )}
                            </button>

                            <div
                                className="reminder-content"
                                onClick={() =>
                                    openEdit(reminder)
                                }
                            >
                                <div className="reminder-title-row">
                                    <h2>{reminder.title}</h2>

                                    <span className="reminder-category">
                                        {reminder.category}
                                    </span>
                                </div>

                                {reminder.description && (
                                    <p>{reminder.description}</p>
                                )}

                                <div className="reminder-meta">
                                    <span>
                                        <Clock3 size={13} />

                                        {formatDate(reminder.date)}
                                    </span>

                                    {reminder.time && (
                                        <span>
                                            {formatTime(reminder.time)}
                                        </span>
                                    )}

                                    {reminder.repeat !==
                                        "Does not repeat" && (
                                            <span className="repeat-label">
                                                {reminder.repeat}
                                            </span>
                                        )}
                                </div>
                            </div>

                            <div className="reminder-actions">
                                <button
                                    className="more-button"
                                    onClick={() =>
                                        openEdit(reminder)
                                    }
                                >
                                    <MoreHorizontal size={19} />
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteReminder(reminder.id)
                                    }
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
                    onMouseDown={() =>
                        setShowModal(false)
                    }
                >
                    <div
                        className="reminder-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    {editingReminder
                                        ? "EDIT REMINDER"
                                        : "NEW REMINDER"}
                                </p>

                                <h2>
                                    {editingReminder
                                        ? "Update reminder"
                                        : "Create a reminder"}
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Reminder</label>

                            <input
                                autoFocus
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="What should NOMA remind you about?"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Add some context..."
                                rows={3}
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Date</label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(event.target.value)
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Time</label>

                                <input
                                    type="time"
                                    value={time}
                                    onChange={(event) =>
                                        setTime(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Category</label>

                                <div className="select-wrapper">
                                    <select
                                        value={category}
                                        onChange={(event) =>
                                            setCategory(
                                                event.target.value
                                            )
                                        }
                                    >
                                        {categories.map((item) => (
                                            <option key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Repeat</label>

                                <div className="select-wrapper">
                                    <select
                                        value={repeat}
                                        onChange={(event) =>
                                            setRepeat(
                                                event.target.value
                                            )
                                        }
                                    >
                                        {repeatOptions.map((item) => (
                                            <option key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={saveReminder}
                        >
                            <Check size={17} />

                            {editingReminder
                                ? "Save changes"
                                : "Create reminder"}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}