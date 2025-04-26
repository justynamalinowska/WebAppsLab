import { IProject } from "./Project.type";
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
}

export default Api;