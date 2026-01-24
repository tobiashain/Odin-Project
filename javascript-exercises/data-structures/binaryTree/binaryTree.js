const { Queue } = require('./queue');

class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(arr) {
    this.arr = sortArray(arr);
    this.root = this.buildTree(this.arr);
    //this.prettyPrint(this.root);
  }

  buildTree(arr) {
    const recurse = (arr, start, end) => {
      if (start > end) return null;

      const mid = start + Math.floor((end - start) / 2);
      const root = new Node(arr[mid]);

      root.left = recurse(arr, start, mid - 1);
      root.right = recurse(arr, mid + 1, end);

      return root;
    };
    return recurse(arr, 0, arr.length - 1);
  }

  insert(value) {
    const recurse = (root) => {
      if (!root) return new Node(value);

      if (value < root.value) {
        root.left = recurse(root.left);
      } else if (value > root.value) {
        root.right = recurse(root.right);
      } else {
        return root;
      }

      return root;
    };

    this.root = recurse(this.root);
  }

  deleteItem(value) {
    const recurse = (root, value) => {
      if (!root) return root;

      if (value < root.value) {
        root.left = recurse(root.left, value);
        return root;
      } else if (value > root.value) {
        root.right = recurse(root.right, value);
        return root;
      } else if (value === root.value) {
        if (!root.left) return root.right;
        if (!root.right) return root.left;

        const succ = getSuccessor(root);
        root.value = succ.value;
        root.right = recurse(root.right, succ.value);
      }
    };

    // Get inorder successor (smallest in right subtree)
    const getSuccessor = (curr) => {
      curr = curr.right;
      while (curr !== null && curr.left !== null) curr = curr.left;
      return curr;
    };

    this.root = recurse(this.root, value);
  }

  find(value) {
    const recurse = (root) => {
      if (!root) return null;

      if (value === root.value) {
        return root;
      } else if (value < root.value) {
        return recurse(root.left);
      } else {
        return recurse(root.right);
      }
    };

    return recurse(this.root);
  }

  levelOrderForEach(callback) {
    if (!callback) throw new Error('No callback given.');

    const q = new Queue();

    q.enqueue(this.root);

    while (q.length() > 0) {
      let node = q.dequeue();
      callback(node);

      if (node.left) q.enqueue(node.left);
      if (node.right) q.enqueue(node.right);
    }
  }

  inOrderForEach(callback) {
    if (!callback) throw new Error('No callback given.');

    const recurse = (node) => {
      if (!node) return;

      recurse(node.left);
      callback(node);
      recurse(node.right);
    };

    recurse(this.root);
  }

  preOrderForEach(callback) {
    if (!callback) throw new Error('No callback given.');

    const recurse = (node) => {
      if (!node) return;

      callback(node);
      recurse(node.left);
      recurse(node.right);
    };

    recurse(this.root);
  }

  postOrderForEach(callback) {
    if (!callback) throw new Error('No callback given.');

    const recurse = (node) => {
      if (!node) return;

      recurse(node.left);
      recurse(node.right);
      callback(node);
    };

    recurse(this.root);
  }

  height(value) {}

  depth(value) {}

  isBalanced() {}

  rebalance() {}

  prettyPrint(node, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false,
      );
    }
    process.stdout.write(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}\n`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
}

function sortArray(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = sortArray(arr.slice(0, mid));
  const right = sortArray(arr.slice(mid));

  const sortedArray = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      sortedArray.push(left[i]);
      i++;
    } else if (left[i] > right[j]) {
      sortedArray.push(right[j]);
      j++;
    } else {
      // left[i] === right[j], skip duplicate
      sortedArray.push(left[i]);
      i++;
      j++;
    }
  }

  while (i < left.length) {
    // skip duplicates at the boundary
    if (sortedArray[sortedArray.length - 1] !== left[i]) {
      sortedArray.push(left[i]);
    }
    i++;
  }

  while (j < right.length) {
    if (sortedArray[sortedArray.length - 1] !== right[j]) {
      sortedArray.push(right[j]);
    }
    j++;
  }

  return sortedArray;
}

module.exports = { Node, Tree };
