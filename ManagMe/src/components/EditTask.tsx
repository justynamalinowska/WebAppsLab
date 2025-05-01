import React, { useState } from "react";
import "./Project.Form.style.css";
import { ITask } from "./Task.type";

type Props = {
  data: ITask;
  onBackBtnClickHnd: () => void;
  onUpdateClickHnd: (task: ITask) => void;
};

const EditTask = ({ data, onBackBtnClickHnd, onUpdateClickHnd }: Props) => {
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [priority, setPriority] = useState(data.priority);
  const [estimatedHours, setEstimatedHours] = useState(data.estimatedHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ITask = {
      ...data,
      name,
      description,
      priority,
      estimatedHours,
    };
    onUpdateClickHnd(updated);
  };

  return (
    <div className="form-container">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label>Priority:</label>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as any)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Estimated Hours:</label>
        <input
          type="number"
          min={0}
          value={estimatedHours}
          onChange={e => setEstimatedHours(+e.target.value)}
        />

        <div className="form-actions">
          <button type="button" onClick={onBackBtnClickHnd}>Back</button>
          <button type="submit">Update Task</button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
