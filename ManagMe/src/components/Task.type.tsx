export interface ITask {
  id: number;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyId: number;
  estimatedTime: number;
  status: "todo" | "doing" | "done";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  assignedUserId?: string;
  assignedUserRole?: "devops" | "developer";
}
