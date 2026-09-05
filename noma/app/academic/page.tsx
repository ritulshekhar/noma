"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronDown,
    Clock3,
    FileText,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
    Trophy,
    X,
} from "lucide-react";

type Assignment = {
    id: string;
    title: string;
    subject: string;
    description: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "Not started" | "In progress" | "Completed";
    createdAt: string;
    completedAt?: string;
};

type Exam = {
    id: string;
    name: string;
    subject: string;
    type: "Exam" | "Class test" | "Quiz" | "Viva";
    date: string;
    time: string;
    room: string;
};

const ASSIGNMENT_KEY = "noma_assignments";
const EXAM_KEY = "noma_exams";
const HISTORY_KEY = "noma_assignment_history";

const defaultAssignments: Assignment[] = [
    {
        id: "a1",
        title: "AIoT Literature Review",
        subject: "AIoT",
        description:
            "Review the selected papers and prepare the literature review section.",
        dueDate: "2026-09-10",
        priority: "High",
        status: "In progress",
        createdAt: new Date().toISOString(),
    },
    {
        id: "a2",
        title: "DBMS Assignment",
        subject: "DBMS",
        description:
            "Complete normalization and SQL query questions.",
        dueDate: "2026-09-15",
        priority: "Medium",
        status: "Not started",
        createdAt: new Date().toISOString(),
    },
];

const defaultExams: Exam[] = [
    {
        id: "e1",
        name: "DBMS Class Test",
        subject: "DBMS",
        type: "Class test",
        date: "2026-09-08",
        time: "10:00",
        room: "Block 1",
    },
    {
        id: "e2",
        name: "Computer Networks Quiz",
        subject: "Computer Networks",
        type: "Quiz",
        date: "2026-09-12",
        time: "11:00",
        room: "",
    },
];

const assignmentPriorities = [
    "Low",
    "Medium",
    "High",
] as const;

const assignmentStatuses = [
    "Not started",
    "In progress",
    "Completed",
] as const;

const examTypes = [
    "Exam",
    "Class test",
    "Quiz",
    "Viva",
] as const;

export default function AcademicPage() {
    const [assignments, setAssignments] = useState<
        Assignment[]
    >([]);

    const [exams, setExams] = useState<Exam[]>([]);

    const [activeTab, setActiveTab] = useState<
        "assignments" | "exams"
    >("assignments");

    const [showAssignmentModal, setShowAssignmentModal] =
        useState(false);

    const [showExamModal, setShowExamModal] =
        useState(false);

    const [editingAssignment, setEditingAssignment] =
        useState<Assignment | null>(null);

    const [editingExam, setEditingExam] =
        useState<Exam | null>(null);

    const [showCompletionPrompt, setShowCompletionPrompt] =
        useState<Assignment | null>(null);

    const [assignmentTitle, setAssignmentTitle] =
        useState("");

    const [assignmentSubject, setAssignmentSubject] =
        useState("");

    const [assignmentDescription, setAssignmentDescription] =
        useState("");

    const [assignmentDueDate, setAssignmentDueDate] =
        useState("");

    const [assignmentPriority, setAssignmentPriority] =
        useState<Assignment["priority"]>("Medium");

    const [assignmentStatus, setAssignmentStatus] =
        useState<Assignment["status"]>("Not started");

    const [examName, setExamName] = useState("");
    const [examSubject, setExamSubject] = useState("");
    const [examType, setExamType] =
        useState<Exam["type"]>("Class test");
    const [examDate, setExamDate] = useState("");
    const [examTime, setExamTime] = useState("");
    const [examRoom, setExamRoom] = useState("");

    useEffect(() => {
        const storedAssignments =
            localStorage.getItem(ASSIGNMENT_KEY);

        const storedExams = localStorage.getItem(EXAM_KEY);

        if (storedAssignments) {
            setAssignments(JSON.parse(storedAssignments));
        } else {
            setAssignments(defaultAssignments);

            localStorage.setItem(
                ASSIGNMENT_KEY,
                JSON.stringify(defaultAssignments)
            );
        }

        if (storedExams) {
            setExams(JSON.parse(storedExams));
        } else {
            setExams(defaultExams);

            localStorage.setItem(
                EXAM_KEY,
                JSON.stringify(defaultExams)
            );
        }
    }, []);

    useEffect(() => {
        if (assignments.length > 0) {
            localStorage.setItem(
                ASSIGNMENT_KEY,
                JSON.stringify(assignments)
            );
        }
    }, [assignments]);

    useEffect(() => {
        if (exams.length > 0) {
            localStorage.setItem(
                EXAM_KEY,
                JSON.stringify(exams)
            );
        }
    }, [exams]);

    useEffect(() => {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        const dueToday = assignments.find(
            (assignment) =>
                assignment.dueDate === today &&
                assignment.status !== "Completed"
        );

        if (dueToday) {
            setShowCompletionPrompt(dueToday);
        }
    }, [assignments]);

    function resetAssignmentForm() {
        setAssignmentTitle("");
        setAssignmentSubject("");
        setAssignmentDescription("");
        setAssignmentDueDate("");
        setAssignmentPriority("Medium");
        setAssignmentStatus("Not started");
        setEditingAssignment(null);
    }

    function resetExamForm() {
        setExamName("");
        setExamSubject("");
        setExamType("Class test");
        setExamDate("");
        setExamTime("");
        setExamRoom("");
        setEditingExam(null);
    }

    function openCreateAssignment() {
        resetAssignmentForm();
        setShowAssignmentModal(true);
    }

    function openEditAssignment(
        assignment: Assignment
    ) {
        setEditingAssignment(assignment);

        setAssignmentTitle(assignment.title);
        setAssignmentSubject(assignment.subject);
        setAssignmentDescription(
            assignment.description
        );
        setAssignmentDueDate(assignment.dueDate);
        setAssignmentPriority(assignment.priority);
        setAssignmentStatus(assignment.status);

        setShowAssignmentModal(true);
    }

    function saveAssignment() {
        if (
            !assignmentTitle.trim() ||
            !assignmentSubject.trim() ||
            !assignmentDueDate
        ) {
            return;
        }

        if (editingAssignment) {
            setAssignments((current) =>
                current.map((assignment) =>
                    assignment.id === editingAssignment.id
                        ? {
                            ...assignment,
                            title: assignmentTitle.trim(),
                            subject:
                                assignmentSubject.trim(),
                            description:
                                assignmentDescription,
                            dueDate: assignmentDueDate,
                            priority: assignmentPriority,
                            status: assignmentStatus,
                            completedAt:
                                assignmentStatus ===
                                    "Completed"
                                    ? assignment.completedAt ??
                                    new Date().toISOString()
                                    : undefined,
                        }
                        : assignment
                )
            );
        } else {
            const assignment: Assignment = {
                id: crypto.randomUUID(),
                title: assignmentTitle.trim(),
                subject: assignmentSubject.trim(),
                description: assignmentDescription,
                dueDate: assignmentDueDate,
                priority: assignmentPriority,
                status: assignmentStatus,
                createdAt: new Date().toISOString(),
                completedAt:
                    assignmentStatus === "Completed"
                        ? new Date().toISOString()
                        : undefined,
            };

            setAssignments((current) => [
                assignment,
                ...current,
            ]);
        }

        setShowAssignmentModal(false);
        resetAssignmentForm();
    }

    function deleteAssignment(id: string) {
        setAssignments((current) =>
            current.filter(
                (assignment) => assignment.id !== id
            )
        );
    }

    function markAssignmentComplete(
        assignment: Assignment
    ) {
        const completedAt = new Date().toISOString();

        setAssignments((current) =>
            current.map((item) =>
                item.id === assignment.id
                    ? {
                        ...item,
                        status: "Completed",
                        completedAt,
                    }
                    : item
            )
        );

        const existingHistory =
            localStorage.getItem(HISTORY_KEY);

        const history = existingHistory
            ? JSON.parse(existingHistory)
            : [];

        history.push({
            assignmentId: assignment.id,
            title: assignment.title,
            completedAt,
            completedOnTime:
                new Date(completedAt) <=
                new Date(`${assignment.dueDate}T23:59:59`),
        });

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(history)
        );

        setShowCompletionPrompt(null);
    }

    function keepAssignmentOpen() {
        setShowCompletionPrompt(null);
    }

    function openCreateExam() {
        resetExamForm();
        setShowExamModal(true);
    }

    function openEditExam(exam: Exam) {
        setEditingExam(exam);

        setExamName(exam.name);
        setExamSubject(exam.subject);
        setExamType(exam.type);
        setExamDate(exam.date);
        setExamTime(exam.time);
        setExamRoom(exam.room);

        setShowExamModal(true);
    }

    function saveExam() {
        if (
            !examName.trim() ||
            !examSubject.trim() ||
            !examDate
        ) {
            return;
        }

        if (editingExam) {
            setExams((current) =>
                current.map((exam) =>
                    exam.id === editingExam.id
                        ? {
                            ...exam,
                            name: examName.trim(),
                            subject: examSubject.trim(),
                            type: examType,
                            date: examDate,
                            time: examTime,
                            room: examRoom.trim(),
                        }
                        : exam
                )
            );
        } else {
            const exam: Exam = {
                id: crypto.randomUUID(),
                name: examName.trim(),
                subject: examSubject.trim(),
                type: examType,
                date: examDate,
                time: examTime,
                room: examRoom.trim(),
            };

            setExams((current) => [...current, exam]);
        }

        setShowExamModal(false);
        resetExamForm();
    }

    function deleteExam(id: string) {
        setExams((current) =>
            current.filter((exam) => exam.id !== id)
        );
    }

    function formatDate(value: string) {
        if (!value) {
            return "No date";
        }

        return new Date(
            `${value}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatTime(value: string) {
        if (!value) {
            return "";
        }

        const [hours, minutes] = value
            .split(":")
            .map(Number);

        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function getDaysLeft(dateValue: string) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const due = new Date(
            `${dateValue}T00:00:00`
        );

        return Math.ceil(
            (due.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }

    function getDeadlineText(dateValue: string) {
        const days = getDaysLeft(dateValue);

        if (days < 0) {
            return "Overdue";
        }

        if (days === 0) {
            return "Due today";
        }

        if (days === 1) {
            return "Due tomorrow";
        }

        return `${days} days left`;
    }

    const activeAssignments = useMemo(
        () =>
            assignments.filter(
                (assignment) =>
                    assignment.status !== "Completed"
            ),
        [assignments]
    );

    const completedAssignments = useMemo(
        () =>
            assignments.filter(
                (assignment) =>
                    assignment.status === "Completed"
            ),
        [assignments]
    );

    const sortedAssignments = useMemo(
        () =>
            [...assignments].sort((a, b) =>
                a.dueDate.localeCompare(b.dueDate)
            ),
        [assignments]
    );

    const sortedExams = useMemo(
        () =>
            [...exams].sort((a, b) =>
                a.date.localeCompare(b.date)
            ),
        [exams]
    );

    return (
        <main className="academic-page">
            <header className="academic-header">
                <div className="academic-title-area">
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

                        <h1>Academic</h1>
                    </div>
                </div>

                <button
                    className="primary-button"
                    onClick={
                        activeTab === "assignments"
                            ? openCreateAssignment
                            : openCreateExam
                    }
                >
                    <Plus size={18} />

                    {activeTab === "assignments"
                        ? "New assignment"
                        : "New exam"}
                </button>
            </header>

            <section className="academic-tabs">
                <button
                    className={
                        activeTab === "assignments"
                            ? "academic-tab active"
                            : "academic-tab"
                    }
                    onClick={() =>
                        setActiveTab("assignments")
                    }
                >
                    <FileText size={17} />

                    Assignments

                    <span>{assignments.length}</span>
                </button>

                <button
                    className={
                        activeTab === "exams"
                            ? "academic-tab active"
                            : "academic-tab"
                    }
                    onClick={() => setActiveTab("exams")}
                >
                    <CalendarDays size={17} />

                    Exams & Tests

                    <span>{exams.length}</span>
                </button>
            </section>

            {activeTab === "assignments" && (
                <>
                    <section className="academic-summary">
                        <div>
                            <span>Active</span>

                            <strong>
                                {activeAssignments.length}
                            </strong>
                        </div>

                        <div>
                            <span>Completed</span>

                            <strong>
                                {completedAssignments.length}
                            </strong>
                        </div>

                        <div>
                            <span>Total</span>

                            <strong>{assignments.length}</strong>
                        </div>
                    </section>

                    <section className="academic-list">
                        {sortedAssignments.length === 0 ? (
                            <div className="academic-empty">
                                <FileText size={30} />

                                <h2>No assignments yet</h2>

                                <p>
                                    Add your first assignment to keep
                                    deadlines under control.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={openCreateAssignment}
                                >
                                    <Plus size={17} />
                                    Add assignment
                                </button>
                            </div>
                        ) : (
                            sortedAssignments.map(
                                (assignment) => {
                                    const daysLeft = getDaysLeft(
                                        assignment.dueDate
                                    );

                                    return (
                                        <article
                                            className={`assignment-card ${assignment.status ===
                                                    "Completed"
                                                    ? "completed"
                                                    : ""
                                                }`}
                                            key={assignment.id}
                                        >
                                            <button
                                                className={`assignment-check ${assignment.status ===
                                                        "Completed"
                                                        ? "checked"
                                                        : ""
                                                    }`}
                                                onClick={() => {
                                                    if (
                                                        assignment.status ===
                                                        "Completed"
                                                    ) {
                                                        setAssignments(
                                                            (current) =>
                                                                current.map(
                                                                    (item) =>
                                                                        item.id ===
                                                                            assignment.id
                                                                            ? {
                                                                                ...item,
                                                                                status:
                                                                                    "In progress",
                                                                                completedAt:
                                                                                    undefined,
                                                                            }
                                                                            : item
                                                                )
                                                        );
                                                    } else {
                                                        markAssignmentComplete(
                                                            assignment
                                                        );
                                                    }
                                                }}
                                            >
                                                {assignment.status ===
                                                    "Completed" && (
                                                        <Check size={15} />
                                                    )}
                                            </button>

                                            <div
                                                className="assignment-content"
                                                onClick={() =>
                                                    openEditAssignment(
                                                        assignment
                                                    )
                                                }
                                            >
                                                <div className="assignment-heading">
                                                    <div>
                                                        <h2>
                                                            {assignment.title}
                                                        </h2>

                                                        <p>
                                                            {assignment.subject}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`priority ${assignment.priority.toLowerCase()}`}
                                                    >
                                                        {assignment.priority}
                                                    </span>
                                                </div>

                                                {assignment.description && (
                                                    <p className="assignment-description">
                                                        {assignment.description}
                                                    </p>
                                                )}

                                                <div className="assignment-meta">
                                                    <span>
                                                        <CalendarDays
                                                            size={13}
                                                        />

                                                        {formatDate(
                                                            assignment.dueDate
                                                        )}
                                                    </span>

                                                    <span
                                                        className={
                                                            daysLeft <= 0 &&
                                                                assignment.status !==
                                                                "Completed"
                                                                ? "deadline-danger"
                                                                : ""
                                                        }
                                                    >
                                                        {assignment.status ===
                                                            "Completed"
                                                            ? "Completed"
                                                            : getDeadlineText(
                                                                assignment.dueDate
                                                            )}
                                                    </span>

                                                    <span>
                                                        {
                                                            assignment.status
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="academic-actions">
                                                <button
                                                    className="more-button"
                                                    onClick={() =>
                                                        openEditAssignment(
                                                            assignment
                                                        )
                                                    }
                                                >
                                                    <MoreHorizontal
                                                        size={19}
                                                    />
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteAssignment(
                                                            assignment.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )
                        )}
                    </section>
                </>
            )}

            {activeTab === "exams" && (
                <section className="academic-list">
                    {sortedExams.length === 0 ? (
                        <div className="academic-empty">
                            <CalendarDays size={30} />

                            <h2>No exams or tests yet</h2>

                            <p>
                                Add upcoming exams, class tests,
                                quizzes or vivas.
                            </p>

                            <button
                                className="primary-button"
                                onClick={openCreateExam}
                            >
                                <Plus size={17} />
                                Add exam
                            </button>
                        </div>
                    ) : (
                        sortedExams.map((exam) => (
                            <article
                                className="exam-card"
                                key={exam.id}
                            >
                                <div className="exam-date">
                                    <strong>
                                        {new Date(
                                            `${exam.date}T00:00:00`
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                            }
                                        )}
                                    </strong>

                                    <span>
                                        {new Date(
                                            `${exam.date}T00:00:00`
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                month: "short",
                                            }
                                        )}
                                    </span>
                                </div>

                                <div
                                    className="exam-content"
                                    onClick={() =>
                                        openEditExam(exam)
                                    }
                                >
                                    <div className="exam-title-row">
                                        <h2>{exam.name}</h2>

                                        <span className="exam-type">
                                            {exam.type}
                                        </span>
                                    </div>

                                    <p>{exam.subject}</p>

                                    <div className="exam-meta">
                                        {exam.time && (
                                            <span>
                                                <Clock3 size={13} />

                                                {formatTime(exam.time)}
                                            </span>
                                        )}

                                        {exam.room && (
                                            <span>{exam.room}</span>
                                        )}

                                        <span>
                                            {formatDate(exam.date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="academic-actions">
                                    <button
                                        className="more-button"
                                        onClick={() =>
                                            openEditExam(exam)
                                        }
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteExam(exam.id)
                                        }
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            )}

            {showAssignmentModal && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowAssignmentModal(false)
                    }
                >
                    <div
                        className="academic-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    {editingAssignment
                                        ? "EDIT ASSIGNMENT"
                                        : "NEW ASSIGNMENT"}
                                </p>

                                <h2>
                                    {editingAssignment
                                        ? "Update assignment"
                                        : "Create assignment"}
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowAssignmentModal(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Assignment name</label>

                            <input
                                autoFocus
                                value={assignmentTitle}
                                onChange={(event) =>
                                    setAssignmentTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. AIoT Literature Review"
                            />
                        </div>

                        <div className="form-field">
                            <label>Subject</label>

                            <input
                                value={assignmentSubject}
                                onChange={(event) =>
                                    setAssignmentSubject(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Artificial Intelligence"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>

                            <textarea
                                value={assignmentDescription}
                                onChange={(event) =>
                                    setAssignmentDescription(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="What needs to be completed?"
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Deadline</label>

                                <input
                                    type="date"
                                    value={assignmentDueDate}
                                    onChange={(event) =>
                                        setAssignmentDueDate(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Priority</label>

                                <div className="select-wrapper">
                                    <select
                                        value={assignmentPriority}
                                        onChange={(event) =>
                                            setAssignmentPriority(
                                                event.target
                                                    .value as Assignment["priority"]
                                            )
                                        }
                                    >
                                        {assignmentPriorities.map(
                                            (item) => (
                                                <option key={item}>
                                                    {item}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Status</label>

                            <div className="select-wrapper">
                                <select
                                    value={assignmentStatus}
                                    onChange={(event) =>
                                        setAssignmentStatus(
                                            event.target
                                                .value as Assignment["status"]
                                        )
                                    }
                                >
                                    {assignmentStatuses.map(
                                        (item) => (
                                            <option key={item}>
                                                {item}
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown size={15} />
                            </div>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={saveAssignment}
                        >
                            <Check size={17} />

                            {editingAssignment
                                ? "Save changes"
                                : "Create assignment"}
                        </button>
                    </div>
                </div>
            )}

            {showExamModal && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowExamModal(false)
                    }
                >
                    <div
                        className="academic-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    {editingExam
                                        ? "EDIT EXAM"
                                        : "NEW EXAM"}
                                </p>

                                <h2>
                                    {editingExam
                                        ? "Update exam"
                                        : "Add exam or test"}
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowExamModal(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Exam name</label>

                            <input
                                autoFocus
                                value={examName}
                                onChange={(event) =>
                                    setExamName(event.target.value)
                                }
                                placeholder="e.g. DBMS Class Test"
                            />
                        </div>

                        <div className="form-field">
                            <label>Subject</label>

                            <input
                                value={examSubject}
                                onChange={(event) =>
                                    setExamSubject(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. DBMS"
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Type</label>

                                <div className="select-wrapper">
                                    <select
                                        value={examType}
                                        onChange={(event) =>
                                            setExamType(
                                                event.target
                                                    .value as Exam["type"]
                                            )
                                        }
                                    >
                                        {examTypes.map((item) => (
                                            <option key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown size={15} />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Date</label>

                                <input
                                    type="date"
                                    value={examDate}
                                    onChange={(event) =>
                                        setExamDate(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Time</label>

                                <input
                                    type="time"
                                    value={examTime}
                                    onChange={(event) =>
                                        setExamTime(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-field">
                                <label>Room / location</label>

                                <input
                                    value={examRoom}
                                    onChange={(event) =>
                                        setExamRoom(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={saveExam}
                        >
                            <Check size={17} />

                            {editingExam
                                ? "Save changes"
                                : "Add exam"}
                        </button>
                    </div>
                </div>
            )}

            {showCompletionPrompt && (
                <div className="modal-backdrop">
                    <div className="completion-modal">
                        <div className="completion-icon">
                            <Trophy size={26} />
                        </div>

                        <p className="card-label">
                            DEADLINE DAY
                        </p>

                        <h2>
                            Did you finish this assignment?
                        </h2>

                        <p>
                            <strong>
                                {showCompletionPrompt.title}
                            </strong>{" "}
                            is due today. Tell NOMA what happened
                            so your completion history stays accurate.
                        </p>

                        <div className="completion-actions">
                            <button
                                className="secondary-button"
                                onClick={keepAssignmentOpen}
                            >
                                Not yet
                            </button>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    markAssignmentComplete(
                                        showCompletionPrompt
                                    )
                                }
                            >
                                <Check size={17} />
                                I finished it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}