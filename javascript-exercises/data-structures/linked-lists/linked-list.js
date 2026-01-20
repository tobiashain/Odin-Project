export class LinkedList {
  headNode = null;
  tailNode = null;

  append(value) {
    if (!headNode) {
      headNode = Node(value);
      tailNode = Node(value);
    } else {
      let indexNode = this.headNode;
      while (indexNode.nextNode) {
        indexNode = indexNode.nextNode;
      }
      indexNode.nextNode = Node(value);
      this.tailNode = indexNode.nextNode;
    }
  }

  prepend(value) {
    if (!this.headNode) {
      this.headNode = Node(value);
    } else {
      this.headNode = Node(value, this.headNode);
    }
  }

  size() {
    if (!this.headNode) return 0;
    let counter = 1;
    let indexNode = this.headNode;
    while (indexNode.nextNode) {
      counter++;
      indexNode = indexNode.nextNode;
    }
    return counter;
  }

  head() {
    return this.headNode;
  }

  tail() {
    return this.tailNode;
  }

  at(index) {
    let value = undefined;
    let temp = this.headNode;
    for (let i = 0; i < this.size(); i++) {
      if (index === i) return temp.value;
      temp = temp.nextNode;
    }
    return value;
  }

  pop() {
    let popHead = this.headNode.value;
    this.headNode = this.headNode.nextNode;
    return popHead;
  }

  contains(value) {
    let contains = false;
    let temp = this.headNode;
    do {
      if (temp.value === value) {
        contains = true;
        break;
      }
    } while (temp.nextNode);

    return contains;
  }

  findIndex(value) {
    let index = -1;
    let counter = 0;
    let temp = this.headNode;
    do {
      if (temp.value === value) {
        index = counter;
        break;
      }
      counter++;
    } while (temp.nextNode);

    return index;
  }

  toString() {}

  insertAt(index, ...values) {}

  removeAt(index) {}
}

class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}
