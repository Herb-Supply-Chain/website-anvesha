'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Shield, Users, TrendingUp, Search, FileCheck, Award, Sun, Moon, CheckCircle, QrCode } from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const content = {
    en: {
      header: {
        title: 'Government of India | www.gov.in',
        subtitle: 'Ministry of AYUSH | Blockchain Traceability'
      },
      nav: {
        home: 'Home',
        consumer: 'Consumer Portal',
        stakeholders: 'Stake-holders Dashboards',
        about: 'About',
        contacts: 'Contacts',
        partners: 'Partners'
      },
      hero: {
        title: 'Blockchain-enabled Traceability for Ayurvedic Herbs',
        description: 'A secure solution for the Ministry of AYUSH to ensure authenticity, sustainability and end-to-end transparency in the Ayurvedic herbal supply chain.',
        powered: 'Powered by CrackedDevs',
        consumerBtn: 'Consumer Product Verification',
        stakeholderBtn: 'Stakeholder Verification'
      },
      initiatives: {
        title: 'Key Initiatives',
        items: [
          { title: 'End-to-End Traceability', desc: 'From origin to shelf in 3 AYUSH products' },
          { title: 'Quality Assurance Labs', desc: 'Ensure quality standards are met at all stages' },
          { title: 'Blockchain Permanence', desc: 'Immutable records on a permissioned blockchain' },
          { title: 'Sustainable Sourcing', desc: 'Support over 2,000 AYUSH growers' },
          { title: 'Farmer Empowerment', desc: 'Direct visibility into pricing and payment' },
          { title: 'Consumer Confidence', desc: 'Validate and verify every AYUSH purchase' }
        ]
      },
      processFlow: {
        title: 'Process Flow',
        steps: [
          { icon: '🌱', title: 'Raw Material Collection', desc: 'Farmers collect herbs with GPS tracking' },
          { icon: '🔬', title: 'Lab Testing & Analysis', desc: 'Quality tests, pesticide checks, DNA analysis' },
          { icon: '🏭', title: 'Processing & Packaging', desc: 'Processing into final AYUSH products' },
          { icon: '📦', title: 'Distribution & Retail', desc: 'Products reach consumers with full traceability' }
        ]
      },
      standards: {
        title: 'Aligned with National Standards',
        items: [
          { name: 'NMPB', desc: 'National Medicinal Plants Board' },
          { name: 'GACP', desc: 'Good Agricultural & Collection Practices' },
          { name: 'AQS', desc: 'AYUSH Quality Standards' },
          { name: 'DII', desc: 'Digital India Initiative' }
        ]
      },
      impact: {
        title: 'Pilot Impact',
        stats: [
          { value: '5,000+', label: 'Farmers Onboarded' },
          { value: '12,000+', label: 'Batches Mapped' },
          { value: '98%', label: 'Compliance Score' },
          { value: '50,000+', label: 'Products Verified' }
        ]
      },
      buttons: {
        login: 'Login',
        register: 'Register'
      }
    },
    hi: {
      header: {
        title: 'भारत सरकार | www.gov.in',
        subtitle: 'आयुष मंत्रालय | ब्लॉकचेन ट्रेसेबिलिटी'
      },
      nav: {
        home: 'होम',
        consumer: 'उपभोक्ता पोर्टल',
        stakeholders: 'हितधारक डैशबोर्ड',
        about: 'के बारे में',
        contacts: 'संपर्क',
        partners: 'साझेदार'
      },
      hero: {
        title: 'आयुर्वेदिक जड़ी-बूटियों के लिए ब्लॉकचेन-सक्षम ट्रेसेबिलिटी',
        description: 'आयुर्वेदिक हर्बल आपूर्ति श्रृंखला में प्रामाणिकता, स्थिरता और एंड-टू-एंड पारदर्शिता सुनिश्चित करने के लिए आयुष मंत्रालय के लिए एक सुरक्षित समाधान।',
        powered: 'CrackedDevs द्वारा संचालित',
        consumerBtn: 'उपभोक्ता उत्पाद सत्यापन',
        stakeholderBtn: 'हितधारक सत्यापन'
      },
      initiatives: {
        title: 'प्रमुख पहल',
        items: [
          { title: 'एंड-टू-एंड ट्रेसेबिलिटी', desc: 'मूल से शेल्फ तक 3 आयुष उत्पादों में' },
          { title: 'गुणवत्ता आश्वासन प्रयोगशालाएं', desc: 'सभी चरणों में गुणवत्ता मानकों को सुनिश्चित करें' },
          { title: 'ब्लॉकचेन स्थायित्व', desc: 'अनुमति प्राप्त ब्लॉकचेन पर अपरिवर्तनीय रिकॉर्ड' },
          { title: 'सतत सोर्सिंग', desc: '2,000 से अधिक आयुष उत्पादकों का समर्थन' },
          { title: 'किसान सशक्तिकरण', desc: 'मूल्य निर्धारण और भुगतान में प्रत्यक्ष दृश्यता' },
          { title: 'उपभोक्ता विश्वास', desc: 'प्रत्येक आयुष खरीद को मान्य और सत्यापित करें' }
        ]
      },
      processFlow: {
        title: 'प्रक्रिया प्रवाह',
        steps: [
          { icon: '🌱', title: 'कच्चा माल संग्रह', desc: 'किसान GPS ट्रैकिंग के साथ जड़ी-बूटियां एकत्र करते हैं' },
          { icon: '🔬', title: 'प्रयोगशाला परीक्षण और विश्लेषण', desc: 'गुणवत्ता परीक्षण, कीटनाशक जांच, DNA विश्लेषण' },
          { icon: '🏭', title: 'प्रसंस्करण और पैकेजिंग', desc: 'अंतिम आयुष उत्पादों में प्रसंस्करण' },
          { icon: '📦', title: 'वितरण और खुदरा', desc: 'पूर्ण ट्रेसेबिलिटी के साथ उत्पाद उपभोक्ताओं तक पहुंचते हैं' }
        ]
      },
      standards: {
        title: 'राष्ट्रीय मानकों के साथ संरेखित',
        items: [
          { name: 'NMPB', desc: 'राष्ट्रीय औषधीय पौधा बोर्ड' },
          { name: 'GACP', desc: 'अच्छी कृषि और संग्रह प्रथाएं' },
          { name: 'AQS', desc: 'आयुष गुणवत्ता मानक' },
          { name: 'DII', desc: 'डिजिटल इंडिया पहल' }
        ]
      },
      impact: {
        title: 'पायलट प्रभाव',
        stats: [
          { value: '5,000+', label: 'किसान ऑनबोर्ड किए गए' },
          { value: '12,000+', label: 'बैच मैप किए गए' },
          { value: '98%', label: 'अनुपालन स्कोर' },
          { value: '50,000+', label: 'उत्पाद सत्यापित' }
        ]
      },
      buttons: {
        login: 'लॉगिन',
        register: 'रजिस्टर'
      }
    }
  };

  const t = content[language];
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-teal-700 to-teal-600'} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold">{t.header.title}</h1>
                <p className="text-xs text-teal-100">{t.header.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 hover:bg-teal-600 rounded-lg transition"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Link href="/farmer-auth">
                <button className={`px-4 py-1.5 ${isDark ? 'bg-gray-700' : 'bg-teal-600'} hover:bg-teal-500 rounded text-sm transition`}>
                  {t.buttons.login}
                </button>
              </Link>
              <Link href="/farmer-auth">
                <button className={`px-4 py-1.5 ${isDark ? 'bg-white text-gray-900' : 'bg-white text-teal-700'} hover:bg-teal-50 rounded text-sm font-medium transition`}>
                  {t.buttons.register}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b shadow-sm`}>
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm">
            <li><Link href="/" className={`py-3 inline-block font-medium ${isDark ? 'text-teal-400 border-teal-400' : 'text-teal-700 border-teal-700'} border-b-2`}>{t.nav.home}</Link></li>
            <li><Link href="/consumer-portal" className={`py-3 inline-block ${isDark ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-700'} transition`}>{t.nav.consumer}</Link></li>
            <li><Link href="/dashboard" className={`py-3 inline-block ${isDark ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-700'} transition`}>{t.nav.stakeholders}</Link></li>
            <li><Link href="/about" className={`py-3 inline-block ${isDark ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-700'} transition`}>{t.nav.about}</Link></li>
            <li><Link href="/contact" className={`py-3 inline-block ${isDark ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-700'} transition`}>{t.nav.contacts}</Link></li>
            <li><Link href="/partners" className={`py-3 inline-block ${isDark ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-700'} transition`}>{t.nav.partners}</Link></li>
            <li className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs rounded transition ${language === 'en' ? (isDark ? 'bg-teal-600 text-white' : 'bg-teal-600 text-white') : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
              >
                ENG
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-xs rounded transition ${language === 'hi' ? (isDark ? 'bg-teal-600 text-white' : 'bg-teal-600 text-white') : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
              >
                हिं
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
              {t.hero.title}
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 leading-relaxed`}>
              {t.hero.description}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-8`}>{t.hero.powered}</p>
            <div className="flex gap-4">
              <Link href="/consumer-portal">
                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition shadow-md">
                  {t.hero.consumerBtn}
                </button>
              </Link>
              <Link href="/stakeholder-portal">
                <button className={`px-6 py-3 border-2 border-teal-600 ${isDark ? 'text-teal-400 hover:bg-gray-800' : 'text-teal-700 hover:bg-teal-50'} rounded-lg font-medium transition`}>
                  {t.hero.stakeholderBtn}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <h3 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12`}>{t.initiatives.title}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {t.initiatives.items.map((item, idx) => (
              <div key={idx} className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg shadow-sm hover:shadow-md transition`}>
                <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{item.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-16`}>
        <div className="container mx-auto px-4">
          <h3 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12`}>{t.processFlow.title}</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {t.processFlow.steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-20 h-20 ${isDark ? 'bg-gray-800' : 'bg-teal-100'} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                  {step.icon}
                </div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{step.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <QrCode className={`w-24 h-24 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <h3 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12`}>{t.standards.title}</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {t.standards.items.map((item, idx) => (
              <div key={idx} className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg shadow-sm text-center`}>
                <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{item.name}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-16`}>
        <div className="container mx-auto px-4">
          <h3 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12`}>{t.impact.title}</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {t.impact.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-teal-600 mb-2">{stat.value}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-teal-700'} text-white border-t py-8`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Ministry of AYUSH, Government of India. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}