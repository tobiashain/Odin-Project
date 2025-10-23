class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public pages: number,
    public read: boolean,
  ) {}

  public info() {
    if (this.read) {
      return `${this.title} by ${this.author}, ${this.pages} pages, already read.`;
    }
    return `${this.title} by ${this.author}, ${this.pages} pages, not read yet.`;
  }
}

interface AddBookForm {
  title: string;
  author: string;
  pages: number;
  read: boolean;
}

const library: Book[] = [];

const bookshelf = document.querySelector('#bookshelf');
const form = document.querySelector('#addBookForm') as HTMLFormElement;
const dialog = document.querySelector('dialog');
document.querySelector('#newBook')?.addEventListener('click', () => {
  dialog?.showModal();
});

document.querySelector('#addBookForm')!.addEventListener('submit', (event) => {
  const data = new FormData(form);
  const formData: AddBookForm = {
    title: data.get('title') as string,
    author: data.get('author') as string,
    pages: Number(data.get('pages')),
    read: data.get('read') === 'on',
  };
  const book = new Book(
    crypto.randomUUID(),
    formData.title,
    formData.author,
    formData.pages,
    formData.read,
  );

  library.push(book);
  const bookDiv = document.createElement('div');
  bookDiv.className = 'book';
  bookDiv.id = crypto.randomUUID();
  bookDiv.innerHTML = `
      <div class="informations">
      <div class="title">${book.title}</div>
      <div class="author">${book.author}</div>
      <div class="pages">${book.pages} Pages</div>
      <div class="read">${book.read}</div>
      </div>
      <div class="settings">
        <input type="radio" name="isRead" value="true" class="isReadTrue">
        <label for="isReadTrue">Read</label>
        <input type="radio" name="isRead" value="false" class="isReadFalse">
        <label for="isReadFalse">Unread </label>
      </div>
    `;
  bookshelf?.append(bookDiv);
  requestAnimationFrame(() => {
    const tempBook = document.getElementById(`${bookDiv.id}`);
    console.log(tempBook);
    if (tempBook) {
      if (book.read) {
        tempBook.querySelector<HTMLInputElement>('.isReadTrue')!.checked = true;
      } else {
        tempBook.querySelector<HTMLInputElement>('.isReadFalse')!.checked =
          true;
      }
    }
    dialog?.close();
  });
});
