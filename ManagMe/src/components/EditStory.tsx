import "./Project.Form.style.css";
import React, { useState } from "react";
import { IStory } from "./Story.type";
import { IProject } from "./Project.type";

type Props = {
    project: IProject | null;
    userId: string | null;
    onBackBtnClickHnd: () => void;
    onSubmitClickHnd: (data: IStory) => void;
};

const AddStory: React.FC<Props> = ({ project, userId, onBackBtnClickHnd, onSubmitClickHnd }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

    const onTitleChangeHnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const onDescriptionChangeHnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const onPriorityChangeHnd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPriority(e.target.value as "low" | "medium" | "high");
    };

    const onStatusChangeHnd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as "todo" | "doing" | "done");
    };

    const onSubmitBtnClickHnd = (e: React.FormEvent) => {
        e.preventDefault();
        if (project) {
            const newStory: IStory = {
                id: 0,
                title,
                description,
                priority,
                status,
                projectId: project.id,
                ownerId: userId,
                createdAt: new Date()
            };
            onSubmitClickHnd(newStory);
            onBackBtnClickHnd();
        }
    };

    return (
        <div className="form-container">
            <h2>Add Story</h2>
            <form onSubmit={onSubmitBtnClickHnd}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={title} onChange={onTitleChangeHnd} />
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={description} onChange={onDescriptionChangeHnd} />
                </div>
                <div>
                    <label>Priority</label>
                    <select name="priority" value={priority} onChange={onPriorityChangeHnd}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={status} onChange={onStatusChangeHnd}>
                        <option value="todo">To Do</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="add-project-buttons">
                    <input type="button" value="Back" onClick={onBackBtnClickHnd} />
                    <input type="submit" value="Add Story" />
                </div>
            </form>
        </div>
    );
};

export default AddStory;