// src/components/Home.tsx

import "./Home.style.css";
import { useEffect, useState } from "react";
import { IProject, PageEnum } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import StoryList from "./StoryList";
import AddStory from "./AddStory";
import EditStory from "./EditStory";
import KanbanBoard from "./KanbanBoard";
import AddTask from "./AddTask";
import Api from "./Api";                     // <- Api deleguje do FirestoreApi
import { IStory } from "./Story.type";
import { ITask } from "./Task.type";
import IUser from "./User.type";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "./BackendApi";

const Home: React.FC = () => {
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);

  const [shownPage, setShownPage] = useState<PageEnum>(PageEnum.list);
  const [dataToEditProject, setDataToEditProject] = useState<IProject>({} as IProject);

  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [dataToEditStory, setDataToEditStory] = useState<IStory>({} as IStory);

  const [theme, setTheme] = useState<"dark"|"light">(
    (localStorage.getItem("theme") as "dark"|"light") || "dark"
  );
  const [user, setUser] = useState<IUser|null>(null);
  const navigate = useNavigate();

  // — auth + pierwsze ładowanie projektów —
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth("/auth/me");
        if (!res.ok) throw new Error();
        setUser(await res.json());
      } catch {
        navigate("/login", { replace: true });
      }
    })();
    loadProjects();
  }, [navigate]);

  // motyw
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // — helper do fetcha projektów —
  const loadProjects = async () => {
    const projs = await Api.getProjects();
    setProjectList(projs);
  };

  // — generatory ID —
  const nextProjId = () =>
    projectList.length ? Math.max(...projectList.map(p => p.id))+1 : 1;
  const nextStoryId = () => {
    const allS = projectList.flatMap(p=>p.stories||[]);
    return allS.length ? Math.max(...allS.map(s=>s.id))+1 : 1;
  };
  const nextTaskId = async () => {
    const allT = await Api.getTasks();
    return allT.length ? Math.max(...allT.map(t=>t.id))+1 : 1;
  };

  // — Project CRUD —
  const addProject = async (p: IProject) => {
    await Api.addProject({ ...p, id: nextProjId(), stories: [] });
    await loadProjects();
    setShownPage(PageEnum.list);
  };
  const startEditProject = (p: IProject) => {
    setDataToEditProject(p);
    setShownPage(PageEnum.edit);
  };
  const updateProject = async (p: IProject) => {
    await Api.updateProject(p);
    await loadProjects();
    setShownPage(PageEnum.list);
  };
  const deleteProject = async (p: IProject) => {
    await Api.deleteProject(p.id);
    await loadProjects();
  };
  const selectProject = (p: IProject) => {
    setCurrentProject(p);
    setShownPage(PageEnum.stories);
  };

  // — Story CRUD —
  const addStory = async (s: IStory) => {
    if (!currentProject) return;
    await Api.addStory({ ...s, id: nextStoryId(), projectId: currentProject.id });
    await loadProjects();
    setCurrentProject(
      (await Api.getProjects()).find(pr=>pr.id===currentProject.id)!);
    setShownPage(PageEnum.stories);
  };
  const startEditStory = (s: IStory) => {
    setDataToEditStory(s);
    setSelectedStory(s);
    setShownPage(PageEnum.editStory);
  };
  const updateStory = async (s: IStory) => {
    await Api.updateStory(s);
    await loadProjects();
    setCurrentProject(
      (await Api.getProjects()).find(pr=>pr.id===currentProject?.id)!);
    setShownPage(PageEnum.stories);
  };
  const deleteStory = async (s: IStory) => {
    await Api.deleteStory(s.id);
    await loadProjects();
    setCurrentProject(
      (await Api.getProjects()).find(pr=>pr.id===currentProject?.id)!);
    setShownPage(PageEnum.stories);
  };
  const openKanban = (s: IStory) => {
    setSelectedStory(s);
    setShownPage(PageEnum.kanban);
  };

  // — Task CRUD —
  const openAddTask = () => setShownPage(PageEnum.addTask);
  const addTask = async (t: ITask) => {
    await Api.addTask({ ...t, id: await nextTaskId() });
    setShownPage(PageEnum.kanban);
  };

  // — powroty —
  const backToList   = () => setShownPage(PageEnum.list);
  const backToStories= () => setShownPage(PageEnum.stories);
  const backToKanban = () => setShownPage(PageEnum.kanban);

  return (
    <>
      <article className="article-header">…</article>
      <section className="section-content-projects">
        {shownPage===PageEnum.list && (
          <ProjectList
            list={projectList}
            onSelect={selectProject}
            onDeleteClickHnd={deleteProject}
            onEdit={startEditProject}
            setShownPage={setShownPage}
          />
        )}
        {shownPage===PageEnum.add && (
          <AddProject
            onBackBtnClickHnd={backToList}
            onSubmitClickHnd={addProject}
          />
        )}
        {shownPage===PageEnum.edit && (
          <EditProject
            data={dataToEditProject}
            onBackBtnClickHnd={backToList}
            onUpdateClickHnd={updateProject}
          />
        )}
        {shownPage===PageEnum.stories && currentProject && (
          <StoryList
            project={currentProject}
            stories={currentProject.stories!}
            onSelect={openKanban}
            onEdit={startEditStory}
            onDelete={deleteStory}
            onBack={backToList}
            onPageChange={setShownPage}
          />
        )}
        {shownPage===PageEnum.addStory && currentProject && (
          <AddStory
            project={currentProject}
            userId={user!.id}
            onBackBtnClickHnd={backToStories}
            onSubmitClickHnd={addStory}
          />
        )}
        {shownPage===PageEnum.editStory && selectedStory && (
          <EditStory
            data={dataToEditStory}
            onBackBtnClickHnd={backToStories}
            onUpdateClickHnd={updateStory}
          />
        )}
        {shownPage===PageEnum.kanban && selectedStory && (
          <KanbanBoard
            story={selectedStory}
            onBack={backToStories}
            onAdd={openAddTask}
          />
        )}
        {shownPage===PageEnum.addTask && selectedStory && (
          <AddTask
            storyId={selectedStory.id}
            onBackBtnClickHnd={backToKanban}
            onSubmitClickHnd={addTask}
          />
        )}
      </section>
    </>
  );
};

export default Home;
