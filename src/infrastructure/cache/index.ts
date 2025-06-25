export interface ICache<K, V> {
  get(key: K): V | null;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): void;
  clear(): void;
}

export class InMemoryCache<K, V> implements ICache<K, V> {
  private store = new Map<K, { value: V; timestamp: number }>();
  constructor(private ttlMs: number) {}

  get(key: K): V | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: K, value: V) {
    this.store.set(key, { value, timestamp: Date.now() });
  }

  has(key: K) {
    return this.get(key) !== undefined;
  }

  delete(key: K) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}
