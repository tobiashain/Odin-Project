export default {
  tag: 'div',
  class: 'home',
  children: [
    {
      tag: 'div',
      class: 'about-us',
      children: [
        {
          tag: 'h2',
          class: 'subtitle',
          children: ['About Us'],
        },
        {
          tag: 'div',
          class: 'container',
          children: [
            {
              tag: 'div',
              class: 'image',
              children: [
                {
                  tag: 'img',
                  class: 'about-us-image',
                  attrs: 'https://picsum.photos/600/600',
                },
              ],
            },
            {
              tag: 'div',
              class: 'text-container',
              children: [
                { tag: 'h3', class: 'subline', children: ['Lorem ipsum'] },
                {
                  tag: 'div',
                  class: 'text',
                  children: [
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
                  ],
                },
                { tag: 'h3', class: 'subline', children: ['Lorem ipsum'] },
                {
                  tag: 'div',
                  class: 'text',
                  children: [
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
                  ],
                },
                { tag: 'h3', class: 'subline', children: ['Lorem ipsum'] },
                {
                  tag: 'div',
                  class: 'text',
                  children: [
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      tag: 'div',
      class: 'menu',
      children: [
        {
          tag: 'h2',
          class: 'subtitle',
          children: ['Menu'],
        },
        {
          tag: 'div',
          class: 'flex-container',
          children: [
            {
              tag: 'div',
              class: 'flex-item',
              children: [
                {
                  tag: 'img',
                  class: 'flex-image',
                  attrs: 'https://picsum.photos/800/500?random=1',
                },
                {
                  tag: 'h3',
                  children: ['Dish Name'],
                },
                {
                  tag: 'p',
                  class: 'price',
                  children: ['$12.99'],
                },
                {
                  tag: 'p',
                  class: 'description',
                  children: [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  ],
                },
              ],
            },
            {
              tag: 'div',
              class: 'flex-item',
              children: [
                {
                  tag: 'img',
                  class: 'flex-image',
                  attrs: 'https://picsum.photos/800/500?random=2',
                },
                {
                  tag: 'h3',
                  children: ['Dish Name'],
                },
                {
                  tag: 'p',
                  class: 'price',
                  children: ['$12.99'],
                },
                {
                  tag: 'p',
                  class: 'description',
                  children: [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  ],
                },
              ],
            },
            {
              tag: 'div',
              class: 'flex-item',
              children: [
                {
                  tag: 'img',
                  class: 'flex-image',
                  attrs: 'https://picsum.photos/800/500?random=3',
                },
                {
                  tag: 'h3',
                  children: ['Dish Name'],
                },
                {
                  tag: 'p',
                  class: 'price',
                  children: ['$12.99'],
                },
                {
                  tag: 'p',
                  class: 'description',
                  children: [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
