require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const app = express();
app.use(express.json({ limit: '100kb' })); 

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash'; 

if (!JWT_SECRET || !GEMINI_API_KEY) {
  console.error('Missing JWT_SECRET or GEMINI_API_KEY in environment');
  process.exit(1);
}

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'missing_token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

app.post('/auth/dev-login', (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});


const geminiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: 'rate_limited', message: 'Too many requests, slow down.' });
  }
});

const generateSchema = z.object({
  prompt: z.string().min(1).max(4000),
  temperature: z.number().min(0).max(2).optional()
});

app.post('/api/generate', requireAuth, geminiLimiter, async (req, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_input', details: parsed.error.issues });
  }
  const { prompt, temperature } = parsed.data;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(temperature !== undefined && { generationConfig: { temperature } })
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(502).json({ error: 'upstream_error' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    res.json({ text });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => console.log(`Gemini proxy running on :${PORT}`));