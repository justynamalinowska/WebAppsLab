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
  const [projectList, setProjectsList] = useState<IProject[]>([]);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [shownPage, setShownPage] = useState<PageEnum>(PageEnum.list);
  const [dataToEditProject, setDataToEditProject] = useState<IProject>({} as IProject);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark"
  );

  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
  
    try {
      if (refreshToken) {
        await fetchWithAuth("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (err) {
      console.error("Błąd przy wylogowaniu:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/login", { replace: true });
    }
  };

  const refreshCurrentProject = async () => {
    if (!currentProject) return;
    const updatedStories = await Api.getStories(currentProject.id);
    const updated = { ...currentProject, stories: updatedStories };
    setCurrentProject(updated);

    const updatedProjectList = projectList.map(p =>
      p.id === currentProject.id ? updated : p
    );
    setProjectsList(updatedProjectList);
  };

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
    Api.getProjects().then(setProjectsList);
  }, []);

  useEffect(() => {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}, [theme]);

  // const saveProjects = (list: IProject[]) => {
  //   setProjectsList(list);
  //   window.localStorage.setItem("projects", JSON.stringify(list));
  // };
  // const saveStories = (stories: IStory[]) => {
  //   if (!currentProject) return;
  //   const updated = { ...currentProject, stories };
  //   const updatedList = projectList.map(p =>
  //     p.id === updated.id ? updated : p
  //   );
  //   saveProjects(updatedList);
  //   setCurrentProject(updated);
  // };

  const nextProjId = () =>
    projectList.length ? Math.max(...projectList.map(p => p.id)) + 1 : 1;

  const nextStoryId = () => {
    const allStories = projectList.flatMap(p => p.stories || []);
    return allStories.length
      ? Math.max(...allStories.map(s => s.id)) + 1
      : 1;
  };

  const addProject = async (p: IProject) => {
  const newProject = { ...p, id: nextProjId(), stories: [] };
  await Api.addProject(newProject);
  const refreshed = await Api.getProjects();
  setProjectsList(refreshed);
  setShownPage(PageEnum.list);
  };

  const startEditProject = (p: IProject) => {
    setDataToEditProject(p);
    setShownPage(PageEnum.edit);
  };

  const updateProject = async (p: IProject) => {
  await Api.updateProject(p);
  const refreshed = await Api.getProjects();
  setProjectsList(refreshed);
  setShownPage(PageEnum.list);
  };

  const deleteProject = async (p: IProject) => {
  await Api.deleteProject(p.id);
  const refreshed = await Api.getProjects();
  setProjectsList(refreshed);
  };

  const selectProject = async (p: IProject) => {
  const stories = await Api.getStories(p.id);
  const fullProject = { ...p, stories };
  setCurrentProject(fullProject);
  Api.setCurrentProject(fullProject);
  setShownPage(PageEnum.stories);
  };


  const addStory = async (s: IStory) => {
    if (!currentProject) return;
    const newStory = { ...s, id: nextStoryId(), projectId: currentProject.id };
    await Api.addStory(newStory);
    await refreshCurrentProject(); 
    setShownPage(PageEnum.stories);
  };

  const updateStory = async (s: IStory) => {
    await Api.updateStory(s);
    await refreshCurrentProject(); 
    setShownPage(PageEnum.stories);
  };

  const deleteStory = async (s: IStory) => {
    await Api.deleteStory(s.id);
    await refreshCurrentProject(); 
    setShownPage(PageEnum.stories);
  };

  const openKanban = (s: IStory) => {
    setSelectedStory(s);
    setShownPage(PageEnum.kanban);
  };

  const openAddTask = () => setShownPage(PageEnum.addTask);

  const addTask = async (t: ITask) => {
    await Api.addTask(t);
    await refreshCurrentProject();
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

  const backToList = () => setShownPage(PageEnum.list);
  const backToStories = () => setShownPage(PageEnum.stories);
  const backToKanban = () => setShownPage(PageEnum.kanban);

  return (
    <>
      <article className="article-header">
        <h1>ManageMe</h1>
        <p>{user? `Welcome, ${user.username}`: "Ładowanie…"}<button className="logout-button" onClick={handleLogout}>Logout</button> <button
    className="theme-toggle"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
    {theme === "dark" ? "Light" : "Dark"}
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
            onEdit={updateStory}
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
            onUpdateClickHnd={updateStory}
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
