import { useEffect, useState } from "react";
import "./KanbanBoard.style.css";
import { ITask } from "./Task.type";
import Api from "./Api";
import TaskModal from "./TaskModal";

interface Props {
    storyId: number;
    onBack: () => void;
    onAdd: () => void;
    onEdit: (t: ITask) => void;
  }

const KanbanBoard = ({ onBack, onAdd }: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<ITask | null>(null);

  const load = async () => {
    const all = await Api.getTasks();
    setTasks(all);
  };

  useEffect(() => {
    load();
  }, []);

  const openDetails = (t: ITask) => {
    setSelected(t);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    load();
  };

  const renderColumn = (title: string, state: ITask["state"]) => (
    <div className="kanban-column">
      <h3>{title}</h3>
      {tasks
        .filter((t) => t.state === state)
        .map((t) => (
          <div key={t.id} className="task-card" onClick={() => openDetails(t)}>
            {t.name}
          </div>
        ))}
    </div>
  );

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>Kanban board for ...</h2>
        <button onClick={onBack}>Back</button>
        <button onClick={onAdd}>Add Task</button>
      </div>
      <div className="kanban-board">
        {renderColumn("To Do", "todo")}
        {renderColumn("Doing", "doing")}
        {renderColumn("Done", "done")}
      </div>
      {showModal && selected && (
        <TaskModal
          task={selected}
          onClose={closeModal}
          onUpdate={async (upd) => {
            await Api.updateTask(upd);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
