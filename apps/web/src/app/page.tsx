'use client';

import {
  FileText,
  ClipboardCheck,
  Award,
  Users,
  ChevronRight,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
  Star,
  Zap,
  Filter,
  Droplets,
  Wind,
  Fan,
  Globe,
  BarChart3,
  BadgeCheck,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/store/language-store';

export default function HomePage() {
  const t = useTranslation();

  const processSteps = [
    {
      step: 1,
      title: t('home.step1Title'),
      description: t('home.step1Desc'),
      icon: Users,
    },
    {
      step: 2,
      title: t('home.step2Title'),
      description: t('home.step2Desc'),
      icon: FileText,
    },
    {
      step: 3,
      title: t('home.step3Title'),
      description: t('home.step3Desc'),
      icon: ClipboardCheck,
    },
    {
      step: 4,
      title: t('home.step4Title'),
      description: t('home.step4Desc'),
      icon: Award,
    },
    {
      step: 5,
      title: t('home.step5Title'),
      description: t('home.step5Desc'),
      icon: Shield,
    },
    {
      step: 6,
      title: t('home.step6Title'),
      description: t('home.step6Desc'),
      icon: Users,
    },
    {
      step: 7,
      title: t('home.step7Title'),
      description: t('home.step7Desc'),
      icon: Award,
    },
  ];

  const faqs = [
    {
      question: 'Who can apply for empanelment?',
      answer:
        'Manufacturers of Air Pollution Control Devices (APCDs) with valid GST registration, manufacturing facilities in India, at least 3 years of operating history, and a minimum of 3 APCD installations can apply.',
    },
    {
      question: 'What documents are required?',
      answer:
        'Company registration certificates, GST registration, PAN card, manufacturing facility proof, product catalogs, NABL-accredited test reports, ISO certifications (if available), and installation experience proof (minimum 3 installations).',
    },
    {
      question: 'How long does the process take?',
      answer:
        'The complete empanelment process typically takes 45-60 working days after submission of a complete application with all required documents.',
    },
    {
      question: 'What is the validity of the certificate?',
      answer:
        'The empanelment certificate is valid for 2 years from the date of issuance and can be renewed before expiry.',
    },
    {
      question: 'What are the fees for empanelment?',
      answer:
        'The application fee is \u20B925,000 plus \u20B965,000 per APCD type selected, plus 18% GST. MSE/DPIIT-recognized startups and Class-I local suppliers are eligible for a 15% discount.',
    },
    {
      question: 'Can I apply for multiple APCD categories?',
      answer:
        'Yes, you can select multiple APCD categories in a single application. Each additional APCD type has a separate fee of \u20B965,000.',
    },
    {
      question: 'What is Provisional Empanelment?',
      answer:
        'Provisional Empanelment is granted after verification and fulfillment of all required documents. Based on the document evaluation, the Evaluation Committee recommends the applicant for Provisional Empanelment. This status remains valid until completion of field evaluation.',
    },
    {
      question: 'What is Final Empanelment and Field Verification Process?',
      answer:
        'After Provisional Empanelment, field verification is conducted by the Field Verification Team along with laboratory monitoring to assess operational and technical compliance. Based on the findings and submission of the field verification report, the Committee may recommend the applicant for Final Empanelment. Final Empanelment is valid for a period of two (2) years. The field verification fee is \u20B957,000/- plus applicable GST.',
    },
  ];

  const apcdCategories = [
    {
      name: 'ESP Systems',
      description: 'Electrostatic Precipitator Systems for industrial emission control',
      icon: Zap,
    },
    {
      name: 'Bag Filters',
      description: 'High-efficiency filtration systems for particulate control',
      icon: Filter,
    },
    {
      name: 'Scrubbers',
      description: 'Wet and dry scrubbing systems for gas cleaning',
      icon: Droplets,
    },
    {
      name: 'Cyclones',
      description: 'Centrifugal separators for dust collection',
      icon: Wind,
    },
    {
      name: 'Fume Extraction',
      description: 'Industrial fume and dust extraction systems',
      icon: Fan,
    },
  ];

  const whyChooseFeatures = [
    {
      title: 'Fast Approval',
      description: 'Get approved in 7-10 working days with our streamlined process.',
      icon: Zap,
    },
    {
      title: 'Real-time Tracking',
      description: 'Track your application status live with detailed updates.',
      icon: BarChart3,
    },
    {
      title: 'Secure & Transparent',
      description: 'Bank-level security with complete transparency in process.',
      icon: Shield,
    },
    {
      title: 'Government Verified',
      description: 'Official portal backed by CPCB and MoEFCC.',
      icon: BadgeCheck,
    },
    {
      title: 'Digital Certificates',
      description: 'Instant digital certificate download upon approval.',
      icon: Award,
    },
    {
      title: '100% Online',
      description: 'Complete paperless process with online document submission.',
      icon: Globe,
    },
  ];

  const testimonials = [
    {
      quote: 'The application process is simple and transparent. Got approved in just 10 days!',
      name: 'Rajesh Kumar',
      company: 'Green Tech Solutions',
    },
    {
      quote: 'Easy document upload and real-time tracking system. Very professional portal.',
      name: 'Priya Mehta',
      company: 'EcoClean Industries',
    },
    {
      quote: 'The admin support was excellent. They guided us through the entire process.',
      name: 'Amit Singh',
      company: 'Air Quality Systems',
    },
  ];

  const feeCards = [
    {
      title: 'Application Fee',
      amount: '\u20B925,000',
      gst: '+18% GST',
      subtitle: 'One-time (Non-refundable)',
      bullets: ['Company registration on portal', 'Profile setup', 'Document verification'],
      note: 'Pay at initial application',
    },
    {
      title: 'Product Fee',
      amount: '\u20B965,000',
      gst: '+18% GST',
      subtitle: 'Per APCD product type',
      bullets: ['Per APCD model type', 'Technical evaluation', 'Digital certificate issuance'],
      note: 'Pay during empanelment submission',
    },
    {
      title: 'Field Verification Fee',
      amount: '\u20B957,000',
      gst: '+18% GST',
      subtitle: 'Per verification visit',
      bullets: ['On-site inspection (if required)', 'Validation of submitted data'],
      note: 'Charged only when applicable',
    },
    {
      title: 'Annual Renewal Fee',
      amount: '\u20B935,000',
      gst: '+18% GST',
      subtitle: 'Per year',
      bullets: ['Renewal of empanelment validity', 'Continuous compliance'],
      note: 'Pay 60 days before expiry',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Government Header */}
      <div className="gov-stripe" />
      <header className="bg-gov-blue text-white py-3 sm:py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-gov-blue font-bold text-xs sm:text-sm">NPC</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-bold truncate">{t('common.appName')}</h1>
              <p className="text-xs sm:text-sm text-blue-200 hidden sm:block">
                {t('common.orgName')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white text-white hover:bg-white hover:text-gov-blue text-xs sm:text-sm"
              >
                {t('home.login')}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-white text-gov-blue hover:bg-blue-50 text-xs sm:text-sm"
              >
                {t('home.register')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gov-blue to-blue-800 text-white py-12 sm:py-20 relative overflow-hidden">
        {/* Decorative badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          100% Online Process
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left side */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                {t('home.heroTitle')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-gov-blue hover:bg-blue-50 w-full sm:w-auto"
                  >
                    {t('home.startApplication')}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/check-eligibility">
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gov-blue w-full sm:w-auto"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {t('home.checkEligibility')}
                  </Button>
                </Link>
              </div>
              {/* Stat boxes */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold">500+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Approved OEMs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold">7-10</div>
                  <div className="text-xs sm:text-sm text-blue-200">Days Approval</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold">98%</div>
                  <div className="text-xs sm:text-sm text-blue-200">Success Rate</div>
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 text-center max-w-sm">
                <BadgeCheck className="h-16 w-16 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Certified & Verified</h3>
                <p className="text-blue-200 text-sm">By CPCB & MoEFCC</p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium">CPCB</div>
                  <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium">MoEFCC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Quick Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with your empanelment journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Start Application</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your empanelment application in minutes
                    </p>
                    <Link href="/register">
                      <Button size="sm" className="bg-gov-blue hover:bg-blue-700">
                        Get Start
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Track Application</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check your application real time
                    </p>
                    <Link href="/login">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Track Now
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Check Eligibility</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Verify if you meet the requirements
                    </p>
                    <Link href="/check-eligibility">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Check Now
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Empanelment Process - Alternating Timeline */}
      <section id="process" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('home.empanelmentProcess')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.empanelmentProcessDesc')}
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2 hidden md:block" />

            {processSteps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={step.step} className="relative mb-8 last:mb-0">
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4">
                    <div className="w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="h-5 w-5 text-gov-blue" />
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {/* Desktop alternating layout */}
                  <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center">
                    {/* Left content */}
                    <div className={isLeft ? 'text-right' : ''}>
                      {isLeft && (
                        <div className="bg-gray-50 rounded-lg p-5 border inline-block text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <step.icon className="h-5 w-5 text-gov-blue" />
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      )}
                    </div>
                    {/* Right content */}
                    <div className={!isLeft ? '' : ''}>
                      {!isLeft && (
                        <div className="bg-gray-50 rounded-lg p-5 border inline-block text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <step.icon className="h-5 w-5 text-gov-blue" />
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gov-blue text-white rounded-full items-center justify-center font-bold text-sm z-10">
                    {step.step}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-gov-blue px-5 py-2.5 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              Average completion time: 7-10 working days
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility & Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t('home.eligibilityCriteria')}
              </h2>
              <p className="text-muted-foreground">{t('home.eligibilityDesc')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Valid GST Registration',
                      'Company PAN Card',
                      'Minimum 3 years of manufacturing experience',
                      'At least 3 successful installations',
                      'Technical capability and infrastructure',
                      'Quality management system (ISO preferred)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'GST Registration Certificate',
                      'Company PAN Card',
                      'Certificate of Incorporation',
                      'Client installation certificates',
                      'Technical specification sheets',
                      'ISO/Quality certifications (if available)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/check-eligibility">
                <Button size="lg" className="bg-gov-blue hover:bg-blue-700 w-full sm:w-auto">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Check Eligibility & Apply
                </Button>
              </Link>
              <Link href="mailto:apcd-support@npcindia.gov.in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-5 w-5" />
                  Have questions? Contact our support team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* APCD Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('home.apcdCategories')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.apcdCategoriesDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {apcdCategories.map((cat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="pt-6 pb-6">
                  <div className="mx-auto w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <cat.icon className="h-6 w-6 text-gov-blue" />
                  </div>
                  <h3 className="font-semibold mb-2">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <span className="font-medium">Note:</span> You can apply for empanelment in multiple
            categories
          </p>
        </div>
      </section>

      {/* Why Choose Our Portal? */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Choose Our Portal?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Modern, efficient, and transparent</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700"
              >
                <div className="w-12 h-12 bg-gov-blue/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Trusted By</h2>
            <p className="text-muted-foreground">Official partners and regulatory bodies</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
            {['CPCB', 'MoEFCC', 'NPC', 'DPIIT', 'MeitY'].map((org) => (
              <div
                key={org}
                className="bg-white rounded-xl shadow-sm border px-8 py-5 flex items-center justify-center min-w-[120px]"
              >
                <span className="text-lg font-bold text-gray-700">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What Our Users Say</h2>
            <p className="text-muted-foreground">Real feedback from empanelled OEMs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Fee Structure</h2>
            <p className="text-muted-foreground">Transparent pricing with no hidden charges</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {feeCards.map((fee, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{fee.title}</CardTitle>
                  <div>
                    <span className="text-2xl font-bold text-gov-blue">{fee.amount}</span>
                    <span className="text-sm text-muted-foreground ml-1">{fee.gst}</span>
                  </div>
                  <CardDescription>{fee.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {fee.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-blue-50 text-gov-blue rounded-md px-3 py-2 text-xs font-medium text-center">
                    {fee.note}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-block bg-white border rounded-lg px-6 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Example:</span> For 3 product
              categories, total fee = {'\u20B9'}25,000 + (3 {'\u00D7'} {'\u20B9'}65,000) + GST (18%)
              = {'\u20B9'}2,59,600
            </div>
          </div>
        </div>
      </section>

      {/* FAQs - Accordion */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('home.faq')}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-gov-blue mt-0.5 flex-shrink-0" />
                      <span className="text-base font-medium">{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <Link
              href="mailto:apcd-support@npcindia.gov.in"
              className="text-gov-blue font-medium hover:underline"
            >
              Contact our support team &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-gov-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('home.readyToStart')}</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('home.readyToStartDesc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-gov-blue hover:bg-blue-50 w-full sm:w-auto"
              >
                {t('home.registerNow')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/check-eligibility">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gov-blue w-full sm:w-auto"
              >
                {t('home.checkEligibilityFirst')}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white/60 text-white hover:bg-white hover:text-gov-blue w-full sm:w-auto"
              >
                {t('home.alreadyRegistered')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">{t('home.about')}</h3>
              <p className="text-sm text-gray-400">
                The APCD OEM Empanelment Portal is an initiative by the National Productivity
                Council for the Central Pollution Control Board to streamline the empanelment of Air
                Pollution Control Device manufacturers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.quickLinks')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/register" className="hover:text-white">
                    {t('home.step1Title')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    {t('home.login')}
                  </Link>
                </li>
                <li>
                  <Link href="/check-eligibility" className="hover:text-white">
                    {t('home.checkEligibility')}
                  </Link>
                </li>
                <li>
                  <Link href="#process" className="hover:text-white">
                    {t('home.empanelmentProcess')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="hover:text-white">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <a
                    href="https://cpcb.nic.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    CPCB Website
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.contact')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>National Productivity Council</li>
                <li>Utpadakta Bhawan, 5-6 Institutional Area</li>
                <li>Lodhi Road, New Delhi - 110003</li>
                <li>Email: apcd-support@npcindia.gov.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {t('common.copyright')}
            </p>
            <p className="mt-1">{t('common.copyrightSub')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
