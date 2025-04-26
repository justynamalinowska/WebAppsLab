import React from "react";
import { ITask } from "./Task.type";

type Props = {
  task: ITask;
  onBackBtnClickHnd: () => void;
};

const TaskDetails = ({ task, onBackBtnClickHnd }: Props) => (
  <div>
    <button onClick={onBackBtnClickHnd}>Back</button>
    <h3>Task Details</h3>
    <p><strong>Name:</strong> {task.name}</p>
    <p><strong>Description:</strong> {task.description}</p>
    <p><strong>Priority:</strong> {task.priority}</p>
    <p><strong>Estimated time:</strong> {task.estimatedTime}</p>
    <p><strong>Status:</strong> {task.status}</p>
  </div>
);

export default TaskDetails;
