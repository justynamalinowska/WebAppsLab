import React, { useState } from "react";
import { ITask } from "./Task.type";
import "./TaskList.style.css";

type Props = {
  storyId: number;
  onAdd: (task: ITask) => void;
  onBackBtnClickHnd: () => void;
};

const AddTask = ({ storyId, onAdd, onBackBtnClickHnd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [estimatedTime, setEstimatedTime] = useState(1);
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(undefined);
  const [assignedUserRole, setAssignedUserRole] = useState<"devops" | "developer" | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: ITask = {
      id: 0,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      status,
      createdAt: new Date(),
      ...(status === "doing" && { startedAt: new Date(), assignedUserId, assignedUserRole }),
      ...(status === "done" && { completedAt: new Date(), assignedUserId, assignedUserRole }),
    };
    onAdd(newTask);
  };

  return (
    <div className="task-form-container">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          required
        />
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="estimatedTime">Estimated Time (hours)</label>
        <input
          id="estimatedTime"
          type="number"
          min={1}
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(Number(e.target.value))}
          placeholder="Enter estimated time"
          required
        />
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "todo" | "doing" | "done")}
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        {(status === "doing" || status === "done") && (
          <>
            <label htmlFor="assignedUserId">Assigned User ID</label>
            <input
              id="assignedUserId"
              type="text"
              value={assignedUserId || ""}
              onChange={(e) => setAssignedUserId(e.target.value)}
              placeholder="Enter user ID"
              required
            />
            <label htmlFor="assignedUserRole">Assigned User Role</label>
            <select
              id="assignedUserRole"
              value={assignedUserRole || ""}
              onChange={(e) => setAssignedUserRole(e.target.value as "devops" | "developer")}
              required
            >
              <option value="">Select Role</option>
              <option value="devops">DevOps</option>
              <option value="developer">Developer</option>
            </select>
          </>
        )}
        <div className="add-project-buttons">
          <button type="button" onClick={onBackBtnClickHnd}>
            Back
          </button>
          <button type="submit">Add Task</button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;