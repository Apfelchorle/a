// index.js - Main entry point with Web Worker support

import AnimeToSho from './animetosho.js';
import NyaaSi from './nyaasi.js';
import PirateBay from './piratebay.js';
import SeaDex from './seadex.js';

// Worker-based torrent search manager
class TorrentSearchManager {
  constructor() {
    this.worker = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.useWorker = typeof Worker !== 'undefined';
    
    if (this.useWorker) {
      try {
        this.worker = new Worker('./torrent-worker.js', { type: 'module' });
        this.setupWorkerListeners();
      } catch (error) {
        console.warn('Web Worker initialization failed, falling back to main thread:', error);
        this.useWorker = false;
      }
    }
  }

  setupWorkerListeners() {
    this.worker.onmessage = (event) => {
      const { id, success, data, error } = event.data;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        if (success) {
          pending.resolve(data);
        } else {
          pending.reject(new Error(error));
        }
        this.pendingRequests.delete(id);
      }
    };

    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
    };
  }

  async search(scraper, query, options = {}) {
    if (this.useWorker && this.worker) {
      return this.searchWithWorker(scraper, query, options);
    } else {
      return this.searchMainThread(scraper, query, options);
    }
  }

  searchWithWorker(scraper, query, options) {
    return new Promise((resolve, reject) => {
      const id = this.requestId++;
      
      this.pendingRequests.set(id, { resolve, reject });
      
      this.worker.postMessage({
        id,
        scraper,
        query,
        options
      });
    });
  }

  async searchMainThread(scraper, query, options) {
    const scrapers = {
      animetosho: new AnimeToSho(),
      nyaasi: new NyaaSi(),
      piratebay: new PirateBay(),
      seadex: new SeaDex()
    };

    if (!scrapers[scraper]) {
      throw new Error(`Unknown scraper: ${scraper}`);
    }

    return scrapers[scraper].search(query, options);
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Export everything
export { TorrentSearchManager, AnimeToSho, NyaaSi, PirateBay, SeaDex };
export default TorrentSearchManager;
