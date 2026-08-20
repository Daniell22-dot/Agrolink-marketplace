const axios = require('axios');
const cheerio = require('cheerio');

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cache = { articles: null, fetchedAt: 0 };

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const fetchHTML = async (url) => {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 15000,
    responseType: 'text',
  });
  return data;
};

// --- Source scrapers ---

async function scrapeKilimoNews() {
  const html = await fetchHTML('https://kilimonews.co.ke');
  const $ = cheerio.load(html);
  const articles = [];

  $('article, .post, .entry, div[class*="post"]').each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h2 a, h3 a, .entry-title a').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href');
    if (!title || !url) return;

    const excerpt =
      $el.find('.entry-summary, .excerpt, .entry-content p, .post-excerpt').first().text().trim() || '';
    const image =
      $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
    const date =
      $el.find('time').first().attr('datetime') ||
      $el.find('.posted-on, .entry-date, .post-date').first().text().trim() ||
      '';

    articles.push({
      title,
      excerpt: excerpt.substring(0, 300),
      url,
      source: 'Kilimo News',
      image,
      date,
      category: 'Agriculture',
    });
  });

  return articles;
}

async function scrapeKenyanWallStreet() {
  const html = await fetchHTML('https://kenyanwallstreet.com/category/agriculture');
  const $ = cheerio.load(html);
  const articles = [];

  $('article, .post, div[class*="post"]').each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h2 a, h3 a, .entry-title a').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href');
    if (!title || !url) return;

    const excerpt =
      $el.find('.entry-summary, .excerpt, .entry-content p, .post-excerpt').first().text().trim() || '';
    const image =
      $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
    const date =
      $el.find('time').first().attr('datetime') ||
      $el.find('.posted-on, .entry-date, .post-date').first().text().trim() ||
      '';

    articles.push({
      title,
      excerpt: excerpt.substring(0, 300),
      url,
      source: 'Kenyan Wall Street',
      image,
      date,
      category: 'Agriculture',
    });
  });

  return articles;
}

async function scrapeTheStar() {
  const html = await fetchHTML('https://www.the-star.co.ke/search?q=agriculture+kenya');
  const $ = cheerio.load(html);
  const articles = [];

  $('article, .search-result, div[class*="story"], div[class*="article"]').each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h2 a, h3 a, .title a, a[class*="title"]').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href');
    if (!title || !url) return;

    const fullUrl = url.startsWith('http') ? url : `https://www.the-star.co.ke${url}`;
    const excerpt =
      $el.find('p, .excerpt, .description, .summary').first().text().trim() || '';
    const image =
      $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
    const date =
      $el.find('time').first().attr('datetime') ||
      $el.find('.date, .posted-on, span[class*="date"]').first().text().trim() ||
      '';

    articles.push({
      title,
      excerpt: excerpt.substring(0, 300),
      url: fullUrl,
      source: 'The Star',
      image,
      date,
      category: 'Agriculture',
    });
  });

  return articles;
}

async function scrapePeopleDaily() {
  const html = await fetchHTML('https://peopledaily.digital/category/news');
  const $ = cheerio.load(html);
  const articles = [];

  $('article, .post, div[class*="post"]').each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h2 a, h3 a, .entry-title a').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href');
    if (!title || !url) return;

    const excerpt =
      $el.find('.entry-summary, .excerpt, .entry-content p, .post-excerpt').first().text().trim() || '';
    const image =
      $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
    const date =
      $el.find('time').first().attr('datetime') ||
      $el.find('.posted-on, .entry-date, .post-date').first().text().trim() ||
      '';

    articles.push({
      title,
      excerpt: excerpt.substring(0, 300),
      url,
      source: 'People Daily',
      image,
      date,
      category: 'News',
    });
  });

  return articles;
}

// --- Main export ---

async function fetchNews() {
  const now = Date.now();
  if (cache.articles && now - cache.fetchedAt < CACHE_TTL) {
    return cache.articles;
  }

  const sources = [
    { name: 'Kilimo News', fn: scrapeKilimoNews },
    { name: 'Kenyan Wall Street', fn: scrapeKenyanWallStreet },
    { name: 'The Star', fn: scrapeTheStar },
    { name: 'People Daily', fn: scrapePeopleDaily },
  ];

  const results = await Promise.allSettled(sources.map((s) => s.fn()));

  let allArticles = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      allArticles = allArticles.concat(result.value);
    } else {
      console.error(`[newsScraper] ${sources[i].name} failed:`, result.reason?.message);
    }
  });

  // Deduplicate by title
  const seen = new Set();
  const unique = [];
  for (const article of allArticles) {
    const key = article.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }

  // Sort by date newest first, articles without dates go to the end
  unique.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  // Assign IDs and limit
  const articles = unique.slice(0, 20).map((article, index) => ({
    id: `news-${index + 1}-${Date.now()}`,
    ...article,
  }));

  cache = { articles, fetchedAt: now };
  return articles;
}

module.exports = { fetchNews };
