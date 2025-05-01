export interface ITask {
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    storyId: number;
    estimatedHours: number;
    state: "todo" | "doing" | "done";
    createdAt: Date;
    startDate?: Date;
    endDate?: Date;
    ownerId?: string;
  }
  