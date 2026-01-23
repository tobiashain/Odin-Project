const { HashMap } = require('./hashMap');

describe('HashMap', () => {
  let map;

  beforeEach(() => {
    map = new HashMap();
  });

  test('initializes with default capacity 16 and load factor 0.75', () => {
    expect(map.capacity).toBe(16);
    expect(map.loadFactor).toBe(0.75);
  });

  test('set() stores and retrieves a value', () => {
    map.set('foo', 'bar');
    expect(map.get('foo')).toBe('bar');
  });

  test('set() overwrites value for existing key', () => {
    map.set('foo', 'old');
    map.set('foo', 'new');
    expect(map.get('foo')).toBe('new');
    expect(map.length()).toBe(1);
  });

  test('get() returns undefined for missing key', () => {
    expect(map.get('missing')).toBeUndefined();
  });

  test('has() returns true for existing key', () => {
    map.set('key', 'value');
    expect(map.has('key')).toBe(true);
  });

  test('has() returns false for missing key', () => {
    expect(map.has('nope')).toBe(false);
  });

  test('remove() deletes an existing key and returns true', () => {
    map.set('a', 1);
    expect(map.remove('a')).toBe(true);
    expect(map.has('a')).toBe(false);
    expect(map.length()).toBe(0);
  });

  test('remove() returns false when key does not exist', () => {
    expect(map.remove('ghost')).toBe(false);
  });

  test('length() reflects number of stored keys', () => {
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    expect(map.length()).toBe(3);
  });

  test('clear() removes all entries', () => {
    map.set('a', 1);
    map.set('b', 2);
    map.clear();
    expect(map.length()).toBe(0);
    expect(map.get('a')).toBeUndefined();
  });

  test('getKeys() returns all keys', () => {
    map.set('x', 10);
    map.set('y', 20);
    const keys = map.getKeys();
    expect(keys).toEqual(expect.arrayContaining(['x', 'y']));
  });

  test('getValues() returns all values', () => {
    map.set('x', 10);
    map.set('y', 20);
    const values = map.getValues();
    expect(values).toEqual(expect.arrayContaining([10, 20]));
  });

  test('getEntries() returns key-value pairs', () => {
    map.set('x', 10);
    map.set('y', 20);
    const entries = map.getEntries();
    expect(entries).toEqual(
      expect.arrayContaining([
        ['x', 10],
        ['y', 20],
      ]),
    );
  });

  test('handles collisions correctly', () => {
    // These keys are intentionally chosen to collide in many simple hash functions
    map.set('ab', 1);
    map.set('ba', 2);

    expect(map.get('ab')).toBe(1);
    expect(map.get('ba')).toBe(2);
    expect(map.length()).toBe(2);
  });

  test('removing one key in a collision bucket does not affect others', () => {
    map.set('ab', 1);
    map.set('ba', 2);

    map.remove('ab');
    expect(map.get('ab')).toBeUndefined();
    expect(map.get('ba')).toBe(2);
  });

  test('resizes when load factor is exceeded', () => {
    const initialCapacity = map.capacity;

    // Insert more than 75% of capacity
    for (let i = 0; i < 13; i++) {
      map.set(`key${i}`, i);
    }

    expect(map.capacity).toBeGreaterThan(initialCapacity);
    expect(map.length()).toBe(13);
  });

  test('all entries remain accessible after resize', () => {
    for (let i = 0; i < 20; i++) {
      map.set(`key${i}`, i);
    }

    for (let i = 0; i < 20; i++) {
      expect(map.get(`key${i}`)).toBe(i);
    }
  });

  test('handles very long string keys without crashing', () => {
    const longKey = 'a'.repeat(100_000);
    map.set(longKey, 'value');
    expect(map.get(longKey)).toBe('value');
  });

  test('does not allow non-string keys (edge case)', () => {
    expect(() => map.set(123, 'value')).toThrow();
    expect(() => map.get({})).toThrow();
  });

  test('keys(), values(), and entries() return empty arrays when map is empty', () => {
    expect(map.getKeys()).toEqual([]);
    expect(map.getValues()).toEqual([]);
    expect(map.getEntries()).toEqual([]);
  });
});
