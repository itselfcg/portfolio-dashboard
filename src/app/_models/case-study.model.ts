import { Insight } from './insight.model';
import { Picture } from './picture.model';
import { Project } from './project.model';
import { Section } from './section.model';
import { User } from './user.model';

export interface CaseStudy {
  language: String;
  creation_date: Date;

  _id: string;
  project: Project;
  title: string;
  content: string;
  sections: Section;
  pictures: Picture[];
  insights: Insight[];
  users: User[];
  active: Boolean;
}
