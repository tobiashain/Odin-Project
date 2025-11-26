import backButton from '../shared';
import home from './home';
import menu from './menu';
import contact from './contact';

interface Node {
  tag: string;
  class?: string;
  attrs?: string;
  children?: Array<Node | string>;
}

const content = document.querySelector('#content');

document.querySelectorAll('nav>button').forEach((btn) => {
  btn.addEventListener('click', (e: Event) => {
    const id: string = (e.target as HTMLButtonElement)!.id;
    if (!content) {
      return;
    }
    content.innerHTML = '';
    switch (id) {
      case 'home': {
        content.appendChild(createNode(home));
        break;
      }
      case 'menu': {
        content.appendChild(createNode(menu));
        break;
      }
      case 'contact': {
        content.appendChild(createNode(contact));
        break;
      }
    }
  });
});

function createNode(node: Node | string) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const el = document.createElement(node.tag);

  if (node.class) {
    el.className = node.class;
  }

  if (node.attrs) {
    el.setAttribute('src', node.attrs);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => {
      el.appendChild(createNode(child));
    });
  }

  return el;
}

const tree: Node = {
  tag: 'div',
  class: 'container',
  children: [
    {
      tag: 'div',
      class: 'head',
      children: [
        {
          tag: 'h1',
          class: 'title',
          children: ['Cookeria'],
        },
        {
          tag: 'div',
          class: 'text',
          children: [
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
          ],
        },
      ],
    },
    {
      tag: 'img',
      class: 'head-image',
      attrs: 'https://picsum.photos/1920/900',
    },
  ],
};

document.querySelector('header')?.appendChild(createNode(tree));
content?.appendChild(createNode(home));
