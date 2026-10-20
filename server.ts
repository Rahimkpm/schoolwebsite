import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Database } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

const db = Database.getInstance();

// Simple in-memory rate limiter for form submissions
const submissionRateMap = new Map<string, { count: number; firstAt: number }>();
function rateLimitEnquiry(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const current = submissionRateMap.get(clientIp);
  if (!current || now - current.firstAt > windowMs) {
    submissionRateMap.set(clientIp, { count: 1, firstAt: now });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many enquiry submissions from this connection. Please try again in a few minutes or call the school office directly.'
    });
  }

  current.count++;
  next();
}

// Auth Middleware for Admin Routes
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.substring(7).trim();
  const session = db.validateToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminUser = session.username;
  (req as any).adminRole = session.role;
  next();
}

// ---------------- PUBLIC API ENDPOINTS ---------------- //

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

// Notices (published only for public)
app.get('/api/notices', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const isAuth = authHeader && db.validateToken(authHeader.replace('Bearer ', ''));
  res.json(db.getNotices(!isAuth));
});

// Academics
app.get('/api/academics', (req: Request, res: Response) => {
  res.json(db.getAcademics());
});

// Facilities
app.get('/api/facilities', (req: Request, res: Response) => {
  res.json(db.getFacilities());
});

// Gallery
app.get('/api/gallery', (req: Request, res: Response) => {
  res.json(db.getGallery());
});

// Submit Admission Enquiry
app.post('/api/enquiries', rateLimitEnquiry, (req: Request, res: Response) => {
  const { parentName, studentName, applyingClass, phone, email, message } = req.body;

  if (!parentName || typeof parentName !== 'string' || parentName.trim().length < 2) {
    return res.status(400).json({ error: 'Parent or Guardian name is required.' });
  }
  if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
    return res.status(400).json({ error: 'Student name is required.' });
  }
  if (!applyingClass || typeof applyingClass !== 'string') {
    return res.status(400).json({ error: 'Please select an applying class.' });
  }
  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Contact phone number is required.' });
  }

  // Validate Indian Phone format (10 digits or with +91)
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phonePattern = /^(\+91|91|0)?[6-9]\d{9}$/;
  if (!phonePattern.test(cleanPhone)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
  }

  const saved = db.addEnquiry({
    parentName: parentName.trim(),
    studentName: studentName.trim(),
    applyingClass: applyingClass.trim(),
    phone: cleanPhone.startsWith('+91') ? cleanPhone : (cleanPhone.length === 10 ? `+91 ${cleanPhone}` : cleanPhone),
    email: email && typeof email === 'string' ? email.trim() : undefined,
    message: message && typeof message === 'string' ? message.trim() : undefined
  });

  res.status(201).json({
    success: true,
    message: 'Your admission enquiry has been successfully registered. The school admissions office will contact you shortly.',
    enquiryId: saved.id
  });
});

// ---------------- ADMIN AUTHENTICATION ---------------- //

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const auth = db.authenticate(username, password);
  if (!auth) {
    return res.status(401).json({ error: 'Invalid administrator credentials' });
  }

  res.json({
    success: true,
    token: auth.token,
    user: auth.user
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    db.logout(authHeader.substring(7).trim());
  }
  res.json({ success: true });
});

app.get('/api/auth/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    username: (req as any).adminUser,
    role: (req as any).adminRole
  });
});

app.put('/api/auth/password', requireAdmin, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const ok = db.changePassword((req as any).adminUser, oldPassword, newPassword);
  if (!ok) {
    return res.status(400).json({ error: 'Current password did not match.' });
  }

  res.json({ success: true, message: 'Password successfully updated.' });
});

// ---------------- ADMIN PROTECTED CRUD ---------------- //

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  res.json(db.getAdminStats());
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

// Admin Enquiries Management
app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
  res.json(db.getEnquiries());
});

app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const id = req.params.id;
  const updated = db.updateEnquiry(id, req.body, (req as any).adminUser);
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteEnquiry(req.params.id, (req as any).adminUser);
  if (!ok) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ success: true });
});

// Admin Settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body, (req as any).adminUser);
  res.json(updated);
});

// Admin Notices Management
app.post('/api/admin/notices', requireAdmin, (req: Request, res: Response) => {
  const { title, category, date, description, isPinned, isPublished, downloadUrl } = req.body;
  if (!title || !category || !date) {
    return res.status(400).json({ error: 'Title, category, and date are required' });
  }

  const created = db.addNotice({
    title,
    category,
    date,
    description: description || '',
    isPinned: Boolean(isPinned),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    downloadUrl: downloadUrl || ''
  }, (req as any).adminUser);

  res.status(201).json(created);
});

app.put('/api/admin/notices/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateNotice(req.params.id, req.body, (req as any).adminUser);
  if (!updated) return res.status(404).json({ error: 'Notice not found' });
  res.json(updated);
});

app.delete('/api/admin/notices/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteNotice(req.params.id, (req as any).adminUser);
  if (!ok) return res.status(404).json({ error: 'Notice not found' });
  res.json({ success: true });
});

// Admin Academics Management
app.put('/api/admin/academics/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateAcademicStage(req.params.id, req.body, (req as any).adminUser);
  if (!updated) return res.status(404).json({ error: 'Academic stage not found' });
  res.json(updated);
});

// Admin Facilities Management
app.post('/api/admin/facilities', requireAdmin, (req: Request, res: Response) => {
  const { name, category, description, image, highlight } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const created = db.addFacility({
    name,
    category: category || 'General',
    description,
    image: image || '/src/assets/images/classroom_learning_1792501180266.jpg',
    highlight: highlight || ''
  }, (req as any).adminUser);

  res.status(201).json(created);
});

app.put('/api/admin/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateFacility(req.params.id, req.body, (req as any).adminUser);
  if (!updated) return res.status(404).json({ error: 'Facility not found' });
  res.json(updated);
});

app.delete('/api/admin/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteFacility(req.params.id, (req as any).adminUser);
  if (!ok) return res.status(404).json({ error: 'Facility not found' });
  res.json({ success: true });
});

// Admin Gallery Management
app.post('/api/admin/gallery', requireAdmin, (req: Request, res: Response) => {
  const { title, category, date, imageUrl, description } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Title and image are required' });
  }

  const created = db.addGalleryItem({
    title,
    category: category || 'Campus',
    date: date || new Date().toISOString().split('T')[0],
    imageUrl,
    description: description || ''
  }, (req as any).adminUser);

  res.status(201).json(created);
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteGalleryItem(req.params.id, (req as any).adminUser);
  if (!ok) return res.status(404).json({ error: 'Gallery photo not found' });
  res.json({ success: true });
});

// ---------------- SEO SITEMAP & ROBOTS.TXT ---------------- //

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = req.headers.host || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const pages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/#about', changefreq: 'weekly', priority: '0.8' },
    { loc: '/#academics', changefreq: 'weekly', priority: '0.9' },
    { loc: '/#admissions', changefreq: 'daily', priority: '1.0' },
    { loc: '/#facilities', changefreq: 'monthly', priority: '0.8' },
    { loc: '/#gallery', changefreq: 'weekly', priority: '0.7' },
    { loc: '/#notices', changefreq: 'daily', priority: '0.9' },
    { loc: '/#contact', changefreq: 'monthly', priority: '0.8' }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.headers.host || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml
`);
});

// ---------------- STATIC / VITE INTEGRATION ---------------- //

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IDEAL GLOBAL ISLAMIC SCHOOL] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
