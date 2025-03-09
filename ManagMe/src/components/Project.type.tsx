import { IStory } from "./Story.type";

export interface IProject {
  id: number;
  name: string;
  description: string;
  stories?: IStory[];
  ownerId?: string;
}

export enum PageEnum {
  list,
  add, 
  edit,
  stories,
  addStory,    
  editStory,   
  deleteStory,
}