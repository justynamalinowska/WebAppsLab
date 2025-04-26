import { ITask } from "./Task.type";
import "./ProjectModal.style.css"; 

type TaskModalProps = {
  task: ITask;
  onClose: () => void;
};

const TaskModal = ({ task, onClose }: TaskModalProps) => {
  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <h3>{task.name}</h3>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Estimated Time:</strong> {task.estimatedTime} hours</p>
        <p><strong>Status:</strong> {task.status}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;