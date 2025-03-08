import { IStory } from "./Story.type";

export interface IProject {
  id: number;
  name: string;
  description: string;
  stories?: IStory[];
}

export enum PageEnum {
  list,
  add, 
  edit,
  stories
}