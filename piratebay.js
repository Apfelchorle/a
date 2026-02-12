// The Pirate Bay torrent scraper with Web Worker support
import TorrentScraper from './abstract.js';

class PirateBay extends TorrentScraper {
  constructor() {
    super('PirateBay');
    // Using a public API endpoint (varies, this is example)
    this.baseURL = 'https://apibay.org';
  }

  async search(query, options = {}) {
    try {
      this.validateQuery(query);

      // Encode query for URL
      const encoded = encodeURIComponent(query);
      const url = `${this.baseURL}/q.php?q=${encoded}&cat=0`;

      this.log(`Searching: ${query}`);

      const response = await this.safeFetch(url);
      const data = await response.json();

      if (!Array.isArray(data)) {
        this.log('Invalid response format', 'warn');
        return [];
      }

      return this.formatResults(data.slice(0, options.limit || 50));
    } catch (error) {
      this.log(`Search error: ${error.message}`, 'error');
      throw error;
    }
  }

  formatResults(results) {
    return results
      .filter(item => item && item.id) // Filter out invalid entries
      .map(item => ({
        id: item.id || '',
        title: item.name || '',
        link: `https://thepiratebay.org/description.php?id=${item.id}`,
        torrent: `https://thepiratebay.org/torrent/${item.id}`,
        magnet: this.generateMagnet(item.info_hash || ''),
        seeders: parseInt(item.seeders) || 0,
        leechers: parseInt(item.leechers) || 0,
        size: item.size || 0,
        date: item.pubdate || '',
        category: item.category || '',
        type: item.type || '',
        source: 'PirateBay'
      }))
      .filter(item => item.title);
  }

  generateMagnet(infoHash) {
    if (!infoHash) return '';
    return `magnet:?xt=urn:btih:${infoHash}&dn=&tr=udp://tracker.openbittorrent.com:80/announce`;
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PirateBay;
}

export default PirateBay;
