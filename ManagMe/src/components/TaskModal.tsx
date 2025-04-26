import { ITask } from "./Task.type";
import "./TaskModal.style.css"; 

type TaskModalProps = {
  task: ITask;
  onClose: () => void;
};

const TaskModal = ({ task, onClose }: TaskModalProps) => {
  return (
    <div id="myModal" className="modal">
        <div className="modal-content">
        <h3>{task.name}</h3>
        <p>Description:{task.description}</p>
        <p>Priority:{task.priority}</p>
        <p>Estimated Time:{task.estimatedTime} hours</p>
        <p>Status:{task.status}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;