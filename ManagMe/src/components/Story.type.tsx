import { ITask } from "./Task.type";

export interface IStory {
    id: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    projectId: number;
    createdAt: Date;
    status: "todo" | "doing" | "done";
    ownerId: string;
    tasks: ITask[];
  }