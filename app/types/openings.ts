export interface LessonStep {
  side: "white" | "black";
  messages: string[];
}

export interface Lesson {
  intro?: string[];
  perMove: LessonStep[];
  outro?: string[];
}

export interface OpeningVariation {
  id: number;
  name: string;
  moves: string[];
  fen: string;
  description: string;
  whiteWinRate: number;
  blackWinRate: number;
  drawRate: number;
  lesson?: Lesson;
}

export interface Opening {
  id: number;
  name: string;
  moves: string[];
  fen: string;
  difficulty: string;
  description: string;
  whiteWinRate: number;
  blackWinRate: number;
  drawRate: number;
  popularity?: number;
  lesson?: Lesson;
  variations?: OpeningVariation[];
}
