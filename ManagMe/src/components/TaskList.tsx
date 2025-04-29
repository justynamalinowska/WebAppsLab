import { ITask } from "./Task.type";
import { IStory } from "./Story.type";
import "./TaskList.style.css";
import { useState } from "react";
import TaskModal from "./TaskModal";

type Props = {
  story: IStory;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (task: ITask) => void;
  onBackBtnClickHnd: () => void;
  onAddTask: () => void;
  onShowDetails: (task: ITask) => void;
};

const TaskList = ({ story, onEditTask, onDeleteTask, onBackBtnClickHnd, onAddTask }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const handleShowDetails = (task: ITask) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setShowModal(false);
    };

    const filteredTasks = story.tasks || []; // Korzystaj z story.tasks

    return (
        <div className="task-list-container">
            <div className="tasks-header">
                <h2>Tasks for Story: {story.title}</h2>
                <div className="task-actions">
                    <button onClick={onBackBtnClickHnd}>Back</button>
                    <button onClick={onAddTask}>Add Task</button>
                </div>
            </div>
            <table className="styled-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Priority</th>
      <th>Status</th>
      <th>Assigned User</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredTasks.map(task => (
      <tr key={task.id}>
        <td>{task.name}</td>
        <td>{task.priority}</td>
        <td>{task.status}</td>
        <td>{task.assignedUserId || "Unassigned"}</td>
        <td>
          <button onClick={() => onEditTask(task)}>Edit</button>
          <button onClick={() => onDeleteTask(task)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            {filteredTasks.length === 0 && <p>No tasks available.</p>}
            {showModal && selectedTask && (
                <TaskModal task={selectedTask} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default TaskList;