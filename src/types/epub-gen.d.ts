declare module 'epub-gen' {
  interface Chapter {
    title: string;
    data: string;
  }

  interface Options {
    title: string;
    author: string;
    publisher: string;
    lang: string;
    appendChapterTitles: boolean;
    chapters: Chapter[];
  }

  export default class EPub {
    constructor(options: Options);
    on(event: string, callback: (...args: any[]) => void): void;
    write(path: string): void;
  }
}
