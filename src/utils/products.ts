import { Users, Package, Droplets } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// CRM Assets
import crm1 from '../assets/crm_1.png'
import crm2 from '../assets/crm_2.png'
import crm3 from '../assets/crm_3.png'
import crm4 from '../assets/crm_4.png'

// AQUA Assets
import aqua1 from '../assets/aqua_1.png'
import aqua2 from '../assets/aqua_2.png'
import aqua3 from '../assets/aqua_3.png'
import aqua4 from '../assets/aqua_4.png'

export type LocalizedText = {
  tr: string
  en: string
}

export type ProductItem = {
  icon: LucideIcon
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
    title: {
      tr: 'CRM Sistemi',
      en: 'CRM System'
    },
    description: {
      tr: 'Müşteri ilişkilerini yönetmek için gelişmiş AI destekli CRM çözümü. Satış süreçlerinizi otomatikleştirin ve müşteri memnuniyetini artırın.',
      en: 'Advanced AI-powered CRM solution to manage customer relationships. Automate your sales operations and improve customer satisfaction.'
    },
    features: {
      tr: ['AI Destekli Analiz', 'Otomatik Raporlama', 'Mobil Uyumluluk', "Entegrasyon API'leri"],
      en: ['AI Assisted Analytics', 'Automated Reporting', 'Mobile Compatibility', 'Integration APIs']
    },
    gallery: [crm1, crm2, crm3, crm4],
    link: "https://crm.v3rii.com" // CRM SİTESİ LİNKİNİ BURAYA YAZ (Örnek)
  },
  {
    icon: Droplets, 
    title: {
      tr: 'AQUA Platform',
      en: 'AQUA Platform'
    },
    description: {
      tr: 'Gelişmiş veri analitiği ve takip sistemi. İşletmenizin dijital ekosistemini su kadar berrak ve akıcı bir şekilde yönetin.',
      en: 'Advanced analytics and monitoring platform. Manage your business digital ecosystem with clarity and fluid control.'
    },
    features: {
      tr: ['Gerçek Zamanlı Takip', 'Veri Görselleştirme', 'Akıllı Bildirimler', 'Hiyerarşik Yönetim'],
      en: ['Real-Time Tracking', 'Data Visualization', 'Smart Alerts', 'Hierarchical Management']
    },
    gallery: [aqua1, aqua2, aqua3, aqua4],
    link: "https://aqua.v3rii.com" // AQUA SİTESİ LİNKİNİ BURAYA YAZ (Örnek)
  },
  {
    icon: Package,
    title: {
      tr: 'Depo Otomasyonu',
      en: 'Warehouse Automation'
    },
    description: {
      tr: 'Akıllı depo yönetim sistemi ile stok kontrolü ve lojistik süreçlerinizi optimize edin. IoT sensörleri ile tam kontrol.',
      en: 'Optimize inventory control and logistics processes with our smart warehouse management system. Full visibility with IoT sensors.'
    },
    features: {
      tr: ['IoT Entegrasyonu', 'Stok Optimizasyonu', 'Robotik Destek', 'Predictive Analytics'],
      en: ['IoT Integration', 'Stock Optimization', 'Robotic Support', 'Predictive Analytics']
    },
    gallery: [
       "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
    ],
    link: "https://wms.v3rii.com" // DEPO OTOMASYONU LİNKİNİ BURAYA YAZ (Örnek)
  }
]