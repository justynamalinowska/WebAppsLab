import React, { useState } from "react";
import { ITask } from "./Task.type";

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
    <form onSubmit={handleSubmit}>
      <h3>Edit Task</h3>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      <select value={priority} onChange={e => setPriority(e.target.value as any)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="number"
        min={1}
        value={estimatedTime}
        onChange={e => setEstimatedTime(Number(e.target.value))}
        required
      />
      <button type="button" onClick={onBackBtnClickHnd}>Back</button>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditTask;
