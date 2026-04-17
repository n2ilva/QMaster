export type QuickResponseDifficulty = 'Baixa' | 'Urgente' | 'Crítica';


export type QuickResponseOption = {
  id: string;
  text: string;
  is_correct: boolean;
  feedback?: string;
};

export type QuickResponseExercise = {
  id: string;
  level: QuickResponseDifficulty;
  alert: string;
  actions: QuickResponseOption[];
  success_message: string;
};

export type QuickResponseCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  exercises: QuickResponseExercise[];
};

export type QuickResponseData = {
  game: string;
  version: string;
  categories: QuickResponseCategory[];
};

