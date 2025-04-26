import React, { useState } from "react";
import { ITask } from "./Task.type";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import TaskDetails from "./TaskDetails";
import { IStory } from "./Story.type";

type Props = {
  story: IStory;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (task: ITask) => void;
  onShowDetails: (task: ITask) => void;
  onBackBtnClickHnd: () => void;
};

const TaskList = ({ story, tasks, setTasks, onEditTask, onDeleteTask, onShowDetails, onBackBtnClickHnd }: Props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);
  const [detailsTask, setDetailsTask] = useState<ITask | null>(null);

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <button onClick={onBackBtnClickHnd}>Back to Stories</button>
      <h2>Tasks for Story {story.title}</h2>
      <button onClick={() => setShowAdd(true)}>Add Task</button>
      <ul>
        {tasks.filter(task => task.storyId === story.id).map(task => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => setDetailsTask(task)}>Details</button>
            <button onClick={() => setEditTask(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showAdd && (
        <AddTask
          storyId={story.id}
          onAdd={task => {
            setTasks([...tasks, task]);
            setShowAdd(false);
          }}
          onBackBtnClickHnd={() => setShowAdd(false)}
        />
      )}
      {editTask && (
        <EditTask
          task={editTask}
          onEdit={task => {
            setTasks(tasks.map(t => t.id === task.id ? task : t));
            setEditTask(null);
          }}
          onBackBtnClickHnd={() => setEditTask(null)}
        />
      )}
      {detailsTask && (
        <TaskDetails
          task={detailsTask}
          onBackBtnClickHnd={() => setDetailsTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
