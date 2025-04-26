import { IProject } from "./Project.type";
import { IStory } from "./Story.type";
import { ITask } from "./Task.type";

class Api {
  static async getProjects(): Promise<IProject[]> {
    const projectsListInString = window.localStorage.getItem("projects");
    return projectsListInString ? JSON.parse(projectsListInString) : [];
  }

  static async getCurrentProject(): Promise<IProject | null> {
    const currentProject = window.localStorage.getItem("currentProject");
    return currentProject ? JSON.parse(currentProject) : null;
  }

  static async setCurrentProject(project: IProject): Promise<void> {
    window.localStorage.setItem("currentProject", JSON.stringify(project));
  }

  static async getTasks(): Promise<ITask[]> {
    const tasksListInString = window.localStorage.getItem("tasks");
    return tasksListInString ? JSON.parse(tasksListInString) : [];
  }

  static async setTasks(tasks: ITask[]): Promise<void> {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static async getCurrentStory(): Promise<IStory | null> {
    const currentStory = window.localStorage.getItem("currentStory");
    return currentStory ? JSON.parse(currentStory) : null;
  }

  static async setCurrentStory(story: IStory): Promise<void> {
    window.localStorage.setItem("currentStory", JSON.stringify(story));
  }

  static async clearCurrentStory(): Promise<void> {
    window.localStorage.removeItem("currentStory");
  }
}

export default Api;