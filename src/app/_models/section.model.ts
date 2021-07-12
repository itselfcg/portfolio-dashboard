import { Picture } from './picture.model';

export interface Section {
  rol: {
    title: string;
    content: string;
  };
  duration: {
    title: string;
    content: string;
  };
  vision: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  challenges: {
    title: string;
    list: string[];
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  start: {
    title: string;
    content: string;
    questions: string[];
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  user: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  ideation: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  sitemap: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  journey: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  wireframes: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  usabilityStudy: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };

  mockups: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };

  prototypes: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };
  accessibility: {
    title: string;
    content: string
  };
  styleGuide: {
    title: string;
    content: string;
    pictures: [
      {
        url: string;
        description: string;
      }
    ];
  };

}
