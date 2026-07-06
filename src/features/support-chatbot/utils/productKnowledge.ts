import type { ProductKnowledge, SupportLanguage, SupportProductKey } from '../types/support-chatbot.types'

export const productKnowledge: Record<SupportLanguage, Record<SupportProductKey, ProductKnowledge>> = {
  tr: {
    crm: {
      key: 'crm',
      title: 'V3RII CRM',
      shortTitle: 'CRM',
      summary:
        'Satış, teklif, müşteri, aktivite, onay, raporlama ve entegrasyon süreçlerini tek panelde yöneten kurumsal CRM uygulamasıdır.',
      idealFor: 'Satış ekipleri, teklif/sipariş operasyonları, müşteri ilişkileri ve yönetsel raporlama süreçleri.',
      features: [
        'Müşteri ve kişi yönetimi',
        'Teklif, sipariş ve onay akışları',
        'Satış temsilcisi ve aktivite takibi',
        'Power BI, rapor tasarım ve dashboard modülleri',
        'Mail, Outlook, WhatsApp ve ERP entegrasyon altyapısı'
      ],
      modules: [
        'Müşteri tipi, müşteri yönetimi, müşteri 360 ve mükerrer müşteri havuzu',
        'Teklif, talep, sipariş ve bekleyen onay ekranları',
        'Aktivite, ziyaret, satış temsilcisi ve günlük görev takipleri',
        'PDF rapor tasarım, report builder, Power BI ve dashboard alanları',
        'Yetki, onay rolü, onay akışı, mail ayarları ve sistem araçları'
      ],
      integrations: ['ERP cari/stok referansları', 'Outlook ve mail ayarları', 'WhatsApp entegrasyonu', 'Power BI', 'Hangfire izleme'],
      supportTopics: ['Kullanıcı yetkileri', 'Teklif/sipariş akışı', 'Raporlar', 'ERP entegrasyonu', 'Mail ayarları']
    },
    b2b: {
      key: 'b2b',
      title: 'V3RII B2B',
      shortTitle: 'B2B',
      summary:
        'Bayi/müşteri portali, katalog, fiyat, stok görünürlüğü, teklif, sipariş ve ödeme operasyonlarını yöneten B2B platformudur.',
      idealFor: 'Bayi ağı olan firmalar, müşteri bazlı katalog/fiyat yönetimi ve self-servis sipariş süreçleri.',
      features: [
        'Şirket hesabı ve alıcı yönetimi',
        'Katalog, ürün eşleştirme ve görünürlük kuralları',
        'Müşteri fiyatları ve stok görünürlüğü',
        'Teklif talepleri, siparişler ve ödeme operasyonları',
        'Pazar yeri ve ERP aktarım olayları'
      ],
      modules: [
        'Hazırlık paneli, şirket hesapları, alıcılar ve alışveriş listeleri',
        'Katalog, ürün eşleştirme, katalog görünürlüğü ve müşteri fiyatları',
        'Stok görünürlüğü, teklif talepleri, siparişler ve ödeme operasyonları',
        'B2B kapsam politikaları ve kullanıcı kapsam atamaları',
        'Pazar yeri mağaza kanalları, ürün eşleştirme ve aktarım kayıtları'
      ],
      integrations: ['ERP cari/stok/depo referansları', 'Pazar yeri bağlantıları', 'Ödeme bağlantıları', 'SMTP mail ayarları', 'Trace explorer'],
      supportTopics: ['Katalog yetkileri', 'Fiyat/stok görünürlüğü', 'Sipariş akışı', 'Ödeme', 'Pazar yeri entegrasyonu']
    },
    wms: {
      key: 'wms',
      title: 'V3RII WMS',
      shortTitle: 'WMS',
      summary:
        'Depo operasyonlarını, mal kabulü, stok sayımı, barkod, e-fatura arşivi ve depo referanslarını yöneten web tabanlı WMS çözümüdür.',
      idealFor: 'Depo, lojistik, stok, barkod ve operasyonel izlenebilirlik ihtiyacı olan işletmeler.',
      features: [
        'Mal kabul, depo giriş/çıkış ve transfer operasyonları',
        'Stok sayımı, kalite kontrol ve karantina süreçleri',
        'Barkod tanımı ve barkod tasarım araçları',
        'Paketleme, sevkiyat, yükleme ve servis atama akışları',
        'ERP stok/depo/cari referansları, e-belge ve operasyon arşivi'
      ],
      modules: [
        'Mal kabul, fatura, depo giriş ve fason giriş ekranları',
        'Kalite kontrol, kalite kural tanımları, inceleme kayıtları ve karantina kuyruğu',
        'Depolar arası transfer, fason çıkış, üretim transfer ve transfer zincirleri',
        'Depo çıkış, sevkiyat, paket istasyonu, staging/yükleme/araç süreçleri',
        'Servis atama, Bilginoğlu hakediş, KKD ve barkod tasarım modülleri'
      ],
      integrations: ['ERP stok/depo/cari referansları', 'eLogo e-Fatura/e-Arşiv', 'Barkod etiket altyapısı', 'Hangfire izleme', 'Mail ayarları'],
      supportTopics: ['Barkod', 'Mal kabul', 'Stok sayımı', 'Kalite/karantina', 'Transfer/sevkiyat', 'ERP referansları']
    },
    uts: {
      key: 'uts',
      title: 'V3RII UTS',
      shortTitle: 'UTS',
      summary:
        'Ürün Takip Sistemi operasyonları için üretim, verme, tüketiciye verme, alma, ithalat, ihracat ve imha listelerini yöneten uygulamadır.',
      idealFor: 'ÜTS/UTS süreçlerini merkezi panelden izlemek, listelemek ve operasyonel kayıtları kontrol etmek isteyen ekipler.',
      features: [
        'UTS üretim listeleri',
        'UTS verme, tüketiciye verme ve alma operasyonları',
        'İthalat, ihracat ve imha listeleri',
        'Cari ve stok referansları',
        'Yetki, rol ve kullanıcı yönetimi'
      ],
      modules: [
        'UTS üretim listesi',
        'UTS verme, ters verme ve tüketiciye verme listeleri',
        'UTS alma, ithalat, ihracat ve imha listeleri',
        'Cari, stok ve Hangfire izleme ekranları',
        'Kullanıcı, rol ve izin grubu yönetimi'
      ],
      integrations: ['UTS/ÜTS operasyon kayıtları', 'Cari ve stok referansları', 'Hangfire izleme', 'Yetki altyapısı'],
      supportTopics: ['UTS üretim', 'UTS verme', 'İthalat/ihracat', 'İmha', 'Rol/yetki']
    }
  },
  en: {
    crm: {
      key: 'crm',
      title: 'V3RII CRM',
      shortTitle: 'CRM',
      summary:
        'An enterprise CRM for sales, quotes, customers, activities, approvals, reporting and integration workflows in one panel.',
      idealFor: 'Sales teams, quote/order operations, customer relationship workflows and executive reporting.',
      features: [
        'Customer and contact management',
        'Quote, order and approval workflows',
        'Sales representative and activity tracking',
        'Power BI, report designer and dashboard modules',
        'Mail, Outlook, WhatsApp and ERP integration foundation'
      ],
      modules: [
        'Customer type, customer management, customer 360 and dedupe inbox',
        'Quote, demand, order and pending approval screens',
        'Activity, visit, sales representative and daily task tracking',
        'PDF report designer, report builder, Power BI and dashboard areas',
        'Permissions, approval roles, approval flows, mail settings and system tools'
      ],
      integrations: ['ERP customer/stock references', 'Outlook and mail settings', 'WhatsApp integration', 'Power BI', 'Hangfire monitoring'],
      supportTopics: ['User permissions', 'Quote/order flow', 'Reports', 'ERP integration', 'Mail settings']
    },
    b2b: {
      key: 'b2b',
      title: 'V3RII B2B',
      shortTitle: 'B2B',
      summary:
        'A B2B platform for buyer portals, catalog, pricing, inventory visibility, quotes, orders and payment operations.',
      idealFor: 'Companies with dealer networks, customer-based catalog/pricing needs and self-service ordering.',
      features: [
        'Company account and buyer management',
        'Catalog, product matching and visibility rules',
        'Customer pricing and inventory visibility',
        'Quote requests, orders and payment operations',
        'Marketplace and ERP transfer events'
      ],
      modules: [
        'Insights, company accounts, buyers and shopping lists',
        'Catalog, product matching, catalog visibility and customer pricing',
        'Inventory visibility, quote requests, orders and payment operations',
        'B2B scope policies and user scope assignments',
        'Marketplace channels, listing matching and transfer events'
      ],
      integrations: ['ERP customer/stock/warehouse references', 'Marketplace connections', 'Payment integrations', 'SMTP mail settings', 'Trace explorer'],
      supportTopics: ['Catalog permissions', 'Price/inventory visibility', 'Order flow', 'Payments', 'Marketplace integration']
    },
    wms: {
      key: 'wms',
      title: 'V3RII WMS',
      shortTitle: 'WMS',
      summary:
        'A web-based WMS for warehouse operations, goods receipt, stock counts, barcode tools, e-invoice archive and ERP references.',
      idealFor: 'Businesses that need warehouse, logistics, inventory, barcode and operational traceability workflows.',
      features: [
        'Goods receipt, warehouse inbound/outbound and transfer operations',
        'Stock count, quality control and quarantine workflows',
        'Barcode definitions and label designer tools',
        'Packing, shipment, loading and service allocation flows',
        'ERP stock/warehouse/customer references, e-document and operation archive'
      ],
      modules: [
        'Goods receipt, invoice, warehouse inbound and subcontracting receipt screens',
        'Quality control, rule definitions, inspection records and quarantine queue',
        'Warehouse transfer, subcontracting issue, production transfer and transfer chains',
        'Warehouse outbound, shipment, package station and staging/loading/vehicle workflows',
        'Service allocation, Bilginoglu progress-payment, PPE and barcode designer modules'
      ],
      integrations: ['ERP stock/warehouse/customer references', 'eLogo e-Invoice/e-Archive', 'Barcode label infrastructure', 'Hangfire monitoring', 'Mail settings'],
      supportTopics: ['Barcode', 'Goods receipt', 'Stock count', 'Quality/quarantine', 'Transfer/shipment', 'ERP references']
    },
    uts: {
      key: 'uts',
      title: 'V3RII UTS',
      shortTitle: 'UTS',
      summary:
        'An operations app for product tracking workflows including production, transfer, consumer transfer, receipt, import, export and disposal lists.',
      idealFor: 'Teams that need to monitor UTS workflows and operational records from a central panel.',
      features: [
        'UTS production lists',
        'Transfer, consumer transfer and receipt operations',
        'Import, export and disposal lists',
        'Customer and stock references',
        'Role, user and permission management'
      ],
      modules: [
        'UTS production list',
        'UTS transfer, reverse transfer and consumer transfer lists',
        'UTS receipt, import, export and disposal lists',
        'Customer, stock and Hangfire monitoring screens',
        'User, role and permission group management'
      ],
      integrations: ['UTS operation records', 'Customer and stock references', 'Hangfire monitoring', 'Permission infrastructure'],
      supportTopics: ['UTS production', 'UTS transfer', 'Import/export', 'Disposal', 'Roles/permissions']
    }
  }
}

export const productKeys: SupportProductKey[] = ['crm', 'b2b', 'wms', 'uts']

export const getProductByKeyword = (value: string): SupportProductKey | null => {
  const normalized = value.toLocaleLowerCase('tr-TR')
  if (normalized.includes('crm')) return 'crm'
  if (normalized.includes('b2b') || normalized.includes('bayi') || normalized.includes('portal')) return 'b2b'
  if (normalized.includes('wms') || normalized.includes('depo') || normalized.includes('warehouse')) return 'wms'
  if (normalized.includes('uts') || normalized.includes('üts') || normalized.includes('ürün takip')) return 'uts'
  return null
}
