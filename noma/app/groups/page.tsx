"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    Clipboard,
    Copy,
    Link2,
    LogOut,
    MoreHorizontal,
    Plus,
    UserPlus,
    Users,
    X,
} from "lucide-react";

type Member = {
    id: string;
    name: string;
    initials: string;
    role: "Owner" | "Member";
};

type GroupTask = {
    id: string;
    title: string;
    assignedTo: string;
    completed: boolean;
};

type Group = {
    id: string;
    name: string;
    description: string;
    inviteCode: string;
    createdAt: string;
    members: Member[];
    tasks: GroupTask[];
};

const GROUPS_KEY = "noma_groups";

const currentUser: Member = {
    id: "me",
    name: "You",
    initials: "N",
    role: "Owner",
};

const demoGroup: Group = {
    id: "g1",
    name: "AIoT Project",
    description:
        "FedAirGuard major project team workspace.",
    inviteCode: "NOMA-AIOT-7K2P",
    createdAt: new Date().toISOString(),
    members: [
        currentUser,
        {
            id: "m2",
            name: "Teammate",
            initials: "T",
            role: "Member",
        },
    ],
    tasks: [
        {
            id: "gt1",
            title: "Finalize literature review",
            assignedTo: "You",
            completed: false,
        },
        {
            id: "gt2",
            title: "Prepare presentation",
            assignedTo: "Teammate",
            completed: false,
        },
    ],
};

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] =
        useState<string | null>(null);

    const [showCreate, setShowCreate] =
        useState(false);

    const [showJoin, setShowJoin] =
        useState(false);

    const [showInvite, setShowInvite] =
        useState(false);

    const [showTaskModal, setShowTaskModal] =
        useState(false);

    const [groupName, setGroupName] =
        useState("");

    const [groupDescription, setGroupDescription] =
        useState("");

    const [inviteCode, setInviteCode] =
        useState("");

    const [taskTitle, setTaskTitle] =
        useState("");

    const [taskAssignee, setTaskAssignee] =
        useState("You");

    const [copied, setCopied] =
        useState(false);

    useEffect(() => {
        const stored =
            localStorage.getItem(GROUPS_KEY);

        if (stored) {
            const parsed: Group[] = JSON.parse(stored);

            setGroups(parsed);

            if (parsed.length > 0) {
                setSelectedGroupId(parsed[0].id);
            }
        } else {
            setGroups([demoGroup]);
            setSelectedGroupId(demoGroup.id);

            localStorage.setItem(
                GROUPS_KEY,
                JSON.stringify([demoGroup])
            );
        }
    }, []);

    useEffect(() => {
        if (groups.length > 0) {
            localStorage.setItem(
                GROUPS_KEY,
                JSON.stringify(groups)
            );
        }
    }, [groups]);

    const selectedGroup = useMemo(
        () =>
            groups.find(
                (group) =>
                    group.id === selectedGroupId
            ) ?? null,
        [groups, selectedGroupId]
    );

    function resetCreateForm() {
        setGroupName("");
        setGroupDescription("");
    }

    function createGroup() {
        if (!groupName.trim()) {
            return;
        }

        const code =
            `NOMA-${Math.random()
                .toString(36)
                .substring(2, 6)
                .toUpperCase()}-${Math.random()
                    .toString(36)
                    .substring(2, 6)
                    .toUpperCase()}`;

        const group: Group = {
            id: crypto.randomUUID(),
            name: groupName.trim(),
            description:
                groupDescription.trim(),
            inviteCode: code,
            createdAt:
                new Date().toISOString(),
            members: [
                {
                    ...currentUser,
                    role: "Owner",
                },
            ],
            tasks: [],
        };

        setGroups((current) => [
            group,
            ...current,
        ]);

        setSelectedGroupId(group.id);

        setShowCreate(false);

        resetCreateForm();

        setShowInvite(true);
    }

    function joinGroup() {
        const cleanCode = inviteCode
            .trim()
            .toUpperCase();

        if (!cleanCode) {
            return;
        }

        const existingGroup = groups.find(
            (group) =>
                group.inviteCode.toUpperCase() ===
                cleanCode
        );

        if (existingGroup) {
            setGroups((current) =>
                current.map((group) =>
                    group.id === existingGroup.id
                        ? {
                            ...group,
                            members:
                                group.members.some(
                                    (member) =>
                                        member.id === "me"
                                )
                                    ? group.members
                                    : [
                                        ...group.members,
                                        {
                                            ...currentUser,
                                            role: "Member",
                                        },
                                    ],
                        }
                        : group
                )
            );

            setSelectedGroupId(
                existingGroup.id
            );
        }

        setShowJoin(false);
        setInviteCode("");
    }

    function addGroupTask() {
        if (
            !selectedGroup ||
            !taskTitle.trim()
        ) {
            return;
        }

        const task: GroupTask = {
            id: crypto.randomUUID(),
            title: taskTitle.trim(),
            assignedTo: taskAssignee,
            completed: false,
        };

        setGroups((current) =>
            current.map((group) =>
                group.id === selectedGroup.id
                    ? {
                        ...group,
                        tasks: [
                            ...group.tasks,
                            task,
                        ],
                    }
                    : group
            )
        );

        setTaskTitle("");
        setTaskAssignee("You");
        setShowTaskModal(false);
    }

    function toggleGroupTask(
        taskId: string
    ) {
        if (!selectedGroup) {
            return;
        }

        setGroups((current) =>
            current.map((group) =>
                group.id === selectedGroup.id
                    ? {
                        ...group,
                        tasks: group.tasks.map(
                            (task) =>
                                task.id === taskId
                                    ? {
                                        ...task,
                                        completed:
                                            !task.completed,
                                    }
                                    : task
                        ),
                    }
                    : group
            )
        );
    }

    function deleteGroupTask(
        taskId: string
    ) {
        if (!selectedGroup) {
            return;
        }

        setGroups((current) =>
            current.map((group) =>
                group.id === selectedGroup.id
                    ? {
                        ...group,
                        tasks: group.tasks.filter(
                            (task) =>
                                task.id !== taskId
                        ),
                    }
                    : group
            )
        );
    }

    function leaveGroup() {
        if (!selectedGroup) {
            return;
        }

        setGroups((current) =>
            current.filter(
                (group) =>
                    group.id !== selectedGroup.id
            )
        );

        setSelectedGroupId(null);
    }

    async function copyInviteLink() {
        if (!selectedGroup) {
            return;
        }

        const link =
            `${window.location.origin}/groups?invite=${selectedGroup.inviteCode}`;

        try {
            await navigator.clipboard.writeText(
                link
            );

            setCopied(true);

            setTimeout(
                () => setCopied(false),
                1800
            );
        } catch {
            setCopied(false);
        }
    }

    const completedTasks =
        selectedGroup?.tasks.filter(
            (task) => task.completed
        ).length ?? 0;

    return (
        <main className="groups-page">
            <header className="groups-header">
                <div className="groups-title-area">
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

                        <h1>Groups</h1>
                    </div>
                </div>

                <div className="groups-header-actions">
                    <button
                        className="secondary-button"
                        onClick={() =>
                            setShowJoin(true)
                        }
                    >
                        <UserPlus size={16} />
                        Join
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowCreate(true)
                        }
                    >
                        <Plus size={18} />
                        New group
                    </button>
                </div>
            </header>

            {groups.length === 0 ? (
                <section className="groups-empty">
                    <div className="groups-empty-icon">
                        <Users size={28} />
                    </div>

                    <h2>Create your first group</h2>

                    <p>
                        Work together on projects, assignments
                        and shared tasks.
                    </p>

                    <div className="groups-empty-actions">
                        <button
                            className="primary-button"
                            onClick={() =>
                                setShowCreate(true)
                            }
                        >
                            <Plus size={17} />
                            Create group
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setShowJoin(true)
                            }
                        >
                            <UserPlus size={17} />
                            Join with invite
                        </button>
                    </div>
                </section>
            ) : (
                <section className="groups-layout">
                    <aside className="groups-sidebar">
                        <div className="groups-sidebar-heading">
                            <span>Your groups</span>

                            <button
                                className="small-icon-button"
                                onClick={() =>
                                    setShowCreate(true)
                                }
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="group-list">
                            {groups.map((group) => (
                                <button
                                    key={group.id}
                                    className={
                                        selectedGroupId ===
                                            group.id
                                            ? "group-list-item active"
                                            : "group-list-item"
                                    }
                                    onClick={() =>
                                        setSelectedGroupId(
                                            group.id
                                        )
                                    }
                                >
                                    <div className="group-avatar">
                                        {group.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {group.name}
                                        </strong>

                                        <span>
                                            {group.members.length}{" "}
                                            members
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {selectedGroup && (
                        <section className="group-workspace">
                            <header className="group-workspace-header">
                                <div>
                                    <p className="card-label">
                                        GROUP
                                    </p>

                                    <h2>
                                        {selectedGroup.name}
                                    </h2>

                                    {selectedGroup.description && (
                                        <p>
                                            {
                                                selectedGroup.description
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="group-workspace-actions">
                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            setShowInvite(true)
                                        }
                                    >
                                        <Link2 size={16} />
                                        Invite
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={leaveGroup}
                                    >
                                        <LogOut size={17} />
                                    </button>
                                </div>
                            </header>

                            <div className="group-stats">
                                <div>
                                    <span>Members</span>

                                    <strong>
                                        {
                                            selectedGroup.members
                                                .length
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>Tasks</span>

                                    <strong>
                                        {selectedGroup.tasks.length}
                                    </strong>
                                </div>

                                <div>
                                    <span>Completed</span>

                                    <strong>
                                        {completedTasks}
                                    </strong>
                                </div>
                            </div>

                            <div className="group-content-grid">
                                <section className="shared-tasks-card">
                                    <header className="group-section-header">
                                        <div>
                                            <p className="card-label">
                                                WORKSPACE
                                            </p>

                                            <h3>
                                                Shared tasks
                                            </h3>
                                        </div>

                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                setShowTaskModal(true)
                                            }
                                        >
                                            <Plus size={16} />
                                            Add task
                                        </button>
                                    </header>

                                    {selectedGroup.tasks.length ===
                                        0 ? (
                                        <div className="group-no-tasks">
                                            <Check size={23} />

                                            <p>
                                                No shared tasks yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="shared-task-list">
                                            {selectedGroup.tasks.map(
                                                (task) => (
                                                    <article
                                                        className={
                                                            task.completed
                                                                ? "shared-task completed"
                                                                : "shared-task"
                                                        }
                                                        key={task.id}
                                                    >
                                                        <button
                                                            className={
                                                                task.completed
                                                                    ? "shared-task-check checked"
                                                                    : "shared-task-check"
                                                            }
                                                            onClick={() =>
                                                                toggleGroupTask(
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            {task.completed && (
                                                                <Check
                                                                    size={14}
                                                                />
                                                            )}
                                                        </button>

                                                        <div>
                                                            <h4>
                                                                {task.title}
                                                            </h4>

                                                            <span>
                                                                Assigned to{" "}
                                                                {task.assignedTo}
                                                            </span>
                                                        </div>

                                                        <button
                                                            className="more-button"
                                                            onClick={() =>
                                                                deleteGroupTask(
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            <MoreHorizontal
                                                                size={18}
                                                            />
                                                        </button>
                                                    </article>
                                                )
                                            )}
                                        </div>
                                    )}
                                </section>

                                <aside className="members-card">
                                    <header className="group-section-header">
                                        <div>
                                            <p className="card-label">
                                                TEAM
                                            </p>

                                            <h3>Members</h3>
                                        </div>

                                        <button
                                            className="small-icon-button"
                                            onClick={() =>
                                                setShowInvite(true)
                                            }
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                    </header>

                                    <div className="member-list">
                                        {selectedGroup.members.map(
                                            (member) => (
                                                <div
                                                    className="member-item"
                                                    key={member.id}
                                                >
                                                    <div className="member-avatar">
                                                        {member.initials}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {member.name}
                                                        </strong>

                                                        <span>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </aside>
                            </div>
                        </section>
                    )}
                </section>
            )}

            {showCreate && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowCreate(false)
                    }
                >
                    <div
                        className="group-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    NEW GROUP
                                </p>

                                <h2>
                                    Create a workspace
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowCreate(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Group name</label>

                            <input
                                autoFocus
                                value={groupName}
                                onChange={(event) =>
                                    setGroupName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. AIoT Project"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>

                            <textarea
                                value={groupDescription}
                                onChange={(event) =>
                                    setGroupDescription(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="What is this group for?"
                            />
                        </div>

                        <button
                            className="primary-button full"
                            onClick={createGroup}
                        >
                            <Plus size={17} />
                            Create group
                        </button>
                    </div>
                </div>
            )}

            {showJoin && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowJoin(false)
                    }
                >
                    <div
                        className="group-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    JOIN GROUP
                                </p>

                                <h2>
                                    Enter an invite code
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowJoin(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="invite-input">
                            <Clipboard size={17} />

                            <input
                                autoFocus
                                value={inviteCode}
                                onChange={(event) =>
                                    setInviteCode(
                                        event.target.value
                                    )
                                }
                                placeholder="NOMA-XXXX-XXXX"
                            />
                        </div>

                        <p className="modal-help">
                            Paste an invite code from another
                            NOMA group.
                        </p>

                        <button
                            className="primary-button full"
                            onClick={joinGroup}
                        >
                            <UserPlus size={17} />
                            Join group
                        </button>
                    </div>
                </div>
            )}

            {showInvite && selectedGroup && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowInvite(false)
                    }
                >
                    <div
                        className="group-modal invite-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    INVITE
                                </p>

                                <h2>
                                    Invite teammates
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowInvite(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="invite-visual">
                            <Link2 size={25} />
                        </div>

                        <p>
                            Share this link with your teammates.
                            Anyone with the link can join this
                            group.
                        </p>

                        <div className="invite-code-box">
                            <span>
                                {selectedGroup.inviteCode}
                            </span>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={copyInviteLink}
                        >
                            {copied ? (
                                <>
                                    <Check size={17} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={17} />
                                    Copy invite link
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {showTaskModal && selectedGroup && (
                <div
                    className="modal-backdrop"
                    onMouseDown={() =>
                        setShowTaskModal(false)
                    }
                >
                    <div
                        className="group-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <header className="modal-header">
                            <div>
                                <p className="card-label">
                                    SHARED TASK
                                </p>

                                <h2>
                                    Add a team task
                                </h2>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowTaskModal(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="form-field">
                            <label>Task</label>

                            <input
                                autoFocus
                                value={taskTitle}
                                onChange={(event) =>
                                    setTaskTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="What needs to be done?"
                            />
                        </div>

                        <div className="form-field">
                            <label>Assign to</label>

                            <select
                                value={taskAssignee}
                                onChange={(event) =>
                                    setTaskAssignee(
                                        event.target.value
                                    )
                                }
                            >
                                {selectedGroup.members.map(
                                    (member) => (
                                        <option
                                            key={member.id}
                                            value={member.name}
                                        >
                                            {member.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <button
                            className="primary-button full"
                            onClick={addGroupTask}
                        >
                            <Check size={17} />
                            Add shared task
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}