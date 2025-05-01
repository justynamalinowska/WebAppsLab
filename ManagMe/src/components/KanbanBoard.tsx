// src/components/KanbanBoard.tsx
import React, { useEffect, useState } from "react";
import "./KanbanBoard.style.css";
import { ITask } from "./Task.type";
import Api from "./Api";
import TaskModal from "./TaskModal";
import AddTask from "./AddTask";

type Props = {
  storyId: number;        // ID bieżącej story
  onBack: () => void;     // powrót do listy stories
  onEdit: (task: ITask) => void; // opcjonalnie do EditTask
  onAdd: () => void;
};

const KanbanBoard = ({ storyId, onBack, onEdit }: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const load = async () => {
    setTasks(await Api.getTasksByStory(storyId));
  };

  useEffect(() => {
    load();
  }, [storyId]);

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
        <h2>Kanban Board</h2>
        <button onClick={onBack}>Back</button>
        <button onClick={openAdd}>Add Task</button>
      </div>

      {showAdd && (
        <AddTask
          storyId={storyId}
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
            // jeśli potrzebujesz edycji pól, możesz tu również przekazać onEdit
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
