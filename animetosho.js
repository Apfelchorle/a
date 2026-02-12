// AnimeToSho torrent scraper with Web Worker support
import TorrentScraper from './abstract.js';

class AnimeToSho extends TorrentScraper {
  constructor() {
    super('AnimeToSho');
    this.baseURL = 'https://animetosho.org/api/v2/search/torrent';
  }

  async search(query, options = {}) {
    try {
      this.validateQuery(query);
      
      const params = new URLSearchParams({
        q: query,
        limit: options.limit || 50,
        offset: options.offset || 0,
        sort: options.sort || 'update_date',
        order: options.order || 'desc'
      });

      const url = `${this.baseURL}?${params.toString()}`;
      this.log(`Searching: ${query}`);

      const response = await this.safeFetch(url);
      const data = await response.json();

      if (!data || !Array.isArray(data)) {
        this.log('Invalid response format', 'warn');
        return [];
      }

      return this.formatResults(data);
    } catch (error) {
      this.log(`Search error: ${error.message}`, 'error');
      throw error;
    }
  }

  formatResults(data) {
    return data.map(item => ({
      title: item.title || '',
      link: item.link || '',
      torrent: item.torrent_url || '',
      magnet: item.magnet_uri || '',
      seeders: item.seeders || 0,
      leechers: item.leechers || 0,
      size: item.total_size || 0,
      date: item.release_date || item.update_date || '',
      source: 'AnimeToSho'
    })).filter(item => item.title);
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimeToSho;
}

export default AnimeToSho;
