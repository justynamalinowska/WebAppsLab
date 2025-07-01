import FirestoreApi from "./FirestoreApi";
import { IProject } from "./Project.type";

class Api {
  static getProjects   = FirestoreApi.getProjects;
  static addProject    = FirestoreApi.addProject;
  static updateProject = FirestoreApi.updateProject;
  static deleteProject = FirestoreApi.deleteProject;

  static async getCurrentProject(): Promise<IProject | null> {
    const raw = window.localStorage.getItem("currentProject");
    return raw ? JSON.parse(raw) : null;
  }
  static async setCurrentProject(project: IProject): Promise<void> {
    window.localStorage.setItem("currentProject", JSON.stringify(project));
  }

  static getStories   = FirestoreApi.getStories;
  static addStory     = FirestoreApi.addStory;
  static updateStory  = FirestoreApi.updateStory;
  static deleteStory  = FirestoreApi.deleteStory;

  static getTasksByStory = FirestoreApi.getTasksByStory;
  static getTasks        = FirestoreApi.getTasks;
  static addTask         = FirestoreApi.addTask;
  static updateTask      = FirestoreApi.updateTask;
  static deleteTask      = FirestoreApi.deleteTask;
}

export default Api;