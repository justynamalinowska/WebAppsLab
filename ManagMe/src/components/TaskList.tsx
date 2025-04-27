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

const TaskList = ({ story, tasks, onEditTask, onDeleteTask, onBackBtnClickHnd, onAddTask }: Props) => {
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

  const filteredTasks = tasks.filter(task => task.storyId === story.id); // Filtruj zadania dla wybranego story

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
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Estimated Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredTasks.map(task => (
                    <tr key={task.id}>
                        <td>{task.name}</td>
                        <td>{task.description}</td>
                        <td>{task.priority}</td>
                        <td>{task.estimatedTime} hours</td>
                        <td>{task.status}</td>
                        <td>
                            <div className="action-buttons">
                                <button onClick={() => handleShowDetails(task)}>Details</button>
                                <button onClick={() => onEditTask(task)}>Edit</button>
                                <button onClick={() => onDeleteTask(task)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredTasks.length === 0 && <p>No tasks available for this story.</p>}
        {showModal && selectedTask && (
            <TaskModal task={selectedTask} onClose={handleCloseModal} />
        )}
    </div>
);
}

export default TaskList;