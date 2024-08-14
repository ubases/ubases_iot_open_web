// @utils/sessionStorage.js

class StorageManager {
  constructor() {
    this.storage = window.sessionStorage;
  }

  // 存储数据
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    this.storage.setItem(key, value);
  }

  // 获取数据，并尝试JSON解析
  get(key) {
    const storedValue = this.storage.getItem(key);
    if (storedValue && typeof storedValue === 'string') {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        // 如果不是JSON格式，直接返回原始字符串
        return storedValue;
      }
    }
    return null;
  }

  // 删除单个数据项
  remove(key) {
    this.storage.removeItem(key);
  }

  // 清空所有存储的数据
  clear() {
    this.storage.clear();
  }
}

// 导出默认为sessionStorage管理器
export default new StorageManager('sessionStorage');

