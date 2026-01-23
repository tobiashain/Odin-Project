class LinkedList {
  headNode = undefined;
  tailNode = undefined;
  length = 0;

  append(value) {
    if (!this.headNode) {
      this.headNode = new Node(value);
      this.tailNode = this.headNode;
    } else {
      this.tailNode.nextNode = new Node(value);
      this.tailNode = this.tailNode.nextNode;
    }
    this.length++;
  }

  prepend(value) {
    let newNode = new Node(value, this.headNode);
    this.headNode = newNode;
    if (!this.tailNode) this.tailNode = newNode;
    this.length++;
  }

  size() {
    return this.length;
  }

  head() {
    if (!this.headNode) return undefined;
    return this.headNode.value;
  }

  tail() {
    if (!this.tailNode) return undefined;
    return this.tailNode.value;
  }

  at(index) {
    if (index < 0 || index > this.length - 1) throw new RangeError();
    let value = undefined;
    let temp = this.headNode;

    for (let i = 0; i < this.length; i++) {
      if (index === i) return temp.value;
      temp = temp.nextNode;
    }

    return value;
  }

  shift() {
    if (!this.headNode) return undefined;

    let popHead = this.headNode.value;
    this.headNode = this.headNode.nextNode;
    if (!this.headNode) this.tailNode = undefined;
    this.length--;
    return popHead;
  }

  pop() {
    if (!this.headNode) return undefined;

    let popTail = this.tailNode.value;

    if (this.length === 1) {
      this.headNode = undefined;
      this.tailNode = undefined;
    } else {
      let temp = this.headNode;

      while (temp.nextNode !== this.tailNode) {
        temp = temp.nextNode;
      }
      temp.nextNode = undefined;
      this.tailNode = temp;
    }

    this.length--;
    return popTail;
  }

  contains(value) {
    let temp = this.headNode;

    while (temp) {
      if (temp.value === value) {
        return true;
      }
      temp = temp.nextNode;
    }

    return false;
  }

  findIndex(value) {
    let counter = 0;
    let temp = this.headNode;
    while (temp) {
      if (temp.value === value) {
        return counter;
      }
      temp = temp.nextNode;
      counter++;
    }

    return -1;
  }

  toString() {
    const parts = [];
    let temp = this.headNode;

    if (!temp) return '';

    while (temp) {
      parts.push(`( ${temp.value} )`);
      temp = temp.nextNode;
    }

    parts.push('null');
    return parts.join(' -> ');
  }

  insertAt(index, ...values) {
    if (index < 0 || index > this.length) {
      throw new RangeError();
    }

    if (index === 0) {
      for (let i = values.length - 1; i >= 0; i--) {
        const node = new Node(values[i]);
        node.nextNode = this.headNode;
        this.headNode = node;
        this.length++;
      }
      return;
    }

    let temp = this.headNode;
    let counter = 0;

    while (counter < index - 1) {
      temp = temp.nextNode;
      counter++;
    }

    const right = temp.nextNode;

    values.forEach((item) => {
      temp.nextNode = new Node(item);
      temp = temp.nextNode;
      this.length++;
    });

    temp.nextNode = right;
  }

  removeAt(index) {
    if (index < 0 || index > this.length - 1) throw new RangeError();
    if (index === 0) {
      this.headNode = this.headNode.nextNode;
      if (!this.headNode) this.tailNode = undefined;
      this.length--;
      return;
    }

    let counter = 1;
    let temp = this.headNode.nextNode;
    let previousNode = this.headNode;

    while (temp) {
      if (index === counter) {
        previousNode.nextNode = temp.nextNode;
        if (temp === this.tailNode) {
          this.tailNode = previousNode;
        }
        this.length--;
        return;
      }
      previousNode = temp;
      temp = temp.nextNode;
      counter++;
    }
  }
}

class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

module.exports = { LinkedList, Node };
