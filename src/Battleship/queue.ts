class Queue {
  head: Node | null = null;
  tail: Node | null = null;
  size = 0;

  enqueue(obj: any) {
    if (!this.head) {
      this.head = new Node(obj);
      this.tail = this.head;
    } else {
      this.tail!.nextNode = new Node(obj);
      this.tail = this.tail!.nextNode;
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

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

class Node {
  value: any;
  nextNode: Node | null;
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

export default Queue;
