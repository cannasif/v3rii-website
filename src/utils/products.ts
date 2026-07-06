import { Building2, Factory, Fish, Package, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Ürün logoları (şeffaf PNG)
import crmLogo from '../assets/veriicrmlogo.png'
import b2bLogo from '../assets/V3riib2b.png'
import wmsLogo from '../assets/v3riiwms.png'
import utsLogo from '../assets/v3riiuts.png'
import aquaLogo from '../assets/v3riiaqua.png'

// Galeri görselleri
import crm1 from '../assets/crm_1.png'
import crm2 from '../assets/crm_2.png'
import crm3 from '../assets/crm_3.png'
import crm4 from '../assets/crm_4.png'
import crmPreview from '../assets/crm.png'
import b2bPreview from '../assets/b2b.png'
import wmsPreview from '../assets/wms.png'
import aqua1 from '../assets/aqua_1.png'
import aqua2 from '../assets/aqua_2.png'
import aqua3 from '../assets/aqua_3.png'
import aqua4 from '../assets/aqua_4.png'

// Modal hero arka planları (siberpunk sahneler)
import crmModalBg from '../assets/crm-modal-bg.png'
import aquaModalBg from '../assets/aqua-modal-bg.png'
import utsModalBg from '../assets/uts-modal-bg.png'

export type LocalizedText = {
  tr: string
  en: string
}

export type ProductItem = {
  icon: LucideIcon
  logo?: string
  title: LocalizedText
  eyebrow: LocalizedText
  description: LocalizedText
  features: {
    tr: string[]
    en: string[]
  }
  modules: {
    tr: string[]
    en: string[]
  }
  integrations: {
    tr: string[]
    en: string[]
  }
  parameters: {
    tr: string[]
    en: string[]
  }
  gallery: string[]
  link?: string
}

export const products: ProductItem[] = [
  {
    icon: Users,
    logo: crmLogo,
    title: {
      tr: 'V3RII CRM',
      en: 'V3RII CRM'
    },
    eyebrow: {
      tr: 'Satış, teklif ve müşteri operasyonları',
      en: 'Sales, quotation and customer operations'
    },
    description: {
      tr: 'Müşteri, teklif, sipariş, onay, aktivite, raporlama ve entegrasyon süreçlerini yapay zeka destekli içgörülerle tek panelde toplayan kurumsal satış operasyon platformu.',
      en: 'An enterprise sales operations platform combining customers, quotes, orders, approvals, activities, reporting and integrations in one panel with AI-powered insights.'
    },
    features: {
      tr: ['Yapay zeka destekli satış içgörüleri ve raporlama', 'Müşteri 360 ve mükerrer kayıt kontrolü', 'Teklif, sipariş ve onay akışları', 'Mail, Outlook, WhatsApp ve ERP entegrasyonu'],
      en: ['AI-powered sales insights and reporting', 'Customer 360 and dedupe control', 'Quote, order and approval flows', 'Mail, Outlook, WhatsApp and ERP integrations']
    },
    modules: {
      tr: ['Müşteri tipi, müşteri kartı, müşteri 360', 'Teklif, talep, sipariş ve bekleyen onaylar', 'Aktivite, ziyaret, satış temsilcisi ve günlük görevler', 'Rapor oluşturucu, PDF tasarım, Power BI panelleri'],
      en: ['Customer type, customer card and customer 360', 'Quotes, demands, orders and pending approvals', 'Activities, visits, sales reps and daily tasks', 'Report builder, PDF designer and Power BI dashboards']
    },
    integrations: {
      tr: ['ERP cari ve stok referansları', 'Outlook, SMTP ve mail ayarları', 'WhatsApp, Power BI ve Hangfire izleme', 'Onay, rol ve yetki altyapısı'],
      en: ['ERP customer and stock references', 'Outlook, SMTP and mail settings', 'WhatsApp, Power BI and Hangfire monitoring', 'Approval, role and permission infrastructure']
    },
    parameters: {
      tr: ['Belge seri ve onay akışı tanımları', 'Kullanıcı, rol, grup ve indirim limitleri', 'Müşteri tipi, bölge, temsilci ve fiyat kuralları', 'Çok dilli alan etiketleri ve rapor şablonları'],
      en: ['Document serial and approval flow definitions', 'Users, roles, groups and discount limits', 'Customer type, region, representative and pricing rules', 'Multilingual field labels and report templates']
    },
    gallery: [crmModalBg, crm1, crm2, crm3, crm4, crmPreview],
    link: 'https://crm.v3rii.com'
  },
  {
    icon: Fish,
    logo: aquaLogo,
    title: {
      tr: 'V3RII AQUA',
      en: 'V3RII AQUA'
    },
    eyebrow: {
      tr: 'Aquakültür üretim ve karar destek sistemi',
      en: 'Aquaculture production and decision support'
    },
    description: {
      tr: 'Açık deniz ve kafes bazlı balık yetiştiriciliği operasyonlarını uçtan uca yöneten, ERP entegre, yapay zeka destekli KPI ve hasat tahmini sunan web tabanlı üretim ve karar destek platformu.',
      en: 'A web-based production and decision support platform managing offshore cage-based aquaculture end to end, integrated with ERP systems and offering AI-powered KPIs and harvest forecasting.'
    },
    features: {
      tr: ['Yapay zeka destekli FCR, KPI ve hasat tahmini', 'Kafes, batch ve depo bazlı canlı stok takibi', 'Günlük giriş: yemleme, fire, hava, transfer, sevkiyat', 'ERP aktarımı ve postlama kilidi'],
      en: ['AI-powered FCR, KPI and harvest forecasting', 'Live stock tracking by cage, batch and warehouse', 'Daily entry: feeding, mortality, weather, transfer, shipment', 'ERP transfer and posting lock']
    },
    modules: {
      tr: ['Hızlı kurulum ve Excel ile ilk geçiş (opening import)', 'Günlük giriş, mal kabul, yemleme ve fire', 'Kafes/depo transferleri, sevkiyat, tartım ve stok dönüşümü', 'Balık partileri, hava durumu, ağ işlemleri ve proje birleştirme'],
      en: ['Quick setup and Excel opening import', 'Daily entry, goods receipt, feeding and mortality', 'Cage/warehouse transfers, shipment, weighing and stock conversion', 'Fish batches, weather, net operations and project merge']
    },
    integrations: {
      tr: ['ERP aktarımı ve mirror senkronizasyonu', 'Kafes–ERP depo kodu eşleştirmesi', 'Excel, PDF ve PowerPoint dışa aktarım', 'Hangfire arka plan işleri ve sensör verileri'],
      en: ['ERP transfer and mirror sync', 'Cage–ERP warehouse code mapping', 'Excel, PDF and PowerPoint export', 'Hangfire background jobs and sensor data']
    },
    parameters: {
      tr: ['Proje, kafes ve kafes–depo eşleştirme tanımları', 'Rol bazlı erişim ve izin grupları', 'Belge durumları: taslak, post, iptal', 'Hava tipleri, risk skorları ve KPI eşikleri'],
      en: ['Project, cage and cage–warehouse mapping definitions', 'Role-based access and permission groups', 'Document states: draft, posted, cancelled', 'Weather types, risk scores and KPI thresholds']
    },
    gallery: [aquaModalBg, aqua1, aqua2, aqua3, aqua4],
    link: 'https://aqua.v3rii.com'
  },
  {
    icon: Building2,
    logo: b2bLogo,
    title: {
      tr: 'V3RII B2B',
      en: 'V3RII B2B'
    },
    eyebrow: {
      tr: 'Bayi portalı, katalog ve ticari kurallar',
      en: 'Dealer portal, catalog and commercial rules'
    },
    description: {
      tr: 'Bayi ve müşteri portalları için katalog, fiyat, stok görünürlüğü, teklif, sipariş, ödeme ve pazar yeri entegrasyonlarını yapay zeka destekli otomasyonla yöneten B2B çözümü.',
      en: 'A B2B solution for dealer and customer portals, managing catalog, pricing, inventory visibility, quotes, orders, payments and marketplaces with AI-assisted automation.'
    },
    features: {
      tr: ['Yapay zeka destekli ürün eşleştirme ve otomasyon', 'Şirket hesapları ve alıcı yönetimi', 'Katalog, fiyat ve stok görünürlüğü', 'Pazar yeri, ERP ve kapsam politikaları'],
      en: ['AI-assisted product matching and automation', 'Company accounts and buyer management', 'Catalog, pricing and inventory visibility', 'Marketplace, ERP and scope policies']
    },
    modules: {
      tr: ['Hazırlık paneli, şirket hesapları ve alıcılar', 'Katalog, ürün eşleştirme ve katalog görünürlüğü', 'Müşteri fiyatları, stok görünürlüğü ve alışveriş listeleri', 'Teklif talepleri, siparişler, ödeme ve ödeme operasyonları'],
      en: ['Insights, company accounts and buyers', 'Catalog, product matching and catalog visibility', 'Customer pricing, inventory visibility and shopping lists', 'Quote requests, orders, payments and payment operations']
    },
    integrations: {
      tr: ['ERP cari, stok, depo ve yap-kod referansları', 'Pazar yeri kanal, liste ve aktarım olayları', 'Ödeme bağlantı ayarları', 'SMTP, Hangfire ve iz takip altyapısı'],
      en: ['ERP customer, stock, warehouse and custom-code references', 'Marketplace channel, listing and transfer events', 'Payment connection settings', 'SMTP, Hangfire and trace infrastructure']
    },
    parameters: {
      tr: ['Katalog görünürlük kuralları', 'Müşteri bazlı fiyat ve stok kapsamları', 'B2B kapsam politikaları ve kullanıcı atamaları', 'Satın alma onay kuralları ve alıcı yetkileri'],
      en: ['Catalog visibility rules', 'Customer-based pricing and inventory scopes', 'B2B scope policies and user assignments', 'Purchase approval rules and buyer permissions']
    },
    gallery: [b2bPreview],
    link: 'https://b2b.v3rii.com'
  },
  {
    icon: Package,
    logo: wmsLogo,
    title: {
      tr: 'V3RII WMS',
      en: 'V3RII WMS'
    },
    eyebrow: {
      tr: 'Depo, kalite, transfer ve sevkiyat yönetimi',
      en: 'Warehouse, quality, transfer and shipment management'
    },
    description: {
      tr: 'Mal kabulden kalite kontrol ve karantinaya, transferden sevkiyat ve paketlemeye kadar depo operasyonlarını yapay zeka destekli optimizasyonla uçtan uca yöneten WMS uygulaması.',
      en: 'An end-to-end WMS for warehouse operations from goods receipt, quality and quarantine to transfers, shipment and packing, with AI-assisted optimization.'
    },
    features: {
      tr: ['Yapay zeka destekli depo ve rota optimizasyonu', 'Mal kabul, depo giriş/çıkış ve transfer', 'Kalite kontrol ve karantina', 'Barkod, e-belge, ERP ve servis operasyonları'],
      en: ['AI-assisted warehouse and route optimization', 'Goods receipt, inbound/outbound and transfers', 'Quality control and quarantine', 'Barcode, e-document, ERP and service operations']
    },
    modules: {
      tr: ['Mal kabul, fatura, depo giriş ve fason giriş', 'Kalite kontrol, kalite kuralı, inceleme ve karantina', 'Depolar arası transfer, fason çıkış ve üretim transferi', 'Depo çıkış, sevkiyat, paket istasyonu ve araç/yükleme ekranları'],
      en: ['Goods receipt, invoice, warehouse inbound and subcontracting receipt', 'Quality control, quality rules, inspections and quarantine', 'Warehouse transfer, subcontracting issue and production transfer', 'Warehouse outbound, shipment, package station and vehicle/loading screens']
    },
    integrations: {
      tr: ['ERP stok, depo, cari ve hareket referansları', 'eLogo e-Fatura/e-Arşiv sorgu ve bağlantıları', 'Barkod/etiket tasarım ve ön etiketli mal kabul', 'Hangfire, SMTP ve servis operasyon bağlantıları'],
      en: ['ERP stock, warehouse, customer and transaction references', 'eLogo e-Invoice/e-Archive lookup and connections', 'Barcode/label designer and pre-label receiving', 'Hangfire, SMTP and service operation connections']
    },
    parameters: {
      tr: ['Depo, raf, lokasyon ve işlem tipi ayarları', 'Kalite kural tanımları ve karantina akışları', 'Barkod şablonları, belge serileri ve onay süreçleri', 'KKD hak matrisi, servis atama ve hakediş lokasyon parametreleri'],
      en: ['Warehouse, shelf, location and operation type settings', 'Quality rule definitions and quarantine flows', 'Barcode templates, document serials and approval processes', 'PPE entitlement matrix, service allocation and progress-payment location parameters']
    },
    gallery: [wmsPreview],
    link: 'https://wms.v3rii.com'
  },
  {
    icon: Factory,
    logo: utsLogo,
    title: {
      tr: 'V3RII UTS',
      en: 'V3RII UTS'
    },
    eyebrow: {
      tr: 'Ürün takip ve mevzuat operasyonları',
      en: 'Product tracking and regulatory operations'
    },
    description: {
      tr: 'Ürün Takip Sistemi operasyonları için üretim, verme, ters verme, tüketiciye verme, alma, ithalat, ihracat ve imha listelerini yapay zeka destekli doğrulamayla yöneten uygulama.',
      en: 'An operations app for product tracking workflows including production, transfer, reverse transfer, consumer transfer, receipt, import, export and disposal lists with AI-assisted validation.'
    },
    features: {
      tr: ['Yapay zeka destekli kayıt doğrulama', 'UTS üretim ve verme listeleri', 'Tüketiciye verme, alma ve ters verme', 'İthalat, ihracat ve imha operasyonları'],
      en: ['AI-assisted record validation', 'UTS production and transfer lists', 'Consumer transfer, receipt and reverse transfer', 'Import, export and disposal operations']
    },
    modules: {
      tr: ['UTS üretim listesi', 'UTS verme, ters verme ve tüketiciye verme listeleri', 'UTS alma, ithalat, ihracat ve imha listeleri', 'Cari, stok, kullanıcı, rol ve izin grubu ekranları'],
      en: ['UTS production list', 'UTS transfer, reverse transfer and consumer transfer lists', 'UTS receipt, import, export and disposal lists', 'Customer, stock, user, role and permission group screens']
    },
    integrations: {
      tr: ['UTS/ÜTS operasyon kayıtları', 'ERP cari ve stok referansları', 'Hangfire izleme', 'Rol ve yetki altyapısı'],
      en: ['UTS operation records', 'ERP customer and stock references', 'Hangfire monitoring', 'Role and permission infrastructure']
    },
    parameters: {
      tr: ['Kullanıcı, rol ve izin grubu tanımları', 'Cari ve stok eşleme mantığı', 'İşlem türüne göre liste ve durum takipleri', 'Yetki bazlı operasyon görünürlüğü'],
      en: ['User, role and permission group definitions', 'Customer and stock matching logic', 'Operation-type based lists and status tracking', 'Permission-based operation visibility']
    },
    gallery: [utsModalBg],
    link: 'https://uts.v3rii.com'
  }
]
