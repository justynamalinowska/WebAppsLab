import { IProject } from "./Project.type";
import { ITask } from "./Task.type";

class Api {
  // --- Projects ------------------------------------------------------------
  static async getProjects(): Promise<IProject[]> {
    const projectsJSON = window.localStorage.getItem("projects");
    return projectsJSON ? JSON.parse(projectsJSON) : [];
  }

  static async getCurrentProject(): Promise<IProject | null> {
    const proj = window.localStorage.getItem("currentProject");
    return proj ? JSON.parse(proj) : null;
  }

  static async setCurrentProject(project: IProject): Promise<void> {
    window.localStorage.setItem("currentProject", JSON.stringify(project));
  }

  // --- Stories -------------------------------------------------------------
  // (tu Twoje istniejące metody dla StoryList / AddStory / EditStory)

  // --- Tasks ---------------------------------------------------------------
  static async getTasks(): Promise<ITask[]> {
    const tasksJSON = window.localStorage.getItem("tasks");
    const raw = tasksJSON ? JSON.parse(tasksJSON) : [];
    return raw.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      startDate: t.startDate ? new Date(t.startDate) : undefined,
      endDate: t.endDate ? new Date(t.endDate) : undefined,
    }));
  }

  static async addTask(task: ITask): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static async updateTask(updated: ITask): Promise<void> {
    let tasks = await this.getTasks();
    tasks = tasks.map(t => (t.id === updated.id ? updated : t));
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static async deleteTask(id: number): Promise<void> {
    const tasks = (await this.getTasks()).filter(t => t.id !== id);
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

export default Api;
