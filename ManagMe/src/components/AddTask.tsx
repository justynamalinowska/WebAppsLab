import React, { useState } from "react";
import "./Project.Form.style.css"; 
import { ITask } from "./Task.type";

type Props = {
  storyId: number;
  onBackBtnClickHnd: () => void;
  onSubmitClickHnd: (task: ITask) => void;
};

const AddTask = ({ storyId, onBackBtnClickHnd, onSubmitClickHnd }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low"|"medium"|"high">("low");
  const [estimatedHours, setEstimatedHours] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: ITask = {
      id: Date.now(),
      name,
      description,
      priority,
      storyId,
      estimatedHours,
      state: "todo",
      createdAt: new Date(),
    };
    onSubmitClickHnd(newTask);
  };

  return (
    <div className="form-container">
      <h2>Add Task</h2>
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
          <button type="submit">Add Task</button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
