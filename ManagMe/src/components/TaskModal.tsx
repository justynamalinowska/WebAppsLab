import { useState } from "react";
import "./ProjectModal.style.css";
import { ITask } from "./Task.type";
import users from "./UserList";
import IUser from "./User.type";

type Props = {
  task: ITask;
  onClose: () => void;
  onUpdate: (task: ITask) => void;
};

const TaskModal = ({ task, onClose, onUpdate }: Props) => {
  const [assignedId, setAssignedId] = useState(task.ownerId || "");

  const assignAndStart = () => {
    if (!assignedId) return;
    onUpdate({
      ...task,
      ownerId: assignedId,
      state: "doing",
      startDate: new Date(),
    });
  };

  const markDone = () => {
    onUpdate({
      ...task,
      state: "done",
      endDate: new Date(),
    });
  };

  const assignedUser = users.find(u => u.id === Number(assignedId)) as IUser;

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <h3>{task.name}</h3>
        <p>{task.description}</p>
        <p>Priority: {task.priority}</p>
        <p>Estimated Hours: {task.estimatedHours}</p>
        <p>State: {task.state}</p>
        <p>Created At: {task.createdAt.toLocaleString()}</p>
        {task.startDate && <p>Start Date: {task.startDate.toLocaleString()}</p>}
        {task.endDate && <p>End Date: {task.endDate.toLocaleString()}</p>}
        <p>
          Assigned To:{" "}
          {assignedUser
            ? `${assignedUser.username}`
            : "-"}
        </p>

        {task.state === "todo" && (
          <>
            <label>Assign To:</label>
            <select
              value={assignedId}
              onChange={e => setAssignedId(e.target.value)}
            >
              <option value="">-- select --</option>
              {users
                .filter(u => u.Role === "Developer" || u.Role === "DevOps")
                .map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username}({u.Role})
                  </option>
                ))}
            </select>
            <button onClick={assignAndStart}>Assign & Start</button>
          </>
        )}

        {task.state === "doing" && (
          <button onClick={markDone}>Mark as Done</button>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;
