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
      question: t('home.faq1Q'),
      answer: t('home.faq1A'),
    },
    {
      question: t('home.faq2Q'),
      answer: t('home.faq2A'),
    },
    {
      question: t('home.faq3Q'),
      answer: t('home.faq3A'),
    },
    {
      question: t('home.faq4Q'),
      answer: t('home.faq4A'),
    },
    {
      question: t('home.faq5Q'),
      answer: t('home.faq5A'),
    },
    {
      question: t('home.faq6Q'),
      answer: t('home.faq6A'),
    },
    {
      question: t('home.faq7Q'),
      answer: t('home.faq7A'),
    },
    {
      question: t('home.faq8Q'),
      answer: t('home.faq8A'),
    },
  ];

  const apcdCategories = [
    {
      name: t('home.espSystems'),
      description: t('home.espDesc'),
      icon: Zap,
    },
    {
      name: t('home.bagFilters'),
      description: t('home.bagFiltersDesc'),
      icon: Filter,
    },
    {
      name: t('home.scrubbers'),
      description: t('home.scrubbersDesc'),
      icon: Droplets,
    },
    {
      name: t('home.cyclones'),
      description: t('home.cyclonesDesc'),
      icon: Wind,
    },
    {
      name: t('home.fumeExtraction'),
      description: t('home.fumeExtractionDesc'),
      icon: Fan,
    },
  ];

  const whyChooseFeatures = [
    {
      title: t('home.fastApproval'),
      description: t('home.fastApprovalDesc'),
      icon: Zap,
    },
    {
      title: t('home.realtimeTracking'),
      description: t('home.realtimeTrackingDesc'),
      icon: BarChart3,
    },
    {
      title: t('home.secureTransparentFeature'),
      description: t('home.secureTransparentFeatureDesc'),
      icon: Shield,
    },
    {
      title: t('home.govVerified'),
      description: t('home.govVerifiedDesc'),
      icon: BadgeCheck,
    },
    {
      title: t('home.digitalCerts'),
      description: t('home.digitalCertsDesc'),
      icon: Award,
    },
    {
      title: t('home.onlineFeature'),
      description: t('home.onlineFeatureDesc'),
      icon: Globe,
    },
  ];

  const testimonials = [
    {
      quote: t('home.testimonial1'),
      name: 'Rajesh Kumar',
      company: 'Green Tech Solutions',
    },
    {
      quote: t('home.testimonial2'),
      name: 'Priya Mehta',
      company: 'EcoClean Industries',
    },
    {
      quote: t('home.testimonial3'),
      name: 'Amit Singh',
      company: 'Air Quality Systems',
    },
  ];

  const feeCards = [
    {
      title: t('home.applicationFee'),
      amount: '\u20B925,000',
      gst: '+18% GST',
      subtitle: t('home.oneTimeNonRefundable'),
      bullets: [
        t('home.companyRegistration'),
        t('home.profileSetup'),
        t('home.documentVerification'),
      ],
      note: t('home.payAtInitial'),
    },
    {
      title: t('home.productFee'),
      amount: '\u20B965,000',
      gst: '+18% GST',
      subtitle: t('home.perApcdProductType'),
      bullets: [
        t('home.perApcdModelType'),
        t('home.technicalEvaluation'),
        t('home.digitalCertIssuance'),
      ],
      note: t('home.payDuringSubmission'),
    },
    {
      title: t('home.fieldVerificationFee'),
      amount: '\u20B957,000',
      gst: '+18% GST',
      subtitle: t('home.perVerificationVisit'),
      bullets: [t('home.onsiteInspection'), t('home.validationOfData')],
      note: t('home.chargedWhenApplicable'),
    },
    {
      title: t('home.annualRenewalFee'),
      amount: '\u20B935,000',
      gst: '+18% GST',
      subtitle: t('home.perYear'),
      bullets: [t('home.renewalValidity'), t('home.continuousCompliance')],
      note: t('home.payBeforeExpiry'),
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
          {t('home.onlineProcess')}
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
                  <div className="text-xs sm:text-sm text-blue-200">{t('home.approvedOems')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold">7-10</div>
                  <div className="text-xs sm:text-sm text-blue-200">{t('home.daysApproval')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold">98%</div>
                  <div className="text-xs sm:text-sm text-blue-200">{t('home.successRate')}</div>
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 text-center max-w-sm">
                <BadgeCheck className="h-16 w-16 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">{t('home.certifiedVerified')}</h3>
                <p className="text-blue-200 text-sm">{t('home.byCpcbMoefcc')}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.quickAction')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.quickActionDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{t('home.startApplicationCard')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('home.startApplicationCardDesc')}
                    </p>
                    <Link href="/register">
                      <Button size="sm" className="bg-gov-blue hover:bg-blue-700">
                        {t('home.getStart')}
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
                    <h3 className="font-semibold mb-1">{t('home.trackApplication')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('home.trackApplicationDesc')}
                    </p>
                    <Link href="/login">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        {t('home.trackNow')}
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
                    <h3 className="font-semibold mb-1">{t('home.checkEligibility')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('home.verifyRequirements')}
                    </p>
                    <Link href="/check-eligibility">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        {t('home.checkNow')}
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
              {t('home.avgCompletionTime')}
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
                    {t('home.eligibilityCriteriaTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      t('home.validGst'),
                      t('home.companyPan'),
                      t('home.min3Years'),
                      t('home.min3Installations'),
                      t('home.techCapability'),
                      t('home.qualityMgmt'),
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
                    {t('home.requiredDocumentsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      t('home.gstCertificate'),
                      t('home.companyPanCard'),
                      t('home.certIncorporation'),
                      t('home.clientInstallCerts'),
                      t('home.techSpecSheets'),
                      t('home.isoQualityCerts'),
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
                  {t('home.checkEligibilityApply')}
                </Button>
              </Link>
              <Link href="mailto:apcd-support@npcindia.gov.in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-5 w-5" />
                  {t('home.haveQuestionsContact')}
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
            {t('home.multiCategoryNote')}
          </p>
        </div>
      </section>

      {/* Why Choose Our Portal? */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.whyChoose')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('home.whyChooseDesc')}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.trustedBy')}</h2>
            <p className="text-muted-foreground">{t('home.trustedByDesc')}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.testimonials')}</h2>
            <p className="text-muted-foreground">{t('home.testimonialsDesc')}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.feeStructure')}</h2>
            <p className="text-muted-foreground">{t('home.feeStructureDesc')}</p>
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
              {t('home.feeExample')}
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
            {t('home.stillHaveQuestions')}{' '}
            <Link
              href="mailto:apcd-support@npcindia.gov.in"
              className="text-gov-blue font-medium hover:underline"
            >
              {t('home.contactSupport')}
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
              <p className="text-sm text-gray-400">{t('home.footerAboutText')}</p>
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
                    {t('home.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="hover:text-white">
                    {t('home.termsOfUse')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://cpcb.nic.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {t('home.cpcbWebsite')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.contact')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{t('home.npcAddress1')}</li>
                <li>{t('home.npcAddress2')}</li>
                <li>{t('home.npcAddress3')}</li>
                <li>{t('home.npcEmail')}</li>
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
