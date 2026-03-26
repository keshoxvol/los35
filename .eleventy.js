require('dotenv').config();
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/img": "img"});
  eleventyConfig.addPassthroughCopy({"src/assets/css": "assets/css"});
  eleventyConfig.addPassthroughCopy({"src/assets/js": "assets/js"});

eleventyConfig.addFilter("dateRu", function(date) {
    return new Date(date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  eleventyConfig.addFilter("dateIso", function(date) {
    return new Date(date).toISOString().split('T')[0];
  });

  eleventyConfig.addFilter("striptags", function(str) {
    return String(str).replace(/<[^>]*>/g, '');
  });

  eleventyConfig.addFilter("limit", function(array, n) {
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("truncate", function(str, n) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n).trimEnd() + '…' : str;
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("sitePages", function(collectionApi) {
    return collectionApi.getAll()
      .filter(item => item.data.sitemapPriority !== undefined)
      .sort((a, b) => (b.data.sitemapPriority || 0) - (a.data.sitemapPriority || 0));
  });

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk"
  };
};
