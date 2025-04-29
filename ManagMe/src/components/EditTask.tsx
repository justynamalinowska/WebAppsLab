import React, { useState } from "react";
import { ITask } from "./Task.type";
import "./TaskList.style.css";

type Props = {
  task: ITask;
  onEdit: (task: ITask) => void;
  onBackBtnClickHnd: () => void;
};

const EditTask = ({ task, onEdit, onBackBtnClickHnd }: Props) => {
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime);
    const [status, setStatus] = useState(task.status);
    const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId || "");
    const [assignedUserRole, setAssignedUserRole] = useState(task.assignedUserRole || "");
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      
        // Walidacja wartości assignedUserRole
        const validAssignedUserRole =
          assignedUserRole === "devops" || assignedUserRole === "developer"
            ? assignedUserRole
            : undefined;
      
        const updatedTask: ITask = {
          ...task,
          name,
          description,
          priority,
          estimatedTime,
          status,
          ...(status === "doing" && { startedAt: task.startedAt || new Date(), assignedUserId, assignedUserRole: validAssignedUserRole }),
          ...(status === "done" && { completedAt: task.completedAt || new Date(), assignedUserId, assignedUserRole: validAssignedUserRole }),
        };
      
        onEdit(updatedTask);
      };
  
    return (
      <div className="task-form-container">
        <h2>Edit Task</h2>
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

{/* Wyświetl dodatkowe pola, jeśli status to "doing" lub "done" */}
{(status === "doing" || status === "done") && (
  <>
    <label htmlFor="assignedUserId">Assigned User ID</label>
    <input
      id="assignedUserId"
      type="text"
      value={assignedUserId}
      onChange={(e) => setAssignedUserId(e.target.value)}
      placeholder="Enter user ID"
      required
    />
    <label htmlFor="assignedUserRole">Assigned User Role</label>
    <select
      id="assignedUserRole"
      value={assignedUserRole}
      onChange={(e) => setAssignedUserRole(e.target.value as "devops" | "developer")}
      required
    >
      <option value="devops">DevOps</option>
      <option value="developer">Developer</option>
    </select>
  </>
)}
          <div className="add-project-buttons">
            <button type="button" onClick={onBackBtnClickHnd}>
              Back
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    );
  };

export default EditTask;