let inMemoryStore: any = null;

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.json({ success: true, data: inMemoryStore });
  }
  if (req.method === 'POST') {
    inMemoryStore = req.body;
    return res.json({ success: true, savedAt: new Date().toISOString() });
  }
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
