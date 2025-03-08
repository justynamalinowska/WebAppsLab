export interface IStory {
    id: string;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    projectId: number;
    createdAt: Date;
    status: "todo" | "doing" | "done";
    ownerId: string;
  }