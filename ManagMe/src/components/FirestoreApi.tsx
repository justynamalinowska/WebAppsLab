import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    writeBatch,
    Timestamp,
    DocumentData,
    QueryDocumentSnapshot,
  } from "firebase/firestore";
  import { db } from "./Firebase";
  import { IProject } from "./Project.type";
  import { IStory } from "./Story.type";
  import { ITask } from "./Task.type";
  
  const projectsCol = collection(db, "projects");
  const storiesCol  = collection(db, "stories");
  const tasksCol    = collection(db, "tasks");
  
  function toDate(value: any): Date {
    return value instanceof Timestamp ? value.toDate() : new Date(value);
  }
  
  export default class FirestoreApi {
    static async getProjects(): Promise<IProject[]> {
      const projSnap = await getDocs(projectsCol);
      const projects = await Promise.all(
        projSnap.docs.map(async pd => {
          const raw = pd.data() as Omit<IProject, "id" | "stories">;
          const id  = Number(pd.id);
          const stories = await this.getStories(id);
          return {
            id,
            name:        raw.name,
            description: raw.description,
            ownerId:     raw.ownerId,
            stories,
          };
        })
      );
      return projects;
    }
  
    static async addProject(p: IProject): Promise<void> {
      await setDoc(doc(projectsCol, p.id.toString()), {
        name:        p.name,
        description: p.description,
        ownerId:     p.ownerId || null,
      });
    }
  
    static async updateProject(p: IProject): Promise<void> {
      await updateDoc(doc(projectsCol, p.id.toString()), {
        name:        p.name,
        description: p.description,
        ownerId:     p.ownerId || null,
      });
    }
  
    static async deleteProject(projectId: number): Promise<void> {
      const batch = writeBatch(db);
      const storyQ = query(storiesCol, where("projectId", "==", projectId));
      const storySnap = await getDocs(storyQ);
      for (const sd of storySnap.docs) {
        const sid = Number(sd.id);
        const taskQ = query(tasksCol, where("storyId", "==", sid));
        const taskSnap = await getDocs(taskQ);
        taskSnap.docs.forEach(td => batch.delete(td.ref));
        batch.delete(sd.ref);
      }
      batch.delete(doc(projectsCol, projectId.toString()));
      await batch.commit();
    }
  
    static async getStories(projectId: number): Promise<IStory[]> {
      const q    = query(storiesCol, where("projectId", "==", projectId));
      const snap = await getDocs(q);
      return snap.docs.map(d => {
        const raw = d.data() as DocumentData;
        return {
          id:          Number(d.id),
          title:       raw.title,
          description: raw.description,
          priority:    raw.priority,
          projectId:   raw.projectId,
          createdAt:   toDate(raw.createdAt),
          status:      raw.status,
          ownerId:     raw.ownerId,
        } as IStory;
      });
    }
  
    static async addStory(s: IStory): Promise<void> {
      await setDoc(doc(storiesCol, s.id.toString()), {
        title:       s.title,
        description: s.description,
        priority:    s.priority,
        projectId:   s.projectId,
        status:      s.status,
        ownerId:     s.ownerId,
        createdAt:   Timestamp.fromDate(s.createdAt ?? new Date()),
      });
    }
  
    static async updateStory(s: IStory): Promise<void> {
      await updateDoc(doc(storiesCol, s.id.toString()), {
        title:       s.title,
        description: s.description,
        priority:    s.priority,
        status:      s.status,
        ownerId:     s.ownerId,
      });
    }
  
    static async deleteStory(storyId: number): Promise<void> {
      const batch  = writeBatch(db);
      const taskQ  = query(tasksCol, where("storyId", "==", storyId));
      const taskSnap = await getDocs(taskQ);
      taskSnap.docs.forEach(td => batch.delete(td.ref));
      batch.delete(doc(storiesCol, storyId.toString()));
      await batch.commit();
    }
  
    // ——— TASKS ——————————————————————————————————
  
    /** Pobiera **wszystkie** zadania (np. do generowania następnego ID) */
    static async getTasks(): Promise<ITask[]> {
      const snap = await getDocs(tasksCol);
      return snap.docs.map(d => {
        const raw = d.data() as DocumentData;
        return {
          id:             Number(d.id),
          name:           raw.name,
          description:    raw.description,
          priority:       raw.priority,
          storyId:        raw.storyId,
          estimatedHours: raw.estimatedHours,
          state:          raw.state,
          createdAt:      toDate(raw.createdAt),
          startDate:      raw.startDate  ? toDate(raw.startDate)  : undefined,
          endDate:        raw.endDate    ? toDate(raw.endDate)    : undefined,
          ownerId:        raw.ownerId    || undefined,
        } as ITask;
      });
    }
  
    static async getTasksByStory(storyId: number): Promise<ITask[]> {
      return (await this.getTasks()).filter(t => t.storyId === storyId);
    }
  
    static async addTask(t: ITask): Promise<void> {
      await setDoc(doc(tasksCol, t.id.toString()), {
        name:           t.name,
        description:    t.description,
        priority:       t.priority,
        storyId:        t.storyId,
        estimatedHours: t.estimatedHours,
        state:          t.state,
        ownerId:        t.ownerId || null,
        createdAt:      Timestamp.fromDate(t.createdAt ?? new Date()),
        startDate:      t.startDate ? Timestamp.fromDate(t.startDate) : null,
        endDate:        t.endDate   ? Timestamp.fromDate(t.endDate)   : null,
      });
    }
  
    static async updateTask(t: ITask): Promise<void> {
      await updateDoc(doc(tasksCol, t.id.toString()), {
        name:           t.name,
        description:    t.description,
        priority:       t.priority,
        state:          t.state,
        ownerId:        t.ownerId || null,
        estimatedHours: t.estimatedHours,
        startDate:      t.startDate ? Timestamp.fromDate(t.startDate) : null,
        endDate:        t.endDate   ? Timestamp.fromDate(t.endDate)   : null,
      });
    }
  
    static async deleteTask(taskId: number): Promise<void> {
      await deleteDoc(doc(tasksCol, taskId.toString()));
    }
  }