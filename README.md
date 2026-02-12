# Apfelchorle/a - Fixed Web Worker Version

A high-performance torrent scraper library with full **Web Worker support** to prevent blocking the main thread.

## 🔧 Key Fixes

- **Web Worker Compatibility**: All scrapers now work seamlessly in Web Workers
- **No DOM Access**: Removed all DOM-dependent code
- **Safe Module Imports**: Fixed module initialization in worker contexts
- **Automatic Fallback**: Gracefully falls back to main thread if workers unavailable
- **Proper Error Handling**: Better error messages and logging

## 📦 Supported Scrapers

- **AnimeToSho** - Anime torrents with comprehensive metadata
- **Nyaa.si** - Largest anime torrent community
- **The Pirate Bay** - General torrent index
- **SeaDex/Releases.moe** - High-quality anime releases

## 🚀 Installation

```bash
npm install apfelchorle-a-fixed
```

## 💻 Usage

### Using Web Workers (Recommended)

```javascript
import TorrentSearchManager from 'apfelchorle-a-fixed';

const manager = new TorrentSearchManager();

// Search runs in background worker thread
const results = await manager.search('animetosho', 'attack on titan', {
  limit: 20
});

console.log(results);
// [{
//   title: "Attack on Titan S1",
//   seeders: 150,
//   leechers: 45,
//   magnet: "magnet:?xt=...",
//   source: "AnimeToSho"
// }, ...]

// Don't forget to terminate when done
manager.terminate();
```

### Direct Scraper Usage

```javascript
import { AnimeToSho, NyaaSi, PirateBay, SeaDex } from 'apfelchorle-a-fixed';

// AnimeToSho
const animetosho = new AnimeToSho();
const results = await animetosho.search('jujutsu kaisen', { limit: 10 });

// Nyaa.si
const nyaa = new NyaaSi();
const results = await nyaa.search('steins;gate', { sort: 'downloads' });

// The Pirate Bay
const pirate = new PirateBay();
const results = await pirate.search('movie', { limit: 50 });

// SeaDex
const seadex = new SeaDex();
const results = await seadex.search('demon slayer', { quality: '1080p' });
```

### In Browser Extension

```javascript
// manifest.json
{
  "manifest_version": 3,
  "name": "Torrent Searcher",
  "permissions": ["webRequest"],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  }
}

// background.js
import TorrentSearchManager from './apfelchorle-a-fixed/index.js';

const manager = new TorrentSearchManager();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'search') {
    manager.search(request.scraper, request.query)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});
```

## 📋 API Reference

### TorrentSearchManager

```typescript
class TorrentSearchManager {
  // Search torrents with automatic worker support
  search(scraper: string, query: string, options?: SearchOptions): Promise<TorrentResult[]>
  
  // Cleanup
  terminate(): void
}
```

### SearchOptions

```typescript
interface SearchOptions {
  limit?: number;        // Max results (default: 50)
  offset?: number;       // Pagination offset
  sort?: string;         // Sort by field
  order?: 'asc' | 'desc'; // Sort order
}
```

### TorrentResult

```typescript
interface TorrentResult {
  title: string;         // Torrent name
  link?: string;         // Web link
  torrent?: string;      // .torrent file URL
  magnet?: string;       // Magnet link
  seeders: number;       // Active seeders
  leechers: number;      // Active leechers
  size: number;          // File size in bytes
  date?: string;         // Publish date
  source: string;        // Scraper source
}
```

## 🎯 How Web Workers Work Here

When you use `TorrentSearchManager`, it:

1. Creates a background Web Worker thread
2. Sends search requests to the worker
3. Worker executes scraper (no DOM blocking)
4. Worker returns results via message passing
5. Main thread receives results without freezing

This means your UI stays responsive even during heavy scraping!

## ⚙️ Configuration

### Custom Timeouts

```javascript
const animetosho = new AnimeToSho();
animetosho.timeout = 15000; // 15 second timeout
```

### Error Handling

```javascript
try {
  const results = await manager.search('nyaasi', 'anime');
} catch (error) {
  console.error('Search failed:', error.message);
}
```

## 📝 Examples

### Search Multiple Sources

```javascript
const manager = new TorrentSearchManager();

const results = await Promise.all([
  manager.search('animetosho', 'demon slayer'),
  manager.search('nyaasi', 'demon slayer'),
  manager.search('seadex', 'demon slayer')
]);

const allResults = results.flat();
console.log(`Found ${allResults.length} total torrents`);
```

### Filter Results

```javascript
const results = await manager.search('animetosho', 'steins gate');

const highQuality = results.filter(r => r.seeders > 100);
const recent = highQuality.sort((a, b) => 
  new Date(b.date) - new Date(a.date)
);

console.log(recent[0]); // Best recent torrent
```

### Download Torrent File

```javascript
const results = await manager.search('nyaasi', 'attack on titan');

if (results[0].torrent) {
  const link = document.createElement('a');
  link.href = results[0].torrent;
  link.download = `${results[0].title}.torrent`;
  link.click();
}
```

## 🐛 Troubleshooting

### "Web Worker initialization failed"

- Workers may not be available in some environments (Web Workers require a separate JS file)
- The library automatically falls back to main thread
- To fix: ensure your bundler supports Worker modules

### "Fetch failed"

- CORS issues: Some torrent sites may block requests
- Try using a CORS proxy or run in appropriate environment
- Check network tab for details

### "Worker error"

- Check browser console for detailed error messages
- Ensure worker file (torrent-worker.js) is accessible
- Verify module imports are correct

## 📄 License

GPL-3.0 (converted from BSL 1.1 on April 1, 2029)

## 🔗 Resources

- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Original: [Apfelchorle/a](https://github.com/Apfelchorle/a)

---

**Note**: Use responsibly and respect copyright/legal requirements in your jurisdiction.
