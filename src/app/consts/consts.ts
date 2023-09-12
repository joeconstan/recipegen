export enum Color {
  Green = 1,
  Grey,
  Blue,
  Red,
  Primary,
  Yellow,
  Orange,
  Purple,
  Pink,
  Accent,
}

export interface Recipe {
  id: number;
  difficulty: string;
  directions: string[];
  ingredients: string[];
  name: string;
  pending: boolean;
  type: string[];
  rating: number;
  submittedby: string;
  tags: string[];
  timelength: number;
  author: string;
  yield: string;
  time_active?: any;
  time_inactive?: any;
  created: string;
  blurb: string;
  deleted: boolean;
  ip_directions?: any;
}

export interface RatingInfo {
  rating: number;
  numratings: number;
  recipe_id: number;
}

export interface CommentObj {
  id?: number;
  recipe_id: number;
  user_id: number;
  username: string;
  commenttext: string;
  create_date?: string;
  color_key: number;
}
