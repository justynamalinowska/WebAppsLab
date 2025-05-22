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
// import EditTask from "./EditTask";
import Api from "./Api";
import { IStory } from "./Story.type";
import { ITask } from "./Task.type";
import IUser from "./User.type";
import { useNavigate } from "react-router-dom";
import {fetchWithAuth} from "./BackendApi";

const Home = () => {
  // Projekty
  const [projectList, setProjectsList] = useState<IProject[]>([]);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);

  // Nawigacja
  const [shownPage, setShownPage] = useState<PageEnum>(PageEnum.list);
  const [dataToEditProject, setDataToEditProject] = useState<IProject>({} as IProject);

  // Story
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);

  // Task CRUD
//   const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark"
  );

const navigate = useNavigate();

const handleLogout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      // jeśli dodałeś endpoint POST /auth/logout, wyślij tam request z auth
      await fetchWithAuth("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
    }
  } catch (err) {
    console.error("Błąd przy wylogowaniu:", err);
  } finally {
    // niezależnie od wyniku żądania, czyścimy dane i przekierowujemy
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }
};
  const [user, setUser] = useState<IUser | null>(null);
  // // Przykładowy użytkownik
  // const [user] = useState<IUser>({
  //   id: "1",
  //   firstName: "Justyna",
  //   lastName: "Malinowska",
  //   Role: "Admin",
  // });

  // Wczytaj projekty
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth("/auth/me");
        if (!res.ok) throw new Error();
        const me: IUser = await res.json();
        setUser(me);
      } catch {
        navigate("/login", { replace: true });
      }
    })();

    // zamiast Api.getProjects → BackendApi.getProjects()
    Api.getProjects().then(setProjectsList);
  }, []);

useEffect(() => {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}, [theme]);

  // Helpers do localStorage
  const saveProjects = (list: IProject[]) => {
    setProjectsList(list);
    window.localStorage.setItem("projects", JSON.stringify(list));
  };
  const saveStories = (stories: IStory[]) => {
    if (!currentProject) return;
    const updated = { ...currentProject, stories };
    const updatedList = projectList.map(p =>
      p.id === updated.id ? updated : p
    );
    saveProjects(updatedList);
    setCurrentProject(updated);
  };

  // Generatory ID
  const nextProjId = () =>
    projectList.length ? Math.max(...projectList.map(p => p.id)) + 1 : 1;

  // **GLOBALNY** generator dla story — unikalne w całej aplikacji
  const nextStoryId = () => {
    const allStories = projectList.flatMap(p => p.stories || []);
    return allStories.length
      ? Math.max(...allStories.map(s => s.id)) + 1
      : 1;
  };

  // PROJECT HANDLERS
  const addProject = (p: IProject) => {
    saveProjects([...projectList, { ...p, id: nextProjId(), stories: [] }]);
    setShownPage(PageEnum.list);
  };
  const startEditProject = (p: IProject) => {
    setDataToEditProject(p);
    setShownPage(PageEnum.edit);
  };
  const updateProject = (p: IProject) => {
    saveProjects(projectList.map(x => x.id === p.id ? p : x));
    setShownPage(PageEnum.list);
  };
  const deleteProject = (p: IProject) => {
    saveProjects(projectList.filter(x => x.id !== p.id));
  };
  const selectProject = (p: IProject) => {
    setCurrentProject({ ...p, stories: p.stories || [] });
    Api.setCurrentProject(p);
    setShownPage(PageEnum.stories);
  };

  // STORY HANDLERS
  const addStory = (s: IStory) => {
    if (!currentProject) return;
    saveStories([
      ...(currentProject.stories || []),
      { ...s, id: nextStoryId(), projectId: currentProject.id },
    ]);
    setShownPage(PageEnum.stories);
  };
  const startEditStory = (s: IStory) => {
    saveStories(
      currentProject!.stories!.map(x => x.id === s.id ? s : x)
    );
    setSelectedStory(s);
    setShownPage(PageEnum.editStory);
  };
  const deleteStory = (s: IStory) => {
    saveStories(
      currentProject!.stories!.filter(x => x.id !== s.id)
    );
    setShownPage(PageEnum.stories);
  };
  const openKanban = (s: IStory) => {
    setSelectedStory(s);
    setShownPage(PageEnum.kanban);
  };

  // TASK HANDLERS
  const openAddTask = () => setShownPage(PageEnum.addTask);
  const addTask = async (t: ITask) => {
    await Api.addTask(t);
    setShownPage(PageEnum.kanban);
  };
//   const openEditTask = (t: ITask) => {
//     setTaskToEdit(t);
//     setShownPage(PageEnum.editTask);
//   };
//   const updateTask = async (t: ITask) => {
//     await Api.updateTask(t);
//     setShownPage(PageEnum.kanban);
//   };

  // Wracanie
  const backToList = () => setShownPage(PageEnum.list);
  const backToStories = () => setShownPage(PageEnum.stories);
  const backToKanban = () => setShownPage(PageEnum.kanban);

  return (
    <>
      <article className="article-header">
        <h1>ManageMe</h1>
        <p>{user? `Welcome, ${user.username}`: "Ładowanie…"}<button className="logout-button" onClick={handleLogout}>Wyloguj</button> <button
    className="theme-toggle"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  >
    {theme === "dark" ? "Jasny" : "Ciemny"}
  </button></p> 
      </article>
      <section className="section-content-projects">
        {shownPage === PageEnum.list && (
          <ProjectList
            list={projectList}
            onSelect={selectProject}
            onDeleteClickHnd={deleteProject}
            onEdit={startEditProject}
            setShownPage={setShownPage}
          />
        )}

        {shownPage === PageEnum.add && (
          <AddProject
            onBackBtnClickHnd={backToList}
            onSubmitClickHnd={addProject}
          />
        )}

        {shownPage === PageEnum.edit && (
          <EditProject
            data={dataToEditProject}
            onBackBtnClickHnd={backToList}
            onUpdateClickHnd={updateProject}
          />
        )}

        {shownPage === PageEnum.stories && currentProject && (
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

        {shownPage === PageEnum.addStory && currentProject && (
          <AddStory
            project={currentProject}
            userId={user!.id}
            onBackBtnClickHnd={backToStories}
            onSubmitClickHnd={addStory}
          />
        )}

        {shownPage === PageEnum.editStory && selectedStory && (
          <EditStory
            data={selectedStory}
            onBackBtnClickHnd={backToStories}
            onUpdateClickHnd={startEditStory}
          />
        )}

        {shownPage === PageEnum.kanban && selectedStory && (
          <KanbanBoard
            story={selectedStory}
            onBack={backToStories}
            onAdd={openAddTask}
          />
        )}

        {shownPage === PageEnum.addTask && selectedStory && (
          <AddTask
            storyId={selectedStory.id}
            onBackBtnClickHnd={backToKanban}
            onSubmitClickHnd={addTask}
          />
        )}

        {/* {shownPage === PageEnum.editTask && taskToEdit && (
          <EditTask
            data={taskToEdit}
            onBackBtnClickHnd={backToKanban}
            onUpdateClickHnd={updateTask}
          />
        )} */}
      </section>
    </>
  );
};

export default Home;
