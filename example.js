// example.js - Usage examples

import TorrentSearchManager, { AnimeToSho, NyaaSi, PirateBay, SeaDex } from './index.js';

// Example 1: Basic search with Worker
async function basicSearch() {
  const manager = new TorrentSearchManager();
  
  try {
    const results = await manager.search('animetosho', 'attack on titan', {
      limit: 10
    });
    
    console.log('Results:', results);
    manager.terminate();
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 2: Multi-source search
async function multiSourceSearch() {
  const manager = new TorrentSearchManager();
  
  const query = 'jujutsu kaisen';
  
  try {
    const [animeResults, nyaaResults, seadexResults] = await Promise.all([
      manager.search('animetosho', query),
      manager.search('nyaasi', query),
      manager.search('seadex', query)
    ]);
    
    console.log(`AnimeToSho: ${animeResults.length} results`);
    console.log(`NyaaSi: ${nyaaResults.length} results`);
    console.log(`SeaDex: ${seadexResults.length} results`);
    
    manager.terminate();
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 3: Direct scraper usage (without worker)
async function directScraperUsage() {
  try {
    // AnimeToSho
    const animetosho = new AnimeToSho();
    const animeResults = await animetosho.search('steins;gate', { limit: 5 });
    console.log('AnimeToSho results:', animeResults);
    
    // Nyaa.si
    const nyaa = new NyaaSi();
    const nyaaResults = await nyaa.search('demon slayer', { limit: 5 });
    console.log('Nyaa.si results:', nyaaResults);
    
    // SeaDex
    const seadex = new SeaDex();
    const seadexResults = await seadex.search('vivy fluorite eye\'s song', { limit: 5 });
    console.log('SeaDex results:', seadexResults);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Filter high-quality results
async function filterHighQuality() {
  const manager = new TorrentSearchManager();
  
  try {
    const results = await manager.search('animetosho', 'mob psycho 100');
    
    // Filter by seeders
    const highSeeded = results.filter(r => r.seeders > 50);
    
    // Sort by seeders descending
    highSeeded.sort((a, b) => b.seeders - a.seeders);
    
    console.log('Top 5 well-seeded torrents:');
    highSeeded.slice(0, 5).forEach((r, i) => {
      console.log(`${i + 1}. ${r.title}`);
      console.log(`   Seeders: ${r.seeders}, Leechers: ${r.leechers}`);
      console.log(`   Size: ${formatBytes(r.size)}`);
    });
    
    manager.terminate();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 5: Pagination
async function paginatedSearch() {
  const manager = new TorrentSearchManager();
  
  try {
    const pageSize = 20;
    const pagesToFetch = 3;
    
    for (let page = 0; page < pagesToFetch; page++) {
      const results = await manager.search('nyaasi', 'anime', {
        limit: pageSize,
        offset: page * pageSize
      });
      
      console.log(`Page ${page + 1}: ${results.length} results`);
      results.forEach(r => console.log(`  - ${r.title}`));
    }
    
    manager.terminate();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Run examples (uncomment to test)
// basicSearch();
// multiSourceSearch();
// directScraperUsage();
// filterHighQuality();
// paginatedSearch();
