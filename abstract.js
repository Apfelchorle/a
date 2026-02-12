// Abstract base class for torrent scrapers with Web Worker support
class TorrentScraper {
  constructor(name) {
    this.name = name;
    this.isWorker = typeof window === 'undefined' && typeof self !== 'undefined';
    this.timeout = 10000;
  }

  // Safe fetch that works in both main thread and worker
  async safeFetch(url, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Fetch failed for ${url}: ${error.message}`);
    }
  }

  // Parse HTML safely
  async parseHTML(html) {
    // In worker context, use a simple text parser
    if (this.isWorker) {
      return { html, text: html };
    }
    
    // In main thread, use DOMParser if available
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      return parser.parseFromString(html, 'text/html');
    }
    
    return { html, text: html };
  }

  // Safe logging
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] [${this.name}] ${message}`;
    
    if (this.isWorker) {
      // In worker, post message to main thread for logging
      self.postMessage({ 
        type: 'log', 
        level, 
        message: logMsg 
      });
    } else {
      console.log(logMsg);
    }
  }

  // Main search method - to be implemented by subclasses
  async search(query, options = {}) {
    throw new Error('search() must be implemented by subclass');
  }

  // Validate query
  validateQuery(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }
    return query.trim();
  }

  // Safe JSON parse
  safeJSONParse(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      this.log(`JSON parse error: ${error.message}`, 'warn');
      return defaultValue;
    }
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TorrentScraper;
}
