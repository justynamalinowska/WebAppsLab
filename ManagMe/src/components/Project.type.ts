export interface IProject {
  id: string;
  name: string;
  description: string;
}

export const defaultProjectList : IProject[] = [
  {
    id: "1",
    name: "Project 1",
    description: "Description 1"
  },
  {
    id: "2",
    name: "Project 2",
    description: "Description 2"
  }];