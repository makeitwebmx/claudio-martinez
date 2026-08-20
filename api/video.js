/* Proxy de streaming: sirve los MP4 de Drive por el propio dominio.
   Necesario porque drive.usercontent responde 403 a las peticiones de media
   de Chrome (headers Sec-Fetch-*) y manda Content-Disposition: attachment,
   que Chrome no reproduce. La función pide con headers limpios y re-emite. */
import { Readable } from 'node:stream';

export default async function handler(req, res) {
  const id = req.query.id || '';
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(id)) { res.status(400).send('bad id'); return; }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  };
  if (req.headers.range) headers.Range = req.headers.range;

  const upstream = await fetch(
    'https://drive.usercontent.google.com/download?id=' + id + '&export=download&confirm=t',
    { headers }
  );

  res.status(upstream.status);
  for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
    const v = upstream.headers.get(h);
    if (v) res.setHeader(h, v);
  }
  res.setHeader('content-disposition', 'inline');
  res.setHeader('cache-control', 'public, max-age=3600');

  if (!upstream.body) { res.end(); return; }
  Readable.fromWeb(upstream.body).pipe(res);
}
