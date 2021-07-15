import { Picture } from './picture.model';

export interface Section {
  name:string;
  title: string;
  content: string;
  list: string[];
  questions: string[];
  pictures: [
    {
      url: string;
      description: string;
    }
  ];
  sections:string[];
}
