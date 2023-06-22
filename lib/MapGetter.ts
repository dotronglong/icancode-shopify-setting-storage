import {Getter, HashMap} from '@icancode/base';

export default class MapGetter implements Getter {
  private data: HashMap;

  constructor(data: HashMap) {
    this.data = data;
  }

  all(): HashMap {
    return this.data;
  }

  get(name: string) {
    return this.data[name];
  }

  getString(name: string): string | undefined {
    const value = this.get(name);
    if (value !== undefined) {
      return `${value}`;
    }
  }

  getBoolean(name: string): boolean | undefined {
    const value = this.get(name);
    if (value !== undefined) {
      if (typeof value === 'string') {
        const lv = value.toLowerCase();
        return lv === 'true' || lv === '1';
      } else if (typeof value === 'number' && (value === 1 || value === 0)) {
        return value === 1;
      } else if (typeof value === 'boolean') {
        return value;
      }
    }
  }

  getNumber(name: string): number | undefined {
    const value = this.get(name);
    if (value !== undefined && !isNaN(value)) {
      return parseFloat(value);
    }
  }
}
