export interface AddBookForm {
  title: string;
  author: string;
  pages: number;
  read: boolean;
  shelf: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  read: boolean;
  shelf: number;
  color: string;
  width: number;
}
