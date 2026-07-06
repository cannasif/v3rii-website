const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer transporter yapılandırması
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const productLabels = {
  crm: 'V3RII CRM',
  b2b: 'V3RII B2B',
  wms: 'V3RII WMS',
  uts: 'V3RII UTS'
};

const intentLabels = {
  'product-info': 'Ürün Bilgisi',
  demo: 'Demo Talebi',
  'technical-support': 'Teknik Destek',
  integration: 'Entegrasyon',
  pricing: 'Fiyat / Teklif'
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, product, message } = req.body;

    // Veri doğrulama
    if (!name || !email || !product || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar zorunludur.'
      });
    }

    // E-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi girin.'
      });
    }

    const transporter = createTransporter();

    // E-posta içeriği
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'infov3rii@gmail.com',
      subject: `V3Rİİ - Yeni Proje Talebi: ${product}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">V3Rİİ</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Yeni Proje Talebi</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">İletişim Bilgileri</h2>
            
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #667eea; border-radius: 5px;">
              <strong style="color: #4a5568;">Ad Soyad:</strong>
              <span style="color: #2d3748; margin-left: 10px;">${escapeHtml(name)}</span>
            </div>
            
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #667eea; border-radius: 5px;">
              <strong style="color: #4a5568;">E-posta:</strong>
              <span style="color: #2d3748; margin-left: 10px;">${escapeHtml(email)}</span>
            </div>
            
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #667eea; border-radius: 5px;">
              <strong style="color: #4a5568;">İlgilenilen Ürün:</strong>
              <span style="color: #2d3748; margin-left: 10px;">${escapeHtml(product)}</span>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #667eea; border-radius: 5px;">
              <strong style="color: #4a5568;">Proje Detayları:</strong>
              <div style="color: #2d3748; margin-top: 10px; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">Bu mesaj V3Rİİ web sitesi iletişim formu aracılığıyla gönderilmiştir.</p>
              <p style="color: #718096; font-size: 12px; margin: 5px 0 0 0;">Gönderim Zamanı: ${new Date().toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </div>
      `,
      replyTo: email
    };

    // E-posta gönder
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi!'
    });

  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
    });
  }
});

app.post('/api/support-request', async (req, res) => {
  try {
    const { name, email, company, product, intent, details, language, transcript } = req.body;

    if (!name || !email || !product || !intent || !details || !language) {
      return res.status(400).json({
        success: false,
        message: 'Zorunlu destek alanları eksik.'
      });
    }

    if (!productLabels[product] || !intentLabels[intent]) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ürün veya talep türü.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi girin.'
      });
    }

    const transcriptRows = Array.isArray(transcript)
      ? transcript
          .slice(-30)
          .map((item) => {
            const sender = escapeHtml(item.sender || 'unknown');
            const text = escapeHtml(item.text || '').replace(/\n/g, '<br>');
            return `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#475569;">${sender}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${text}</td></tr>`;
          })
          .join('')
      : '';

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL || 'infov3rii@gmail.com',
      subject: `V3RII Destek Talebi - ${productLabels[product]} / ${intentLabels[intent]}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:20px;background:#f8fafc;">
          <div style="background:linear-gradient(135deg,#06b6d4,#a855f7,#d946ef);padding:28px;border-radius:14px;color:white;">
            <h1 style="margin:0;font-size:26px;">V3RII Destek Talebi</h1>
            <p style="margin:8px 0 0;color:#e0f2fe;">Chatbot üzerinden yeni talep oluşturuldu.</p>
          </div>
          <div style="background:white;margin-top:18px;padding:24px;border-radius:14px;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
            <h2 style="margin:0 0 16px;color:#0f172a;">Talep Özeti</h2>
            <p><strong>Ürün:</strong> ${escapeHtml(productLabels[product])}</p>
            <p><strong>Talep Türü:</strong> ${escapeHtml(intentLabels[intent])}</p>
            <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
            <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
            <p><strong>Firma:</strong> ${escapeHtml(company || '-')}</p>
            <p><strong>Dil:</strong> ${escapeHtml(language)}</p>
            <div style="margin-top:18px;padding:14px;background:#f1f5f9;border-left:4px solid #06b6d4;border-radius:8px;">
              <strong>Detay:</strong>
              <div style="margin-top:8px;line-height:1.6;">${escapeHtml(details).replace(/\n/g, '<br>')}</div>
            </div>
            ${
              transcriptRows
                ? `<h3 style="margin:22px 0 10px;color:#0f172a;">Görüşme Özeti</h3><table style="width:100%;border-collapse:collapse;font-size:13px;">${transcriptRows}</table>`
                : ''
            }
            <p style="margin-top:22px;color:#64748b;font-size:12px;">Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}</p>
          </div>
        </div>
      `,
      replyTo: email
    });

    res.status(200).json({
      success: true,
      message: 'Destek talebiniz başarıyla iletildi.'
    });
  } catch (error) {
    console.error('Destek talebi gönderme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Destek talebi gönderilirken bir hata oluştu.'
    });
  }
});
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server çalışıyor!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı.'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server hatası:', error);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası oluştu.'
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📧 E-posta servisi aktif`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/contact`);
});

module.exports = app;
