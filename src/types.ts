export interface recipeObject {
  name: string;
  ingredients: string[];
  directions: string[];
  type: string[];
  timelength: number;
  timeWarning: boolean;
  difficulty: string;
  difficultyWarning: boolean;
  pending: boolean;
  author: string;
  rating: number;
  tags: string[];
  yield: string;
  title: string;
  submitText: string;
  id: number;
  blurb: string;
  deleted: boolean;
}

export interface userObject {
  id: number;
  username: string;
  adminflag: boolean;
  password?: string;
  color_key?: number;
}
export interface userObjectWithToken {
  result: {
    id: number;
    username: string;
    adminflag: boolean;
    password?: string;
    color_key?: number;
  };
  token: string;
}
