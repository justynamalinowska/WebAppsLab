import "./Home.style.css";
import { useEffect, useState } from "react";
import { IProject, PageEnum } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import IUser from "./User.type";
import Api from "./Api";
import { IStory } from "./Story.type";
import { ITask } from "./Task.type";
import StoryList from "./StoryList";
import AddStory from "./AddStory";
import EditStory from "./EditStory";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

const Home = () => {
    const [projectList, setProjectsList] = useState([] as IProject[]);
    const [shownPage, setShownPage] = useState(PageEnum.list);
    const [dataToEdit, setDataToEdit] = useState({} as IProject);
    const [user, setUser] = useState<IUser>({ id: "1", firstName: "Justyna", lastName: "Malinowska", Role: "Admin" });
    const [currentProject, setCurrentProject] = useState<IProject | null>(null);
    const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [currentStory, setCurrentStory] = useState<IStory | null>(null);

    const showListPage = () => setShownPage(PageEnum.list);

    useEffect(() => {
        Api.getCurrentStory().then(story => {
            if (story) {
                setCurrentStory(story);
            }
        });
    }, []);

    useEffect(() => {
        Api.getCurrentProject().then(project => {
            if (project && project.id !== undefined) {
                setCurrentProject({ ...project, stories: project.stories || [] });
            }
        });
    }, []);

    useEffect(() => {
        if (currentProject) {
            const projects = JSON.parse(window.localStorage.getItem("projects") || "[]") as IProject[];
            const updatedProject = projects.find(p => p.id === currentProject.id);
            if (updatedProject) {
                setCurrentProject(updatedProject);
            }
        }
    }, [currentProject?.id]);

    const _setProjectsList = (data: IProject[]) => {
        setProjectsList(data);
        window.localStorage.setItem("projects", JSON.stringify(data));
    };

    const _setStoriesList = (data: IStory[]) => {
        if (currentProject) {
            const updatedProject = { ...currentProject, stories: data };
            const updatedProjects = projectList.map(p => p.id === currentProject.id ? updatedProject : p);
            setProjectsList(updatedProjects);
            setCurrentProject(updatedProject);
            window.localStorage.setItem("projects", JSON.stringify(updatedProjects));
        }
    };

    const generateUniqueProjectId = (): number => {
        const ids = projectList.map(project => project.id);
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    };

    const generateUniqueStoryId = (): number => {
        if (currentProject) {
            const ids = (currentProject.stories || []).map(story => story.id);
            return ids.length > 0 ? Math.max(...ids) + 1 : 1;
        }
        return 1;
    };

    const generateUniqueTaskId = (): number => {
        if(currentStory) {
            const ids = tasks.map(task => task.id);
            return ids.length > 0 ? Math.max(...ids) + 1 : 1;
        }
        return 1;
    };

    useEffect(() => {
        const projectsListInString = window.localStorage.getItem("projects");
        if (projectsListInString) {
            setProjectsList(JSON.parse(projectsListInString));
        }
    }, []);

    const addProjectHnd = (data: IProject) => {
        const newProject = { ...data, id: generateUniqueProjectId(), stories: [] };
        _setProjectsList([...projectList, newProject]);
        showListPage();
    }

    const deleteProject = (data: IProject) => {
        const indexToDelete = projectList.indexOf(data);
        const tempList = [...projectList];

        tempList.splice(indexToDelete, 1);
        _setProjectsList(tempList);
    };

    const editProject = (data: IProject) => {
        setShownPage(PageEnum.edit);
        setDataToEdit(data);
    };

    const updateData = (data: IProject) => {
        const filterData = projectList.filter((project) => project.id === data.id)[0];
        const indexOfRecord = projectList.indexOf(filterData);
        const tempList = [...projectList];
        tempList[indexOfRecord] = data;
        _setProjectsList(tempList);
        showListPage();
    };

    const selectProject = (project: IProject) => {
        setCurrentProject({ ...project, stories: project.stories || [] });
        Api.setCurrentProject(project);
        setShownPage(PageEnum.stories);
    };

    const editStory = (story: IStory) => {
        if (currentProject) {
            const updatedStories = (currentProject.stories || []).map(s => s.id === story.id ? story : s);
            _setStoriesList(updatedStories);
            setSelectedStory(story);
            setShownPage(PageEnum.editStory);
        }
    };

    const deleteStory = (story: IStory) => {
        if (currentProject) {
            const updatedStories = (currentProject.stories || []).filter(s => s.id !== story.id);
            _setStoriesList(updatedStories);
    
            const updatedTasks = tasks.filter(task => task.storyId !== story.id);
            _setTasksList(updatedTasks);
    
            setShownPage(PageEnum.stories);
        }
    };

    const addStory = (story: IStory) => {
        if (currentProject) {
            const newStory = { ...story, id: generateUniqueStoryId(), projectId: currentProject.id };
            const updatedStories = [...(currentProject.stories || []), newStory];
            _setStoriesList(updatedStories);
            setShownPage(PageEnum.stories);
        }
    };

    const backToProjectList = () => {
        Api.setCurrentProject({} as IProject);
        Api.clearCurrentStory(); 
        setShownPage(PageEnum.list);
    };

    const backToTaskList = () => {
        setShownPage(PageEnum.tasks);
    };

    const addTask = (task: ITask) => {
        const newTask = { ...task, id: generateUniqueTaskId() }; 
        const updatedTasks = [...tasks, newTask];
        _setTasksList(updatedTasks); 
        setShownPage(PageEnum.tasks); 
    };
    
    const editTaskHnd = (task: ITask) => {
        setTasks(tasks.map(t => t.id === task.id ? task : t));
        setShownPage(PageEnum.tasks);
    };
    
    const deleteTask = (task: ITask) => {
        setTasks(tasks.filter(t => t.id !== task.id));
        setShownPage(PageEnum.tasks);
    };

    const selectStory = (story: IStory) => {
        setCurrentStory(story); 
        Api.setCurrentStory(story); 
        setShownPage(PageEnum.tasks);
    };

    useEffect(() => {
        Api.getTasks().then(setTasks);
    }, []);
    
    const _setTasksList = (data: ITask[]) => {
        setTasks(data);
        Api.setTasks(data); 
    };
    
    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
                <p>Welcome, {user.firstName} {user.lastName}</p>
            </header>
        </article>

        <section className="section-content-projects">
        {shownPage === PageEnum.list && <ProjectList list={projectList} setShownPage={setShownPage} onDeleteClickHnd={deleteProject} onEdit={editProject} onSelect={selectProject} />}
        {shownPage === PageEnum.add && <AddProject onBackBtnClickHnd={showListPage} onSubmitClickHnd={addProjectHnd} />}
        {shownPage === PageEnum.edit && <EditProject data={dataToEdit} onBackBtnClickHnd={showListPage} onUpdateClickHnd={updateData} />}
        {shownPage === PageEnum.stories && currentProject && <StoryList project={currentProject} onEdit={editStory} onDeleteClickHnd={deleteStory} onPageChange={setShownPage} onBackBtnClickHnd={backToProjectList} onSelectStory={selectStory} />}
        {shownPage === PageEnum.addStory && <AddStory project={currentProject} userId={user.id} onBackBtnClickHnd={() => setShownPage(PageEnum.stories)} onSubmitClickHnd={addStory} />}
        {shownPage === PageEnum.editStory && <EditStory data={selectedStory!} onBackBtnClickHnd={() => setShownPage(PageEnum.stories)} onUpdateClickHnd={editStory} />}
        {shownPage === PageEnum.tasks && currentStory && <TaskList story={currentStory} tasks={tasks} setTasks={setTasks} onEditTask={task => { setSelectedTask(task); setShownPage(PageEnum.editTask); }} onDeleteTask={deleteTask} onShowDetails={task => { setSelectedTask(task); setShownPage(PageEnum.tasks); }} onBackBtnClickHnd={() => setShownPage(PageEnum.stories)} onAddTask={() => setShownPage(PageEnum.addTask)} />}
        {shownPage === PageEnum.addTask && currentStory && <AddTask storyId={currentStory.id} onAdd={addTask} onBackBtnClickHnd={backToTaskList} />}
        {shownPage === PageEnum.editTask && selectedTask && <EditTask task={selectedTask} onEdit={editTaskHnd} onBackBtnClickHnd={backToTaskList} />}
        </section>
    </>);
};

export default Home;