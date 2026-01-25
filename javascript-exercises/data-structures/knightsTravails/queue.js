class Queue {
  head = null;
  tail = null;
  size = 0;

  enqueue(obj) {
    if (!this.head) {
      this.head = new Node(obj);
      this.tail = this.head;
    } else {
      this.tail.nextNode = new Node(obj);
      this.tail = this.tail.nextNode;
    }
    this.size++;
  }

  dequeue() {
    if (!this.head) return null;

    const item = this.head.value;
    this.head = this.head.nextNode;
    if (!this.head) this.tail = null;
    this.size--;

    return item;
  }

  length() {
    return this.size;
  }
}

class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

module.exports = { Queue };
