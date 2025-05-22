import { useEffect, useState } from "react";
import "./KanbanBoard.style.css";
import { ITask } from "./Task.type";
import Api from "./Api";
import TaskModal from "./TaskModal";
import AddTask from "./AddTask";
import { IStory } from "./Story.type";

type Props = {
  story: IStory;        
  onBack: () => void;    
  onAdd: () => void;

};

const KanbanBoard = ({ story, onBack}: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const load = async () => {
    setTasks(await Api.getTasksByStory(story.id));
  };

  useEffect(() => {
    load();
  }, [story.id]);

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => { setShowAdd(false); load(); };

  const openDetails = (task: ITask) => {
    setSelectedTask(task);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTask(null);
    load();
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>Kanban Board for {story.title}</h2>
        <button onClick={onBack}>Back</button>
        <button onClick={openAdd}>Add Task</button>
      </div>

      {showAdd && (
        <AddTask
          storyId={story.id}
          onBackBtnClickHnd={closeAdd}
          onSubmitClickHnd={async t => {
            await Api.addTask(t);
            closeAdd();
          }}
        />
      )}

      <div className="kanban-board">
        {["todo", "doing", "done"].map(state => (
          <div key={state} className="kanban-column">
            <h3>{state.charAt(0).toUpperCase() + state.slice(1)}</h3>
            {tasks
              .filter(t => t.state === state)
              .map(t => (
                <div
                  key={t.id}
                  className="task-card"
                  onClick={() => openDetails(t)}
                >
                  {t.name}
                </div>
              ))}
          </div>
        ))}
      </div>

      {showDetails && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeDetails}
          onUpdate={async upd => {
            await Api.updateTask(upd);
            closeDetails();
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
