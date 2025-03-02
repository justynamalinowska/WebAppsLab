export interface IProject {
  id: string;
  name: string;
  description: string;
}

export const defaultProjectList : IProject[] = [
  {
    id: "1",
    name: "Web Development Portfolio",
    description: "A collection of web development projects."
  },
  {
    id: "2",
    name: "Machine Learning Model",
    description: "A project to develop and train a machine learning models."
  },
  {
    id: "3",
    name: "Mobile App Development",
    description: "A project to create a mobile application using React Native."
  }
];

export enum PageEnum {
  list,
  add
}