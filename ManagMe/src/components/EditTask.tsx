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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      ...task,
      name,
      description,
      priority,
      estimatedTime,
    });
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