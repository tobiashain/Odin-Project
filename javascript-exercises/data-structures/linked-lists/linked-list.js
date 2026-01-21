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
    let string = '';
    let temp = this.headNode;

    if (!temp) return '';

    while (temp) {
      string = string + `( ${temp.value} ) -> `;
      temp = temp.nextNode;
    }

    string = string + 'null';

    return string;
  }

  insertAt(index, ...values) {
    if (index < 0 || index > this.length - 1) throw new RangeError();
    let counter = 0;
    let temp = this.headNode;

    while (counter <= index) {
      if (index === counter) {
        let right = temp.nextNode;
        values.forEach((item, ind) => {
          temp.nextNode = new Node(item);
          if (index === 0 && ind === 0) {
            this.headNode = temp.nextNode;
          }
          temp = temp.nextNode;
          this.length++;
        });
        temp.nextNode = right;
      }

      counter++;
    }
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
        if (index === this.length - 1) {
          this.tailNode = previousNode;
        }

        break;
      }
      previousNode = temp;
      temp = temp.nextNode;
    }
    this.length--;
  }
}

class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

module.exports = { LinkedList, Node };
