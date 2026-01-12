import { changeColor, getReadableTextColor } from './color-utils';
import type { AddBookForm, Book } from './types';

export class LibraryUI {
  private form: HTMLFormElement | null;
  private shelves: Record<number, HTMLElement | null>;
  private showBookDialog: {
    dialog: HTMLDialogElement | null;
    title: HTMLElement | null;
    author: HTMLElement | null;
    pages: HTMLElement | null;
    readTrue: HTMLInputElement | null;
    readFalse: HTMLInputElement | null;
  } = {
    dialog: null,
    title: null,
    author: null,
    pages: null,
    readTrue: null,
    readFalse: null,
  };

  constructor(private getBookById: (id: string) => Book | undefined) {
    this.form = document.querySelector('#addBookForm');

    this.shelves = {
      1: document.querySelector('.shelf-1'),
      2: document.querySelector('.shelf-2'),
      3: document.querySelector('.shelf-3'),
    };

    this.showBookDialog = {
      dialog: document.querySelector('#showBookDialog'),
      title: document.querySelector('#showBookDialog .title'),
      author: document.querySelector('#showBookDialog .author'),
      pages: document.querySelector('#showBookDialog .pages'),
      readTrue: document.querySelector<HTMLInputElement>(
        'input[type="radio"][value="true"]',
      ),
      readFalse: document.querySelector<HTMLInputElement>(
        'input[type="radio"][value="false"]',
      ),
    };

    this.bindEvents();
  }

  private bindEvents() {
    if (this.showBookDialog.dialog) {
      this.showBookDialog.dialog.addEventListener('click', () => {
        this.showBookDialog.dialog!.close();
      });

      this.showBookDialog.dialog.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.name === 'read') {
          const selectedValue = target.value === 'true';

          const bookId: string | undefined =
            this.showBookDialog.dialog!.dataset.bookId;
          if (bookId) {
            const book = this.getBookById(bookId);
            if (book) {
              book.read = selectedValue;
            }
          }
        }
      });
    }
  }

  public bindAddBook(handler: (data: AddBookForm) => void) {
    if (this.form) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(this.form!);

        handler({
          title: data.get('title') as string,
          author: data.get('author') as string,
          pages: Number(data.get('pages')),
          read: data.get('read') === 'on',
          shelf: Number(data.get('shelf')),
        });
      });
    }
  }

  public createBook(book: Book) {
    const darkerColor = changeColor(book.color, 20, true);
    const lighterColor = changeColor(book.color, 20, false);
    const height = Math.floor(Math.random() * 20 + 60);
    const translateZ = Math.floor(Math.random() * 100) - 50;

    const bookDiv = document.createElement('div');
    bookDiv.className = `book`;
    bookDiv.id = book.id;
    bookDiv.innerHTML = `
  <div class="title">${book.title}</div>
  <div class="left" style="height:100%; background-color:${darkerColor};"></div>
  <div class="right"  style="height:100%; background-color:${darkerColor};"></div>
`;
    bookDiv.style.backgroundColor = book.color;
    bookDiv.style.color = getReadableTextColor(book.color);
    bookDiv.style.width = book.width + 'px';
    bookDiv.style.setProperty('--outline-color', lighterColor);
    bookDiv.style.height = height + '%';

    bookDiv.dataset.zDepth = translateZ.toString();
    bookDiv.style.transform = `translateZ(${translateZ}px)`;

    bookDiv.addEventListener('click', (e: MouseEvent) => {
      const { dialog, title, author, pages, readTrue, readFalse } =
        this.showBookDialog;
      if (!dialog || !title || !author || !pages || !readTrue || !readFalse) {
        return;
      }
      const target = e.currentTarget as HTMLElement;
      const id = target.id;
      const rect = target.getBoundingClientRect();
      const book: Book | undefined = this.getBookById(id);
      if (book) {
        dialog.dataset.bookId = id;
        dialog.style.position = 'absolute';
        dialog.style.left = `${rect.right}px`;
        dialog.style.top = `${rect.top}px`;

        title.textContent = book.title;
        author.textContent = book.author;
        pages.textContent = book.pages.toString();
        if (book.read) {
          readTrue.checked = true;
        } else {
          readFalse.checked = true;
        }
        dialog.show();
      }
    });

    this.shelves[book.shelf]?.append(bookDiv);
  }
}
