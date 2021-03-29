const data = require('../../../db.json');

export default function handler(req, res) {
  const {
    search = '',
    repo = '',
    sort = '',
    page = 0,
    limit = 20,
  } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const lSearch = search.toLowerCase();
  const matchingImages = data.images
    .filter(i => search === '' ? i : i.name.toLowerCase().includes(lSearch))
    .filter(i => repo === '' ? i : repo.split(',').includes(i.repo))
    .sort((a, b) => {
      const [key, hasDesc] = sort.split('-');
      const direction = hasDesc === 'desc' ? -1 : 1;
      if(key === "usage"){
        const aLength = a[key] ? a[key].length : 0;
        const bLength = b[key] ? b[key].length : 0;
        return aLength < bLength ? -1 * direction : 1 * direction;
      }
      return a[key] < b[key] ? -1 * direction : 1 * direction;
    });

  return res.json({
    tags: data.tags,
    images: matchingImages.slice(pageNumber*limitNumber, (pageNumber*limitNumber)+limitNumber),
    totalImages: matchingImages.length
  });
}
