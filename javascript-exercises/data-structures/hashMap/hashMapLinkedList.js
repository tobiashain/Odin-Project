//Linked list updated to have a key

class LinkedList {
  headNode = undefined;
  tailNode = undefined;
  length = 0;

  append(key, value) {
    const newNode = new Node(key, value);
    if (!this.headNode) {
      this.headNode = newNode;
      this.tailNode = newNode;
    } else {
      this.tailNode.nextNode = newNode;
      this.tailNode = newNode;
    }
    this.length++;
  }

  prepend(key, value) {
    const newNode = new Node(key, value, this.headNode);
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

  removeByKey(key) {
    let current = this.headNode;
    let prev = null;

    while (current) {
      if (current.key === key) {
        if (prev) {
          prev.nextNode = current.nextNode;
        } else {
          this.headNode = current.nextNode;
        }
        if (current === this.tailNode) {
          this.tailNode = prev;
        }
        this.length--;
        return true;
      }
      prev = current;
      current = current.nextNode;
    }
    return false;
  }

  containsKey(key) {
    let temp = this.headNode;
    while (temp) {
      if (temp.key === key) return true;
      temp = temp.nextNode;
    }
    return false;
  }

  getValue(key) {
    let temp = this.headNode;
    while (temp) {
      if (temp.key === key) return temp.value;
      temp = temp.nextNode;
    }
    return undefined;
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
}

class Node {
  constructor(key, value, nextNode = null) {
    this.key = key;
    this.value = value;
    this.nextNode = nextNode;
  }
}

module.exports = { LinkedList };
