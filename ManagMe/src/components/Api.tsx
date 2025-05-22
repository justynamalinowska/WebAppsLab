// src/components/Api.tsx
import FirestoreApi from "./FirestoreApi";
import { IProject } from "./Project.type";

class Api {
  // ——— Projects ——————————————————————————————
  static getProjects   = FirestoreApi.getProjects;
  static addProject    = FirestoreApi.addProject;
  static updateProject = FirestoreApi.updateProject;
  static deleteProject = FirestoreApi.deleteProject;

  /** Tylko dla kompatybilności z Home.tsx: pamiętamy bieżący projekt w localStorage */
  static async getCurrentProject(): Promise<IProject | null> {
    const raw = window.localStorage.getItem("currentProject");
    return raw ? JSON.parse(raw) : null;
  }
  static async setCurrentProject(project: IProject): Promise<void> {
    window.localStorage.setItem("currentProject", JSON.stringify(project));
  }

  // ——— Stories ——————————————————————————————
  static getStories   = FirestoreApi.getStories;
  static addStory     = FirestoreApi.addStory;
  static updateStory  = FirestoreApi.updateStory;
  static deleteStory  = FirestoreApi.deleteStory;

  // ——— Tasks ——————————————————————————————
  static getTasksByStory = FirestoreApi.getTasksByStory;
  static getTasks        = FirestoreApi.getTasks;
  static addTask         = FirestoreApi.addTask;
  static updateTask      = FirestoreApi.updateTask;
  static deleteTask      = FirestoreApi.deleteTask;
}

export default Api;
