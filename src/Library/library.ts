interface AddBookForm {
  title: string;
  author: string;
  pages: number;
  read: boolean;
  shelf: number;
}

class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public pages: number,
    public read: boolean,
    public shelf: number,
    public color: string,
    public width: number,
  ) {}

  public info() {
    if (this.read) {
      return `${this.title} by ${this.author}, ${this.pages} pages, already read.`;
    }
    return `${this.title} by ${this.author}, ${this.pages} pages, not read yet.`;
  }
}

class Library {
  private libraryMap = new Map<string, Book>();
  private form: HTMLFormElement | undefined;
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
  private bookShelfRows: {
    '1': HTMLElement | null;
    '2': HTMLElement | null;
    '3': HTMLElement | null;
  };
  constructor(
    private seedBooks: { title: string; author: string; pages: number }[],
  ) {
    this.form = document.querySelector('#addBookForm') as HTMLFormElement;
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
    this.bookShelfRows = {
      '1': document.querySelector(`.shelf-1`),
      '2': document.querySelector(`.shelf-2`),
      '3': document.querySelector(`.shelf-3`),
    };

    this.bindEvents();
    this.seed();
  }

  private bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(this.form);
        const formData: AddBookForm = {
          title: data.get('title') as string,
          author: data.get('author') as string,
          pages: Number(data.get('pages')),
          read: data.get('read') === 'on',
          shelf: Number(data.get('shelf')),
        };

        this.addBook(
          formData.title,
          formData.author,
          formData.pages,
          formData.read,
          formData.shelf,
        );
      });
    }

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
            const book = this.libraryMap.get(bookId);
            if (book) {
              book.read = selectedValue;
            }
          }
        }
      });
    }
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

  private createBook(book: Book, bgColor: string) {
    const bookshelfRow =
      this.bookShelfRows[book.shelf.toString() as unknown as '1' | '2' | '3'];

    const darkerColor = Library.changeColor(bgColor, 20, true);
    const lighterColor = Library.changeColor(bgColor, 20, false);
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
    bookDiv.style.color = Library.getReadableTextColor(bgColor);
    bookDiv.style.width = book.width + 'px';
    bookDiv.style.setProperty('--outline-color', lighterColor);
    bookDiv.style.height = height + '%';

    bookDiv.dataset.zDepth = translateZ.toString();
    bookDiv.style.transform = `translateZ(${translateZ}px)`;

    bookDiv.addEventListener('click', (e: MouseEvent) => {
      const { dialog, title, author, pages, readTrue, readFalse } =
        this.showBookDialog;
      if (!dialog || !title || !author || !pages || !readTrue || !readFalse)
        return;
      const target = e.currentTarget as HTMLElement;
      const id = target.id;
      const rect = target.getBoundingClientRect();
      const book: Book | undefined = this.libraryMap.get(id);
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

    bookshelfRow?.append(bookDiv);
  }

  public addBook(
    title: string,
    author: string,
    pages: number,
    read: boolean,
    shelf: number,
  ) {
    const bgColor = Library.getRandomColor();
    const book = new Book(
      crypto.randomUUID(),
      title,
      author,
      pages,
      read,
      shelf,
      bgColor,
      Math.floor(Math.random() * 50 + 40),
    );

    this.libraryMap.set(book.id, book);
    this.createBook(book, bgColor);
  }

  private static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private static changeColor(hex: string, percent: number, dark: boolean) {
    percent = Math.min(100, Math.max(0, percent));

    hex = hex.replace(/^#/, '');

    // Parse R, G, B
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    if (dark) {
      r = Math.floor(r * (1 - percent / 100));
      g = Math.floor(g * (1 - percent / 100));
      b = Math.floor(b * (1 - percent / 100));
    } else {
      r = Math.floor(r + (255 - r) * (percent / 100));
      g = Math.floor(g + (255 - g) * (percent / 100));
      b = Math.floor(b + (255 - b) * (percent / 100));
    }

    // Recombine to hex
    const newHex =
      '#' +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    return newHex;
  }

  private static getReadableTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    let textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

    if (Math.random() < 0.2) {
      if (luminance < 0.7) {
        textColor = 'gold';
      }
    }

    return textColor;
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
