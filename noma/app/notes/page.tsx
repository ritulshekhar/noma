"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    FileText,
    MoreHorizontal,
    Pin,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Note = {
    id: string;
    title: string;
    content: string;
    tag: string;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
};

const STORAGE_KEY = "noma_notes";

const defaultNotes: Note[] = [
    {
        id: "1",
        title: "AIoT Project",
        content:
            "Review the FedAirGuard papers and finalize the literature review.",
        tag: "Education",
        pinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Things to remember",
        content:
            "Ask about the project submission format and presentation date.",
        tag: "Personal",
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const tags = [
    "Education",
    "Personal",
    "Work",
    "Daily life",
    "Others",
];

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("Education");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            setNotes(JSON.parse(stored));
        } else {
            setNotes(defaultNotes);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultNotes)
            );
        }
    }, []);

    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(notes)
            );
        }
    }, [notes]);

    function resetForm() {
        setTitle("");
        setContent("");
        setTag("Education");
        setEditingNote(null);
    }

    function openCreate() {
        resetForm();
        setShowModal(true);
    }

    function openEdit(note: Note) {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setTag(note.tag);
        setShowModal(true);
    }

    function saveNote() {
        if (!title.trim()) {
            return;
        }

        const now = new Date().toISOString();

        if (editingNote) {
            setNotes((current) =>
                current.map((note) =>
                    note.id === editingNote.id
                        ? {
                            ...note,
                            title: title.trim(),
                            content,
                            tag,
                            updatedAt: now,
                        }
                        : note
                )
            );
        } else {
            const newNote: Note = {
                id: crypto.randomUUID(),
                title: title.trim(),
                content,
                tag,
                pinned: false,
                createdAt: now,
                updatedAt: now,
            };

            setNotes((current) => [newNote, ...current]);
        }

        setShowModal(false);
        resetForm();
    }

    function deleteNote(id: string) {
        setNotes((current) =>
            current.filter((note) => note.id !== id)
        );
    }

    function togglePin(id: string) {
        setNotes((current) =>
            current.map((note) =>
                note.id === id
                    ? {
                        ...note,
                        pinned: !note.pinned,
                    }
                    : note
            )
        );
    }

    const filteredNotes = useMemo(() => {
        return notes
            .filter((note) => {
                const searchText = search.toLowerCase();

                const matchesSearch =
                    note.title.toLowerCase().includes(searchText) ||
                    note.content.toLowerCase().includes(searchText);

                const matchesTag =
                    activeTag === "All" || note.tag === activeTag;

                return matchesSearch && matchesTag;
            })
            .sort((a, b) => {
                if (a.pinned !== b.pinned) {
                    return a.pinned ? -1 : 1;
                }

                return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                );
            });
    }, [notes, search, activeTag]);

    return (
        <main className="notes-page">
            <header className="notes-header">
                <div className="notes-title-area">
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
                        <h1>Notes</h1>
                    </div>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreate}
                >
                    <Plus size={18} />
                    New note
                </button>
            </header>

            <section className="notes-toolbar">
                <div className="search-box">
                    <Search size={17} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search notes..."
                    />
                </div>

                <div className="filter-row">
                    {["All", ...tags].map((item) => (
                        <button
                            key={item}
                            className={
                                activeTag === item
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() => setActiveTag(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="notes-grid">
                {filteredNotes.length === 0 ? (
                    <div className="empty-notes">
                        <FileText size={30} />

                        <h2>No notes found</h2>

                        <p>
                            Start writing something worth remembering.
                        </p>

                        <button
                            className="primary-button"
                            onClick={openCreate}
                        >
                            <Plus size={17} />
                            Create note
                        </button>
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <article
                            className={`note-card ${note.pinned ? "pinned" : ""
                                }`}
                            key={note.id}
                            onClick={() => openEdit(note)}
                        >
                            <div className="note-card-top">
                                <span className="note-tag">
                                    {note.tag}
                                </span>

                                <div className="note-card-actions">
                                    {note.pinned && (
                                        <Pin size={15} />
                                    )}

                                    <button
                                        className="note-more"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openEdit(note);
                                        }}
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>

                            <h2>{note.title}</h2>

                            <p>
                                {note.content || "No additional content."}
                            </p>

                            <div className="note-card-footer">
                                <span>
                                    Updated{" "}
                                    {new Date(
                                        note.updatedAt
                                    ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </span>
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
                        className="note-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    {editingNote
                                        ? "EDIT NOTE"
                                        : "NEW NOTE"}
                                </p>

                                <h2>
                                    {editingNote
                                        ? "Update note"
                                        : "Create a note"}
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Title</label>

                            <input
                                autoFocus
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Give your note a title..."
                            />
                        </div>

                        <div className="form-field">
                            <label>Tag</label>

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
                        </div>

                        <div className="form-field">
                            <label>Note</label>

                            <textarea
                                value={content}
                                onChange={(event) =>
                                    setContent(event.target.value)
                                }
                                placeholder="Start writing..."
                                rows={9}
                            />
                        </div>

                        <div className="note-modal-actions">
                            {editingNote && (
                                <button
                                    className="delete-note-button"
                                    onClick={() => {
                                        deleteNote(editingNote.id);
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}

                            <button
                                className="primary-button full"
                                onClick={saveNote}
                            >
                                <Check size={17} />
                                {editingNote
                                    ? "Save changes"
                                    : "Save note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}