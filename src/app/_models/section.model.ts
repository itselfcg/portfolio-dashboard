import { Picture } from './picture.model';

export interface Section {
  name:string;
  title: string;
  content: string;
  list: string[];
  pictures: Picture[];
  sections:string[];
}
