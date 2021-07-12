import { Picture } from "./picture.model";

export interface Project{
  _id:string,
  language:string,
  name:string,
  title: string,
  content: string,
  picture: Picture,
  labels: string[],
  git_url: string,
  details: boolean,
  preview_url: string,
}