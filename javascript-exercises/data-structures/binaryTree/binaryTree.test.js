const { Node, Tree } = require('./binaryTree');

describe('Binary Search Tree', () => {
  let tree;
  const input = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

  beforeEach(() => {
    tree = new Tree(input);
  });

  describe('Node', () => {
    test('creates a node with value, left, and right properties', () => {
      const node = new Node(10);
      expect(node.value).toBe(10);
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    });
  });

  describe('buildTree / Tree initialization', () => {
    test('creates a balanced tree with a root node', () => {
      tree.prettyPrint(tree.root);
      expect(tree.root).toBeInstanceOf(Node);
      expect(tree.isBalanced()).toBe(true);
    });

    test('removes duplicates and sorts values', () => {
      const values = [];
      tree.inOrderForEach((node) => values.push(node.value));

      const sortedUnique = [...new Set(input)].sort((a, b) => a - b);
      expect(values).toEqual(sortedUnique);
    });
  });

  describe('insert', () => {
    test('inserts a value into the tree', () => {
      tree.insert(42);
      const node = tree.find(42);

      expect(node).not.toBeNull();
      expect(node.value).toBe(42);
    });
  });

  describe('deleteItem', () => {
    test('removes a leaf node', () => {
      tree.insert(100);
      tree.deleteItem(100);

      expect(tree.find(100)).toBeNull();
    });

    test('removes a node with one child', () => {
      tree.insert(2);
      tree.insert(1);
      tree.deleteItem(2);

      expect(tree.find(2)).toBeNull();
      expect(tree.find(1)).not.toBeNull();
    });

    test('removes a node with two children', () => {
      tree.deleteItem(7);
      expect(tree.find(7)).toBeNull();
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe('find', () => {
    test('returns the node with the given value', () => {
      const node = tree.find(23);
      expect(node).not.toBeNull();
      expect(node.value).toBe(23);
    });

    test('returns null if value is not found', () => {
      expect(tree.find(9999)).toBeNull();
    });
  });

  describe('traversal methods', () => {
    test('levelOrderForEach traverses breadth-first', () => {
      const result = [];
      tree.levelOrderForEach((node) => result.push(node.value));

      expect(result[0]).toBe(tree.root.value);
    });

    test('inOrderForEach traverses in sorted order', () => {
      const result = [];
      tree.inOrderForEach((node) => result.push(node.value));

      const sortedUnique = [...new Set(input)].sort((a, b) => a - b);
      expect(result).toEqual(sortedUnique);
    });

    test('throws an error if no callback is provided', () => {
      expect(() => tree.levelOrderForEach()).toThrow(Error);
      expect(() => tree.inOrderForEach()).toThrow(Error);
      expect(() => tree.preOrderForEach()).toThrow(Error);
      expect(() => tree.postOrderForEach()).toThrow(Error);
    });
  });

  describe('height', () => {
    test('returns the height of a node', () => {
      const height = tree.height(tree.root.value);
      expect(typeof height).toBe('number');
      expect(height).toBeGreaterThanOrEqual(0);
    });

    test('returns null for a missing value', () => {
      expect(tree.height(9999)).toBeNull();
    });
  });

  describe('depth', () => {
    test('returns the depth of a node', () => {
      const depth = tree.depth(tree.root.value);
      expect(depth).toBe(0);
    });

    test('returns null for a missing value', () => {
      expect(tree.depth(9999)).toBeNull();
    });
  });

  describe('isBalanced and rebalance', () => {
    test('detects an unbalanced tree and rebalances it', () => {
      tree.insert(1000);
      tree.insert(2000);
      tree.insert(3000);

      expect(tree.isBalanced()).toBe(false);

      tree.rebalance();

      expect(tree.isBalanced()).toBe(true);
    });
  });
});
