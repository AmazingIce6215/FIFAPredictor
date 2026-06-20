const API_BASE = 'https://wheniskickoff.com/data/v1';

const TTL = {
  matches: 30,
  teams: 300,
  groups: 300,
};

export default async function handler(req, res) {
  const type = req.query.type;

  if (!type || !TTL[type]) {
    return res.status(400).json({ error: 'Invalid type. Use: matches, teams, or groups' });
  }

  const url = `${API_BASE}/${type}.json`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`API responded with ${resp.status}`);

    const data = await resp.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', `s-maxage=${TTL[type]}, stale-while-revalidate=${TTL[type] * 2}`);
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch data', message: err.message });
  }
}
