// torrent-worker.js - Web Worker for handling torrent searches
// This worker handles all scraper operations safely in a background thread

import AnimeToSho from './animetosho.js';
import NyaaSi from './nyaasi.js';
import PirateBay from './piratebay.js';
import SeaDex from './seadex.js';

const scrapers = {
  animetosho: new AnimeToSho(),
  nyaasi: new NyaaSi(),
  piratebay: new PirateBay(),
  seadex: new SeaDex()
};

// Handle messages from main thread
self.onmessage = async (event) => {
  const { id, scraper, query, options } = event.data;

  try {
    if (!scrapers[scraper]) {
      throw new Error(`Unknown scraper: ${scraper}`);
    }

    const results = await scrapers[scraper].search(query, options);
    
    self.postMessage({
      id,
      success: true,
      data: results
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error.message
    });
  }
};

// Handle logging from scrapers
self.onmessage = (event) => {
  if (event.data.type === 'log') {
    console.log(`[Worker] ${event.data.message}`);
  }
};
