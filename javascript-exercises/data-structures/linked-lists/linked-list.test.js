const { LinkedList, Node } = require('./linked-list');

describe('Node', () => {
  test('initializes with value and nextNode set to null by default', () => {
    const node = new Node();
    expect(node.value).toBeNull();
    expect(node.nextNode).toBeNull();
  });

  test('accepts an initial value', () => {
    const node = new Node(42);
    expect(node.value).toBe(42);
    expect(node.nextNode).toBeNull();
  });
});

describe('LinkedList', () => {
  let list;

  beforeEach(() => {
    list = new LinkedList();
  });

  test('starts empty', () => {
    expect(list.size()).toBe(0);
    expect(list.head()).toBeUndefined();
    expect(list.tail()).toBeUndefined();
    expect(list.toString()).toBe('');
  });

  describe('append', () => {
    test('adds values to the end of the list', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.size()).toBe(3);
      expect(list.head()).toBe(1);
      expect(list.tail()).toBe(3);
    });
  });

  describe('prepend', () => {
    test('adds values to the start of the list', () => {
      list.prepend(1);
      list.prepend(2);

      expect(list.size()).toBe(2);
      expect(list.head()).toBe(2);
      expect(list.tail()).toBe(1);
    });
  });

  describe('at', () => {
    test('returns value at given index', () => {
      list.append('a');
      list.append('b');
      list.append('c');

      expect(list.at(0)).toBe('a');
      expect(list.at(1)).toBe('b');
      expect(list.at(2)).toBe('c');
    });

    test('returns undefined for out-of-bounds index', () => {
      list.append(1);
      expect(list.at(5)).toBeUndefined();
      expect(list.at(-1)).toBeUndefined();
    });
  });

  describe('pop', () => {
    test('removes and returns the head node value', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const value = list.pop();

      expect(value).toBe(1);
      expect(list.size()).toBe(2);
      expect(list.head()).toBe(2);
    });

    test('returns undefined when popping from empty list', () => {
      expect(list.pop()).toBeUndefined();
    });
  });

  describe('contains', () => {
    test('returns true if value exists', () => {
      list.append(10);
      list.append(20);

      expect(list.contains(10)).toBe(true);
      expect(list.contains(20)).toBe(true);
    });

    test('returns false if value does not exist', () => {
      list.append(10);
      expect(list.contains(99)).toBe(false);
    });
  });

  describe('findIndex', () => {
    test('returns index of first matching value', () => {
      list.append('x');
      list.append('y');
      list.append('x');

      expect(list.findIndex('x')).toBe(0);
      expect(list.findIndex('y')).toBe(1);
    });

    test('returns -1 if value not found', () => {
      list.append(1);
      expect(list.findIndex(2)).toBe(-1);
    });
  });

  describe('toString', () => {
    test('returns formatted string representation', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.toString()).toBe('( 1 ) -> ( 2 ) -> ( 3 ) -> null');
    });

    test('returns empty string for empty list', () => {
      expect(list.toString()).toBe('');
    });
  });

  describe('insertAt', () => {
    test.skip('inserts values at given index', () => {
      list.append(1);
      list.append(4);

      list.insertAt(1, 2, 3);

      expect(list.size()).toBe(4);
      expect(list.toString()).toBe('( 1 ) -> ( 2 ) -> ( 3 ) -> ( 4 ) -> null');
    });

    test.skip('inserts at head', () => {
      list.append(2);
      list.insertAt(0, 1);

      expect(list.head()).toBe(1);
    });

    test.skip('throws RangeError for out-of-bounds index', () => {
      expect(() => list.insertAt(-1, 1)).toThrow(RangeError);
      expect(() => list.insertAt(1, 1)).toThrow(RangeError);
    });
  });

  describe('removeAt', () => {
    test.skip('removes node at given index', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      list.removeAt(1);

      expect(list.size()).toBe(2);
      expect(list.toString()).toBe('( 1 ) -> ( 3 ) -> null');
    });

    test.skip('removes head node', () => {
      list.append(1);
      list.append(2);

      list.removeAt(0);

      expect(list.head()).toBe(2);
    });

    test.skip('throws RangeError for out-of-bounds index', () => {
      expect(() => list.removeAt(0)).toThrow(RangeError);

      list.append(1);

      expect(() => list.removeAt(-1)).toThrow(RangeError);
      expect(() => list.removeAt(1)).toThrow(RangeError);
    });
  });
});
