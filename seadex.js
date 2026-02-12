// SeaDAX anime torrent scraper with Web Worker support
import TorrentScraper from './abstract.js';

class SeaDex extends TorrentScraper {
  constructor() {
    super('SeaDex');
    this.baseURL = 'https://releases.moe/api/v1/torrents';
  }

  async search(query, options = {}) {
    try {
      this.validateQuery(query);

      const params = new URLSearchParams({
        'q': query,
        'limit': options.limit || 50,
        'offset': options.offset || 0
      });

      const url = `${this.baseURL}?${params.toString()}`;
      this.log(`Searching: ${query}`);

      const response = await this.safeFetch(url);
      const data = await response.json();

      if (!data || !Array.isArray(data.torrents)) {
        this.log('Invalid response format', 'warn');
        return [];
      }

      return this.formatResults(data.torrents);
    } catch (error) {
      this.log(`Search error: ${error.message}`, 'error');
      throw error;
    }
  }

  formatResults(torrents) {
    return torrents.map(item => ({
      id: item.id || '',
      title: item.title || item.name || '',
      link: item.link || '',
      torrent: item.torrent_url || item.torrent || '',
      magnet: item.magnet_uri || item.magnet || '',
      seeders: item.seeders || item.seeds || 0,
      leechers: item.leechers || item.peers || 0,
      size: item.size || item.total_size || 0,
      date: item.pub_date || item.created_at || '',
      quality: item.quality || item.resolution || '',
      encoder: item.encoder || item.uploader || '',
      source: 'SeaDex'
    })).filter(item => item.title);
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeaDex;
}

export default SeaDex;
