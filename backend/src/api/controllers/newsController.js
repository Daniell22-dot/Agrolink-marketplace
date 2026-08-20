const { fetchNews } = require('../../services/newsScraper');

exports.getNews = async (req, res) => {
  try {
    const articles = await fetchNews();
    res.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error('[newsController] Failed to fetch news:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agriculture news',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
