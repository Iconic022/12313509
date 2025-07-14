import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

const urlDB = {};

app.post('/shorten', (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  let code = shortcode || nanoid(7);
  if (urlDB[code]) return res.status(400).json({ error: 'Shortcode already exists' });

  let expiresAt = null;
  if (validity && /^\d+$/.test(validity)) {
    expiresAt = Date.now() + parseInt(validity) * 60 * 1000;
  }

  urlDB[code] = { url, expiresAt };
  res.json({
    original: url,
    short: `http://localhost:5000/${code}`,
    expiry: expiresAt ? new Date(expiresAt).toLocaleString() : '∞',
    shortcode: code
  });
});

app.get('/:code', (req, res) => {
  const entry = urlDB[req.params.code];
  if (!entry) return res.status(404).send('Not found');
  if (entry.expiresAt && Date.now() > entry.expiresAt) return res.status(410).send('Link expired');
  res.redirect(entry.url);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));