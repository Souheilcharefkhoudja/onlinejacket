export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const wilaya_id = req.query.wilaya_id;
  if (!wilaya_id) return res.status(400).json({ error: 'Missing wilaya_id' });

  const API_ID    = '08467949173865045243';
  const API_TOKEN = '6tDv0VDFh5MKfvcyQtO3eouLUT8Sc7w5FngPzXRrOHPyq29zWY4Jlpr2dB1jaiRJ';

  let allCommunes = [];
  let page = 1;

  try {
    while (true) {
      const url = `https://api.guepex.app/v1/communes/?wilaya_id=${wilaya_id}&page=${page}`;
      const response = await fetch(url, {
        headers: {
          'X-API-ID':    API_ID,
          'X-API-TOKEN': API_TOKEN,
        },
      });

      if (!response.ok) break;

      const data = await response.json();
      if (!data.data || data.data.length === 0) break;

      for (const c of data.data) {
        if (c.is_deliverable) {
          allCommunes.push({
            id:            c.id,
            name:          c.name,
            has_stop_desk: c.has_stop_desk,
          });
        }
      }

      if (!data.has_more) break;
      page++;
      if (page > 20) break; // safety cap
    }

    // Sort alphabetically
    allCommunes.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({ communes: allCommunes });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch communes', detail: err.message });
  }
}
