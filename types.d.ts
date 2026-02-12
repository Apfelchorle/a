// types.d.ts - TypeScript type definitions

export interface TorrentResult {
  id?: string;
  title: string;
  link?: string;
  torrent?: string;
  magnet?: string;
  seeders: number;
  leechers: number;
  size: number;
  date?: string;
  source: string;
  [key: string]: any;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

export interface ScraperResponse {
  id: number;
  success: boolean;
  data?: TorrentResult[];
  error?: string;
}

export abstract class TorrentScraper {
  constructor(name: string);
  search(query: string, options?: SearchOptions): Promise<TorrentResult[]>;
  validateQuery(query: string): string;
  safeFetch(url: string, options?: RequestInit): Promise<Response>;
  parseHTML(html: string): Promise<any>;
  log(message: string, level?: 'info' | 'warn' | 'error'): void;
  safeJSONParse(jsonString: string, defaultValue?: any): any;
}

export class AnimeToSho extends TorrentScraper {
  constructor();
  search(query: string, options?: SearchOptions): Promise<TorrentResult[]>;
}

export class NyaaSi extends TorrentScraper {
  constructor();
  search(query: string, options?: SearchOptions): Promise<TorrentResult[]>;
}

export class PirateBay extends TorrentScraper {
  constructor();
  search(query: string, options?: SearchOptions): Promise<TorrentResult[]>;
}

export class SeaDex extends TorrentScraper {
  constructor();
  search(query: string, options?: SearchOptions): Promise<TorrentResult[]>;
}

export class TorrentSearchManager {
  constructor();
  search(scraper: 'animetosho' | 'nyaasi' | 'piratebay' | 'seadex', query: string, options?: SearchOptions): Promise<TorrentResult[]>;
  terminate(): void;
}

export default TorrentSearchManager;
