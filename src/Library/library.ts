import { getRandomColor } from './color-utils';
import { LibraryUI } from './library-ui';
import type { Book } from './types';

class Library {
  private libraryMap = new Map<string, Book>();
  private getBookById = (id: string) => this.libraryMap.get(id);
  private ui = new LibraryUI(this.getBookById);

  constructor(
    private seedBooks: { title: string; author: string; pages: number }[],
  ) {
    this.bindEvents();
    this.seed();
  }

  private bindEvents() {
    this.ui.bindAddBook((data) => {
      this.addBook(data.title, data.author, data.pages, data.read, data.shelf);
    });
  }

  private seed() {
    this.seedBooks.forEach((book) => {
      this.addBook(
        book.title,
        book.author,
        book.pages,
        Math.floor(Math.random() * 2) > 0 ? true : false,
        Math.floor(Math.random() * 3) + 1,
      );
    });
  }

  public addBook(
    title: string,
    author: string,
    pages: number,
    read: boolean,
    shelf: number,
  ) {
    const book: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      pages,
      read,
      shelf,
      color: getRandomColor(),
      width: Math.floor(Math.random() * 50 + 40),
    };

    this.libraryMap.set(book.id, book);
    this.ui.createBook(book);
  }
}

const seedBooks = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', pages: 281 },
  { title: '1984', author: 'George Orwell', pages: 328 },
  { title: 'Moby-Dick', author: 'Herman Melville', pages: 635 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', pages: 279 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180 },
  { title: 'War and Peace', author: 'Leo Tolstoy', pages: 1225 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', pages: 214 },
  { title: 'Brave New World', author: 'Aldous Huxley', pages: 311 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', pages: 671 },
  { title: 'The Odyssey', author: 'Homer', pages: 541 },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', pages: 500 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 194 },
  { title: 'Wuthering Heights', author: 'Emily Brontë', pages: 416 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', pages: 1178 },
  { title: 'Animal Farm', author: 'George Orwell', pages: 112 },
  { title: 'Les Misérables', author: 'Victor Hugo', pages: 1463 },
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', pages: 824 },
  { title: 'The Grapes of Wrath', author: 'John Steinbeck', pages: 464 },
  { title: 'Don Quixote', author: 'Miguel de Cervantes', pages: 982 },
];

new Library(seedBooks);
