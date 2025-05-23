import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';

export interface WebDAVConfig {
  name: string;
  url: string;
  username: string;
  password: string;
}

const STORAGE_KEY = 'webdav_connections';
const SELECTED_KEY = 'webdav_selected_index';

class WebDAVStore {
  connections: WebDAVConfig[] = [];
  selected: number | null = null;
  loading = true;

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  async load() {
    this.loading = true;
    try {
      const connStr = await AsyncStorage.getItem(STORAGE_KEY);
      const selStr = await AsyncStorage.getItem(SELECTED_KEY);
      runInAction(() => {
        this.connections = connStr ? JSON.parse(connStr) : [];
        this.selected = selStr ? Number(selStr) : null;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => { this.loading = false; });
    }
  }

  async addConnection(conn: WebDAVConfig) {
    this.connections.push(conn);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.connections));
  }

  async selectConnection(idx: number) {
    this.selected = idx;
    await AsyncStorage.setItem(SELECTED_KEY, String(idx));
  }

  get selectedConfig(): WebDAVConfig | null {
    if (this.selected == null) return null;
    return this.connections[this.selected] || null;
  }
}

export const webdavStore = new WebDAVStore(); 