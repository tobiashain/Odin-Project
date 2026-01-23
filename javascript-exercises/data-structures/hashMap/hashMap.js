const { LinkedList } = require('./hashMapLinkedList');

class HashMap {
  loadFactor = 0.75;
  capacity = 16;
  buckets = Array.from({ length: this.capacity }, () => new LinkedList());
  entries = 0;

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
      hashCode |= 0; // Force 32-bit int to avoid overflow issues
    }

    return hashCode;
  }

  set(key, value) {
    this.checkValidKey(key);
    const bucket = this.getBucketForKey(key);

    if (bucket.containsKey(key)) {
      bucket.removeByKey(key);
    } else {
      this.entries++;
    }
    bucket.append(key, value);

    if (this.entries > this.capacity * this.loadFactor) {
      this.resize();
    }
  }

  get(key) {
    this.checkValidKey(key);
    const bucket = this.getBucketForKey(key);
    return bucket.getValue(key);
  }

  has(key) {
    this.checkValidKey(key);
    const bucket = this.getBucketForKey(key);
    return bucket.containsKey(key);
  }

  remove(key) {
    this.checkValidKey(key);
    const bucket = this.getBucketForKey(key);
    const deleted = bucket.removeByKey(key);
    if (deleted) this.entries--;
    return deleted;
  }

  length() {
    return this.entries;
  }

  clear() {
    this.capacity = 16;
    this.entries = 0;
    this.buckets = Array.from(
      { length: this.capacity },
      () => new LinkedList(),
    );
  }

  getKeys() {
    let arr = [];
    this.buckets.forEach((bucket) => {
      let bucketKeys = bucket.getAll('keys');
      arr.push(...bucketKeys);
    });
    return arr;
  }

  getValues() {
    let arr = [];
    this.buckets.forEach((bucket) => {
      let bucketValues = bucket.getAll('values');
      arr.push(...bucketValues);
    });
    return arr;
  }

  getEntries() {
    let arr = [];
    this.buckets.forEach((bucket) => {
      let bucketValues = bucket.getAll('entries');
      arr.push(...bucketValues);
    });
    return arr;
  }

  getBucketForKey(key) {
    const hash = this.hash(key);
    const index = Math.abs(hash) % this.capacity;

    if (!this.buckets[index]) {
      this.buckets[index] = new LinkedList();
    }

    return this.buckets[index];
  }

  checkValidKey(key) {
    if (typeof key !== 'string')
      throw new Error('Invalid Key format, key must be a string.');
  }

  resize() {
    const oldBuckets = this.buckets;

    this.capacity *= 2;
    this.buckets = Array.from(
      { length: this.capacity },
      () => new LinkedList(),
    );
    this.entries = 0;

    for (const bucket of oldBuckets) {
      if (!bucket) continue;
      let current = bucket.headNode;
      while (current) {
        const { key, value } = current;
        if (key !== undefined) {
          this.set(key, value);
        }
        current = current.next;
      }
    }
  }
}

module.exports = { HashMap };
