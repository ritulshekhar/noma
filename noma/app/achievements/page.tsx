"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Award,
    Check,
    Flame,
    Lock,
    Star,
    Trophy,
    Zap,
} from "lucide-react";

type Activity = {
    id: string;
    type:
    | "task"
    | "assignment"
    | "note"
    | "reminder";
    completedAt: string;
    value?: number;
};

type Badge = {
    id: string;
    title: string;
    description: string;
    icon: "trophy" | "flame" | "star" | "zap";
    unlocked: boolean;
    current: number;
    target: number;
    best?: number;
    recordLabel?: string;
};

const ACTIVITY_KEY = "noma_activity_history";

const iconMap = {
    trophy: Trophy,
    flame: Flame,
    star: Star,
    zap: Zap,
};

export default function AchievementsPage() {
    const [activities, setActivities] =
        useState<Activity[]>([]);

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem(
            ACTIVITY_KEY
        );

        if (stored) {
            setActivities(JSON.parse(stored));
        }
    }, [refreshKey]);

    const taskActivities = useMemo(
        () =>
            activities.filter(
                (activity) => activity.type === "task"
            ),
        [activities]
    );

    const assignmentActivities = useMemo(
        () =>
            activities.filter(
                (activity) =>
                    activity.type === "assignment"
            ),
        [activities]
    );

    const noteActivities = useMemo(
        () =>
            activities.filter(
                (activity) => activity.type === "note"
            ),
        [activities]
    );

    const reminderActivities = useMemo(
        () =>
            activities.filter(
                (activity) =>
                    activity.type === "reminder"
            ),
        [activities]
    );

    const totalCompleted =
        taskActivities.length;

    const totalAssignments =
        assignmentActivities.length;

    const totalNotes =
        noteActivities.length;

    const totalReminders =
        reminderActivities.length;

    function getDailyTaskCounts() {
        const counts: Record<string, number> = {};

        taskActivities.forEach((activity) => {
            const day = new Date(
                activity.completedAt
            )
                .toISOString()
                .split("T")[0];

            counts[day] = (counts[day] || 0) + 1;
        });

        return counts;
    }

    function getBestMorningCount() {
        let best = 0;

        taskActivities.forEach((activity) => {
            const date = new Date(
                activity.completedAt
            );

            if (date.getHours() < 12) {
                const day = date
                    .toISOString()
                    .split("T")[0];

                const count = taskActivities.filter(
                    (item) => {
                        const itemDate = new Date(
                            item.completedAt
                        );

                        return (
                            itemDate
                                .toISOString()
                                .split("T")[0] === day &&
                            itemDate.getHours() < 12
                        );
                    }
                ).length;

                best = Math.max(best, count);
            }
        });

        return best;
    }

    function getBestDailyCount() {
        const counts = getDailyTaskCounts();

        return Math.max(
            0,
            ...Object.values(counts)
        );
    }

    function getCurrentStreak() {
        const counts = getDailyTaskCounts();

        const days = Object.keys(counts).sort(
            (a, b) =>
                new Date(b).getTime() -
                new Date(a).getTime()
        );

        if (days.length === 0) {
            return 0;
        }

        let streak = 0;

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < days.length; i++) {
            const expected = new Date(today);

            expected.setDate(
                today.getDate() - i
            );

            const expectedKey = expected
                .toISOString()
                .split("T")[0];

            if (counts[expectedKey]) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    const bestMorning =
        getBestMorningCount();

    const bestDaily =
        getBestDailyCount();

    const streak =
        getCurrentStreak();

    const badges: Badge[] = [
        {
            id: "first-task",
            title: "First Step",
            description:
                "Complete your first task.",
            icon: "star",
            unlocked: totalCompleted >= 1,
            current: totalCompleted,
            target: 1,
        },
        {
            id: "five-tasks",
            title: "Getting Things Done",
            description:
                "Complete 5 tasks in a single day.",
            icon: "zap",
            unlocked: bestDaily >= 5,
            current: Math.min(bestDaily, 5),
            target: 5,
            best: bestDaily,
            recordLabel: `${bestDaily} tasks in one day`,
        },
        {
            id: "morning-five",
            title: "Early Momentum",
            description:
                "Complete 5 tasks before noon.",
            icon: "flame",
            unlocked: bestMorning >= 5,
            current: Math.min(bestMorning, 5),
            target: 5,
            best: bestMorning,
            recordLabel:
                `${bestMorning} tasks before noon`,
        },
        {
            id: "ten-tasks",
            title: "Power Day",
            description:
                "Complete 10 tasks in a single day.",
            icon: "trophy",
            unlocked: bestDaily >= 10,
            current: Math.min(bestDaily, 10),
            target: 10,
            best: bestDaily,
            recordLabel: `${bestDaily} tasks in one day`,
        },
        {
            id: "three-day-streak",
            title: "On a Roll",
            description:
                "Complete at least one task for 3 days in a row.",
            icon: "flame",
            unlocked: streak >= 3,
            current: Math.min(streak, 3),
            target: 3,
        },
        {
            id: "five-day-streak",
            title: "Consistency",
            description:
                "Keep a task completion streak for 5 days.",
            icon: "flame",
            unlocked: streak >= 5,
            current: Math.min(streak, 5),
            target: 5,
        },
        {
            id: "five-assignments",
            title: "Deadline Defender",
            description:
                "Complete 5 assignments.",
            icon: "trophy",
            unlocked: totalAssignments >= 5,
            current: Math.min(
                totalAssignments,
                5
            ),
            target: 5,
        },
        {
            id: "ten-notes",
            title: "Second Brain",
            description:
                "Create 10 notes.",
            icon: "star",
            unlocked: totalNotes >= 10,
            current: Math.min(totalNotes, 10),
            target: 10,
        },
        {
            id: "ten-reminders",
            title: "Never Forget",
            description:
                "Complete 10 reminders.",
            icon: "zap",
            unlocked: totalReminders >= 10,
            current: Math.min(
                totalReminders,
                10
            ),
            target: 10,
        },
    ];

    const unlockedCount =
        badges.filter(
            (badge) => badge.unlocked
        ).length;

    const completion =
        Math.round(
            (unlockedCount / badges.length) *
            100
        );

    return (
        <main className="achievements-page">
            <header className="achievements-header">
                <div className="achievements-title-area">
                    <button
                        className="back-button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <p className="card-label">
                            NOMA
                        </p>

                        <h1>Achievements</h1>
                    </div>
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        setRefreshKey((value) =>
                            value + 1
                        )
                    }
                >
                    Refresh progress
                </button>
            </header>

            <section className="achievement-hero">
                <div className="achievement-hero-icon">
                    <Trophy size={28} />
                </div>

                <div className="achievement-hero-copy">
                    <p className="card-label">
                        YOUR PROGRESS
                    </p>

                    <h2>
                        {unlockedCount} of{" "}
                        {badges.length} badges unlocked
                    </h2>

                    <p>
                        NOMA remembers your progress,
                        not just today's numbers.
                    </p>
                </div>

                <div className="achievement-progress">
                    <strong>{completion}%</strong>

                    <div className="achievement-progress-track">
                        <div
                            style={{
                                width: `${completion}%`,
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="achievement-stats">
                <div>
                    <span>Tasks completed</span>
                    <strong>{totalCompleted}</strong>
                </div>

                <div>
                    <span>Best day</span>
                    <strong>{bestDaily}</strong>
                </div>

                <div>
                    <span>Morning record</span>
                    <strong>{bestMorning}</strong>
                </div>

                <div>
                    <span>Current streak</span>
                    <strong>{streak}</strong>
                </div>
            </section>

            <section className="achievement-section">
                <div className="section-heading">
                    <div>
                        <p className="card-label">
                            BADGES
                        </p>

                        <h2>Your collection</h2>
                    </div>
                </div>

                <div className="badges-grid">
                    {badges.map((badge) => {
                        const Icon =
                            iconMap[badge.icon];

                        const progress =
                            Math.min(
                                100,
                                Math.round(
                                    (badge.current /
                                        badge.target) *
                                    100
                                )
                            );

                        return (
                            <article
                                className={`badge-card ${badge.unlocked
                                        ? "unlocked"
                                        : "locked"
                                    }`}
                                key={badge.id}
                            >
                                <div className="badge-icon">
                                    {badge.unlocked ? (
                                        <Icon size={24} />
                                    ) : (
                                        <Lock size={21} />
                                    )}
                                </div>

                                <div className="badge-content">
                                    <div className="badge-title-row">
                                        <h3>
                                            {badge.title}
                                        </h3>

                                        {badge.unlocked && (
                                            <span>
                                                Unlocked
                                            </span>
                                        )}
                                    </div>

                                    <p>
                                        {badge.description}
                                    </p>

                                    {!badge.unlocked && (
                                        <div className="badge-progress">
                                            <div>
                                                <span>
                                                    {badge.current}/
                                                    {badge.target}
                                                </span>
                                            </div>

                                            <div className="badge-track">
                                                <div
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {badge.unlocked &&
                                        badge.recordLabel && (
                                            <div className="badge-record">
                                                Personal best ·{" "}
                                                {badge.recordLabel}
                                            </div>
                                        )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}