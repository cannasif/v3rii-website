import { Building2, Factory, Package, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// CRM Assets
import crmLogo from '../assets/veriicrmlogo.png'
import crm1 from '../assets/crm_1.png'
import crm2 from '../assets/crm_2.png'
import crm3 from '../assets/crm_3.png'
import crm4 from '../assets/crm_4.png'

import b2bLogo from '../assets/b2b.png'
import wmsLogo from '../assets/v3riiwms.png'
import utsLogo from '../assets/v3logo.png'
import b2bPreview from '../assets/b2b.png'
import wmsPreview from '../assets/wms.png'
import crmPreview from '../assets/crm.png'

export type LocalizedText = {
  tr: string
  en: string
}

export type ProductItem = {
  icon: LucideIcon
  logo?: string
  title: LocalizedText
  description: LocalizedText
  features: {
    tr: string[]
    en: string[]
  }
  gallery: string[]
  link?: string // YENİ EKLENDİ: Sisteme gitmek için link (opsiyonel)
}

export const products: ProductItem[] = [
  {
    icon: Users,
    logo: crmLogo,
    title: {
      tr: 'V3RII CRM',
      en: 'V3RII CRM'
    },
    description: {
      tr: 'Müşteri, teklif, sipariş, onay, aktivite, raporlama ve entegrasyon süreçlerini tek panelde toplayan kurumsal satış operasyon platformu.',
      en: 'An enterprise sales operations platform combining customers, quotes, orders, approvals, activities, reporting and integrations in one panel.'
    },
    features: {
      tr: ['Müşteri 360 ve mükerrer kayıt kontrolü', 'Teklif, sipariş ve onay akışları', 'PDF rapor tasarım ve Power BI', 'Mail, Outlook, WhatsApp ve ERP entegrasyonu'],
      en: ['Customer 360 and dedupe control', 'Quote, order and approval flows', 'PDF report designer and Power BI', 'Mail, Outlook, WhatsApp and ERP integrations']
    },
    gallery: [crm1, crm2, crm3, crm4, crmPreview],
    link: 'https://crm.v3rii.com'
  },
  {
    icon: Building2,
    logo: b2bLogo,
    title: {
      tr: 'V3RII B2B',
      en: 'V3RII B2B'
    },
    description: {
      tr: 'Bayi ve müşteri portalları için katalog, fiyat, stok görünürlüğü, teklif, sipariş, ödeme ve pazar yeri entegrasyonlarını yöneten B2B çözümü.',
      en: 'A B2B solution for dealer and customer portals, managing catalog, pricing, inventory visibility, quotes, orders, payments and marketplaces.'
    },
    features: {
      tr: ['Şirket hesapları ve alıcı yönetimi', 'Katalog, fiyat ve stok görünürlüğü', 'Teklif, sipariş ve ödeme operasyonları', 'Pazar yeri, ERP ve kapsam politikaları'],
      en: ['Company accounts and buyer management', 'Catalog, pricing and inventory visibility', 'Quote, order and payment operations', 'Marketplace, ERP and scope policies']
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
    description: {
      tr: 'Mal kabulden kalite kontrol ve karantinaya, transferden sevkiyat ve paketlemeye kadar depo operasyonlarını uçtan uca yöneten WMS uygulaması.',
      en: 'An end-to-end WMS for warehouse operations from goods receipt, quality and quarantine to transfers, shipment and packing.'
    },
    features: {
      tr: ['Mal kabul, depo giriş/çıkış ve transfer', 'Kalite kontrol ve karantina', 'Paketleme, sevkiyat ve yükleme', 'Barkod, e-belge, ERP ve servis operasyonları'],
      en: ['Goods receipt, inbound/outbound and transfers', 'Quality control and quarantine', 'Packing, shipment and loading', 'Barcode, e-document, ERP and service operations']
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
    description: {
      tr: 'Ürün Takip Sistemi operasyonları için üretim, verme, ters verme, tüketiciye verme, alma, ithalat, ihracat ve imha listelerini yöneten uygulama.',
      en: 'An operations app for product tracking workflows including production, transfer, reverse transfer, consumer transfer, receipt, import, export and disposal lists.'
    },
    features: {
      tr: ['UTS üretim ve verme listeleri', 'Tüketiciye verme, alma ve ters verme', 'İthalat, ihracat ve imha operasyonları', 'Cari, stok, rol ve izin yönetimi'],
      en: ['UTS production and transfer lists', 'Consumer transfer, receipt and reverse transfer', 'Import, export and disposal operations', 'Customer, stock, role and permission management']
    },
    gallery: [utsLogo],
    link: 'https://uts.v3rii.com'
  }
]
