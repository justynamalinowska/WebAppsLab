import React, { useState } from "react";
import { ITask } from "./Task.type";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(), // analogicznie do id: 0 w AddStory, tu tymczasowo Date.now
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      status: "todo",
      createdAt: new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Task</h3>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
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
        placeholder="Estimated time"
        required
      />
      <button type="button" onClick={onBackBtnClickHnd}>Back</button>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTask;
