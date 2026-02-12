// Nyaa.si anime torrent scraper with Web Worker support
import TorrentScraper from './abstract.js';

class NyaaSi extends TorrentScraper {
  constructor() {
    super('NyaaSi');
    this.baseURL = 'https://nyaa.si/api/v1/search';
  }

  async search(query, options = {}) {
    try {
      this.validateQuery(query);

      const params = new URLSearchParams({
        q: query,
        limit: options.limit || 50,
        offset: options.offset || 0,
        sort_by: options.sort || 'downloads',
        order: options.order || 'desc'
      });

      const url = `${this.baseURL}?${params.toString()}`;
      this.log(`Searching: ${query}`);

      const response = await this.safeFetch(url);
      const data = await response.json();

      if (!data || !Array.isArray(data.results)) {
        this.log('Invalid response format', 'warn');
        return [];
      }

      return this.formatResults(data.results);
    } catch (error) {
      this.log(`Search error: ${error.message}`, 'error');
      throw error;
    }
  }

  formatResults(results) {
    return results.map(item => ({
      id: item.id || '',
      title: item.name || item.title || '',
      link: `https://nyaa.si/view/${item.id}`,
      torrent: item.torrent_url || '',
      magnet: item.magnet_uri || item.magnet || '',
      seeders: item.seeders || 0,
      leechers: item.leechers || 0,
      downloads: item.downloads || 0,
      size: item.filesize || item.size || 0,
      date: item.publish_date || item.created_time || '',
      category: item.category || '',
      submitter: item.submitter || '',
      source: 'NyaaSi'
    })).filter(item => item.title);
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NyaaSi;
}

export default NyaaSi;
