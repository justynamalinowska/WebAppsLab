export interface IProject {
  id: string;
  name: string;
  description: string;
}

export const defaultProjectList : IProject[] = [
  {
    id: "1",
    name: "Web Development Portfolio",
    description: "A collection of web development projects showcasing HTML, CSS, and JavaScript skills."
  },
  {
    id: "2",
    name: "Machine Learning Model",
    description: "A project to develop and train a machine learning model for predicting housing prices."
  },
  {
    id: "3",
    name: "Mobile App Development",
    description: "A project to create a mobile application using React Native for managing personal finances."
  }
];