"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  FileText,
  RefreshCw,
  CreditCard,
  Cookie,
  Plane,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Printer,
  ChevronRight,
  Lock,
  ExternalLink,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";

export type PolicyTab =
  | "privacy"
  | "terms"
  | "cancellation"
  | "booking"
  | "cookie"
  | "visa"
  | "disclaimer";

interface LegalPoliciesViewProps {
  defaultTab?: PolicyTab;
}

export function LegalPoliciesView({ defaultTab = "privacy" }: LegalPoliciesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<PolicyTab>(defaultTab);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as PolicyTab | null;
    if (
      tabParam &&
      ["privacy", "terms", "cancellation", "booking", "cookie", "visa", "disclaimer"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [searchParams, defaultTab]);

  const handleTabChange = (tab: PolicyTab) => {
    setActiveTab(tab);
    // Route navigation matching specific pages
    const routeMap: Record<PolicyTab, string> = {
      privacy: "/privacy-policy",
      terms: "/terms-and-conditions",
      cancellation: "/cancellation-policy",
      booking: "/booking-policy",
      cookie: "/cookie-policy",
      visa: "/disclaimer?tab=visa",
      disclaimer: "/disclaimer",
    };
    if (routeMap[tab]) {
      router.push(routeMap[tab], { scroll: false });
    }
  };

  const tabs = [
    {
      id: "privacy" as PolicyTab,
      name: "Privacy Policy",
      shortName: "Privacy",
      icon: Shield,
      badge: "User Data & Protection",
    },
    {
      id: "terms" as PolicyTab,
      name: "Terms & Conditions",
      shortName: "Terms",
      icon: FileText,
      badge: "Service Agreement",
    },
    {
      id: "cancellation" as PolicyTab,
      name: "Cancellation & Refund",
      shortName: "Refunds",
      icon: RefreshCw,
      badge: "Cancellation Terms",
    },
    {
      id: "booking" as PolicyTab,
      name: "Booking & Payment",
      shortName: "Payments",
      icon: CreditCard,
      badge: "Payment Security",
    },
    {
      id: "cookie" as PolicyTab,
      name: "Cookie Policy",
      shortName: "Cookies",
      icon: Cookie,
      badge: "Tracking & Tech",
    },
    {
      id: "visa" as PolicyTab,
      name: "Visa & International",
      shortName: "Visa Info",
      icon: Plane,
      badge: "Immigration & Entry",
    },
    {
      id: "disclaimer" as PolicyTab,
      name: "Website Disclaimer",
      shortName: "Disclaimer",
      icon: AlertTriangle,
      badge: "General Notice",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

      {/* Hero Header Banner */}
      <section className="bg-gradient-to-b from-[#0F3A2E] via-[#16483a] to-[#0d2e24] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/30">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Legal Documentation & Consumer Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-font">
            Legal, Privacy & Policies Center
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Transparent policies governing our travel services, booking procedures, cancellations, and data privacy protection under KRAD Global.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Effective Date: <strong>09 September 2026</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Official Operator: <strong>KRAD Global / www.kradind.com</strong>
            </span>
            <button
              onClick={() => window.print()}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F3A2E] text-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-[#0F3A2E] hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left / Sticky Side Index */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Quick Policy Index */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                All Legal Policies
              </h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer text-left ${
                        isActive
                          ? "bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                        {tab.shortName}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Official Contact & Registration Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-md border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <Shield className="w-4 h-4" />
                <span>Official Entity Details</span>
              </div>
              <p className="font-bold text-sm text-white">KRAD Global</p>
              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="mailto:kradglobalind@gmail.com" className="hover:text-white underline">
                    kradglobalind@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href="tel:+917500222141" className="hover:text-white">
                    +91 75002 22141
                  </a>
                </div>
              </div>
            </div>

            {/* Fraud & Security Alert Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Security Advisory</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                KRAD Global representatives will <strong>NEVER</strong> ask you to reveal your OTP, UPI PIN, ATM PIN, Card PIN, or Internet Banking Password.
              </p>
            </div>

          </aside>

          {/* Right / Policy Content Viewer */}
          <article className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
            
            {/* ========================================================================= */}
            {/* 1. PRIVACY POLICY */}
            {/* ========================================================================= */}
            {activeTab === "privacy" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Data Protection & Privacy Standards</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Privacy Policy
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span>Effective Date: <strong>09 September 2026</strong></span>
                    <span>•</span>
                    <span>Last Updated: <strong>09 September 2026</strong></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-600">
                  KRAD Global (&quot;KRAD Global&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website <strong className="text-slate-800">www.kradind.com</strong> and provides domestic and international travel and tourism services. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, store and protect information when you visit our website, contact us, request a quotation, or purchase our travel services.
                </div>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Information We Collect</h3>
                  <p className="text-sm leading-relaxed">
                    We may collect information necessary to provide our travel services, including:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs list-disc pl-5">
                    <li>Full name</li>
                    <li>Mobile or telephone number</li>
                    <li>Email address</li>
                    <li>Address</li>
                    <li>Travel dates</li>
                    <li>Destination and itinerary preferences</li>
                    <li>Number of travellers</li>
                    <li>Age/date of birth where required</li>
                    <li>Passport and visa information for international travel</li>
                    <li>Emergency contact details</li>
                    <li>Special travel requirements voluntarily provided by you</li>
                    <li>Booking and transaction information</li>
                    <li>Enquiry and communication history</li>
                    <li>Information submitted through website forms</li>
                    <li>IP address, browser type, device information and website usage information</li>
                  </ul>
                  <p className="text-xs text-slate-500 italic">
                    We request only information reasonably necessary for providing or arranging the requested travel services.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. How We Collect Information</h3>
                  <p className="text-sm leading-relaxed">We may collect information when you:</p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li>Submit an enquiry on www.kradind.com</li>
                    <li>Request a tour package or customized quotation</li>
                    <li>Make a booking for domestic or international tours</li>
                    <li>Contact us by phone, WhatsApp or email</li>
                    <li>Communicate with our travel representatives</li>
                    <li>Subscribe to promotional communications</li>
                    <li>Use our website</li>
                    <li>Interact with our online advertisements or social media channels</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. How We Use Your Information</h3>
                  <p className="text-sm leading-relaxed">We may use your information to:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs list-disc pl-5">
                    <li>Respond to enquiries &amp; requests</li>
                    <li>Prepare travel quotations</li>
                    <li>Customize tour packages</li>
                    <li>Process and manage bookings</li>
                    <li>Arrange hotels, transportation, flights, sightseeing and activities</li>
                    <li>Provide customer support</li>
                    <li>Process payments through authorized payment providers</li>
                    <li>Assist with visa or travel documentation where applicable</li>
                    <li>Send booking confirmations and travel updates</li>
                    <li>Communicate important changes to your itinerary</li>
                    <li>Improve our website and services</li>
                    <li>Prevent fraud and unauthorized activity</li>
                    <li>Maintain business and financial records</li>
                    <li>Comply with applicable laws and regulations</li>
                    <li>Send promotional offers where permitted by law</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Sharing Your Information</h3>
                  <p className="text-sm leading-relaxed">
                    To provide your requested travel services, we may share relevant information with trusted third parties, including:
                  </p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li>Hotels and accommodation providers</li>
                    <li>Airlines</li>
                    <li>Transport providers</li>
                    <li>Local tour operators</li>
                    <li>Destination management companies (DMCs)</li>
                    <li>Activity and excursion providers</li>
                    <li>Visa/documentation service providers</li>
                    <li>Travel insurance providers</li>
                    <li>Payment gateways and financial service providers</li>
                    <li>Technology and website service providers</li>
                    <li>Government, immigration or regulatory authorities where legally required</li>
                  </ul>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900">
                    We do NOT sell your personal information to third parties for their independent marketing purposes.
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. International Travel and Data Transfers</h3>
                  <p className="text-xs leading-relaxed">
                    If you book an international trip, certain personal information may need to be shared with service providers located outside India. For example, hotels, airlines, destination management companies, visa service providers or local operators in another country may require traveller information to provide the booked services. We take reasonable steps to ensure that personal information is handled appropriately when shared with service providers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">6. Payment Information &amp; Security</h3>
                  <p className="text-xs leading-relaxed">
                    Payments may be processed through third-party payment gateways, banks or other authorized payment providers. KRAD Global does not ask customers to provide their:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <span>❌ UPI PIN</span>
                    <span>❌ ATM PIN</span>
                    <span>❌ Card PIN</span>
                    <span>❌ CVV via unsecured channels</span>
                    <span>❌ Internet banking password</span>
                    <span>❌ OTP / Passwords</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Never share confidential banking credentials with anyone claiming to represent KRAD Global.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">7. Cookies</h3>
                  <p className="text-xs leading-relaxed">
                    Our website may use cookies and similar technologies to improve website functionality, understand website traffic, remember preferences and improve user experience. Third-party analytics or advertising services may also use cookies where applicable. You can control or disable cookies through your browser settings. Disabling certain cookies may affect some website functionality.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">8. Data Security</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global takes reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, disclosure or destruction. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">9. Data Retention</h3>
                  <p className="text-xs leading-relaxed">
                    We may retain personal information for as long as reasonably necessary to complete bookings, provide customer service, maintain accounting and business records, resolve disputes, comply with legal requirements, and protect our legitimate business interests. When information is no longer reasonably required, it may be deleted, anonymized or securely disposed of.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">10. Your Privacy Rights</h3>
                  <p className="text-xs leading-relaxed">
                    Subject to applicable law, you may request access to certain personal information, correction of inaccurate information, deletion of personal information where legally applicable, withdrawal of consent, or information regarding the processing of your personal data.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">11. Marketing Communications</h3>
                  <p className="text-xs leading-relaxed">
                    We may contact you regarding your enquiry, booking, payment or travel arrangements. Where permitted, we may also send travel offers, destination information, promotional messages and other marketing communications. You may request to stop receiving promotional communications at any time.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">12. Children&apos;s Privacy</h3>
                  <p className="text-xs leading-relaxed">
                    Our website is not intentionally designed to collect personal information directly from children without appropriate involvement of a parent or legal guardian where required. If you believe that a child has provided personal information to us improperly, please contact us.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">13. Third-Party Websites</h3>
                  <p className="text-xs leading-relaxed">
                    Our website may contain links to third-party websites such as airlines, hotels, payment gateways, visa websites, insurance providers and other travel services. KRAD Global is not responsible for the privacy practices, content or security of third-party websites.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">14. Changes to This Privacy Policy</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global may update this Privacy Policy from time to time. Any updated version will be published on this webpage with a revised &quot;Last Updated&quot; date.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">15. Contact Us</h4>
                  <p className="text-slate-600 m-0">
                    For questions, concerns or requests regarding this Privacy Policy, please contact us:
                  </p>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Website: www.kradind.com</p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Address: Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. TERMS & CONDITIONS */}
            {/* ========================================================================= */}
            {activeTab === "terms" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Travel Booking Agreement</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Terms &amp; Conditions
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span>Effective Date: <strong>09 September 2026</strong></span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  Welcome to KRAD Global. These Terms &amp; Conditions govern your use of <strong>www.kradind.com</strong> and the purchase of domestic and international travel services from KRAD Global. By using our website, requesting a quotation or making a booking, you agree to these Terms &amp; Conditions.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Travel Services</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global provides travel-related services including:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs list-disc pl-5">
                    <li>Domestic tour packages</li>
                    <li>International tour packages</li>
                    <li>Customized holidays</li>
                    <li>Hotel bookings</li>
                    <li>Transportation</li>
                    <li>Sightseeing</li>
                    <li>Activities and excursions</li>
                    <li>Trekking and adventure tours</li>
                    <li>Travel assistance</li>
                    <li>Visa/documentation assistance where offered</li>
                  </ul>
                  <p className="text-xs text-slate-500 italic">
                    The exact services included in a booking will be stated in the applicable quotation, itinerary or booking confirmation.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. Booking Confirmation</h3>
                  <p className="text-xs leading-relaxed">
                    A booking is considered confirmed only after:
                  </p>
                  <ol className="text-xs space-y-1 list-decimal pl-5">
                    <li>The required traveller information has been received;</li>
                    <li>The applicable payment has been received; and</li>
                    <li>KRAD Global or the relevant service provider has confirmed the booking.</li>
                  </ol>
                  <p className="text-xs text-slate-500">
                    A quotation or provisional itinerary does not automatically constitute a confirmed booking.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. Traveller Information</h3>
                  <p className="text-xs leading-relaxed">
                    Customers must provide accurate information, including full name, date of birth, passport details, contact details, travel dates, and any other required information. KRAD Global is not responsible for additional costs, rejected services or losses resulting from incorrect or incomplete information supplied by the customer.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Tour Prices</h3>
                  <p className="text-xs leading-relaxed">
                    Prices may change before confirmation due to hotel availability, flight fare changes, currency fluctuations, fuel prices, government taxes, seasonal pricing, supplier price changes, or changes in traveller numbers. The final applicable price will be the price stated in the confirmed quotation or booking.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. Hotels &amp; Accommodations</h3>
                  <p className="text-xs leading-relaxed">
                    Hotels are subject to availability. If the selected hotel is unavailable, KRAD Global may offer an alternative property of similar category, subject to availability and applicable price differences. Hotel check-in, check-out, room allocation and property rules are governed by the respective hotel.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">6. Flights &amp; Airlines</h3>
                  <p className="text-xs leading-relaxed">
                    Flight schedules, fares, baggage allowances, seat allocation, cancellation and change rules are determined by the relevant airline. KRAD Global is not responsible for airline delays, cancellations, schedule changes, denied boarding or operational decisions made by an airline.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">7. Transportation</h3>
                  <p className="text-xs leading-relaxed">
                    Transportation will be provided according to the confirmed itinerary. Vehicle type may vary according to availability, route, local conditions and the number of travellers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">8. Itinerary Changes</h3>
                  <p className="text-xs leading-relaxed">
                    Travel plans may occasionally need to be changed because of weather, road conditions, natural disasters, government restrictions, flight changes, local conditions, safety concerns, or circumstances beyond reasonable control. Where possible, KRAD Global will attempt to arrange a reasonable alternative.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">9. Customer Responsibilities</h3>
                  <p className="text-xs leading-relaxed">
                    Travellers are responsible for carrying valid identification and travel documents, ensuring passport validity, obtaining required visas, providing accurate information, following immigration and local laws, following hotel and service-provider rules, reaching designated departure points on time, and following safety instructions during activities and tours.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">10. International Travel &amp; Visas</h3>
                  <p className="text-xs leading-relaxed">
                    International travellers are responsible for ensuring they meet all applicable entry requirements. Visa issuance and immigration decisions are made solely by the relevant authorities. KRAD Global does not guarantee visa approval or entry into any country.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">11. Travel Insurance</h3>
                  <p className="text-xs leading-relaxed">
                    Travel insurance is strongly recommended. Unless specifically mentioned in the confirmed booking, travel insurance is not included in the tour package. Customers are responsible for purchasing appropriate insurance coverage according to their travel requirements.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">12. Activities &amp; Adventure Travel</h3>
                  <p className="text-xs leading-relaxed">
                    Certain activities may involve inherent risks. Travellers must follow safety instructions provided by guides, operators and local authorities. KRAD Global may refuse participation in an activity where safety requirements are not met.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">13. Complaints</h3>
                  <p className="text-xs leading-relaxed">
                    Customers should report any service-related issue to KRAD Global or the relevant service provider as soon as reasonably possible during the trip so that an opportunity can be provided to resolve the issue.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">14. Force Majeure</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global shall not be liable for delays, cancellations, changes or inability to provide services caused by circumstances beyond reasonable control, including natural disasters, severe weather, government restrictions, strikes, war, terrorism, civil unrest, pandemics, road closures or major transportation disruptions.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">15. Acceptance</h3>
                  <p className="text-xs leading-relaxed">
                    By making a booking with KRAD Global, the customer confirms that they have read, understood and accepted these Terms &amp; Conditions.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">16. Contact</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Website: www.kradind.com</p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Address: Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. CANCELLATION & REFUND POLICY */}
            {/* ========================================================================= */}
            {activeTab === "cancellation" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>Cancellation &amp; Refund Guidelines</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Cancellation &amp; Refund Policy
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span>Effective Date: <strong>09 September 2026</strong></span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  KRAD Global understands that travel plans can change. Our cancellation and refund terms are designed to clearly explain how cancellations are handled.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Cancellation of Booking</h3>
                  <p className="text-xs leading-relaxed">
                    Customers may request cancellation of a booking by contacting KRAD Global through our official contact details. Cancellation charges depend on:
                  </p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>Destination</li>
                    <li>Type of service</li>
                    <li>Travel dates</li>
                    <li>Number of days before departure</li>
                    <li>Hotel cancellation rules</li>
                    <li>Airline cancellation rules</li>
                    <li>Supplier policies</li>
                    <li>Whether the service is refundable or non-refundable</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. Cancellation Charges</h3>
                  <p className="text-xs leading-relaxed">
                    Once a booking has been confirmed, cancellation charges may apply. Charges may include:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs list-disc pl-5">
                    <li>Hotel cancellation fees</li>
                    <li>Airline cancellation fees</li>
                    <li>Transportation cancellation charges</li>
                    <li>Activity cancellation charges</li>
                    <li>Visa/documentation fees</li>
                    <li>Supplier charges</li>
                    <li>Payment gateway charges where applicable</li>
                    <li>KRAD Global service or processing charges</li>
                    <li>Non-refundable deposits or advance payments</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    The applicable cancellation conditions will be communicated as part of the booking process wherever reasonably possible.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. Non-Refundable Services</h3>
                  <p className="text-xs leading-relaxed">
                    Some travel services may be fully or partially non-refundable, including:
                  </p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>Non-refundable hotel rates</li>
                    <li>Promotional fares</li>
                    <li>Airline tickets with restrictive fare conditions</li>
                    <li>Visa fees</li>
                    <li>Permit fees</li>
                    <li>Certain activities</li>
                    <li>Special-event bookings</li>
                    <li>Advance payments made to suppliers</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Refund Processing</h3>
                  <p className="text-xs leading-relaxed">
                    Where a refund is approved, the refundable amount will be calculated after deducting applicable cancellation and non-refundable charges. Refund processing time may depend on the airline, hotel, supplier, payment gateway or banking institution.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. No-Show</h3>
                  <p className="text-xs leading-relaxed">
                    If a traveller does not appear for a confirmed service without prior notice, the booking may be treated as a no-show. No-show bookings may be non-refundable according to supplier terms.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">6. Cancellation by KRAD Global</h3>
                  <p className="text-xs leading-relaxed">
                    If KRAD Global must cancel or significantly modify a booking because of circumstances beyond reasonable control, we will make reasonable efforts to offer an alternative arrangement. Any refund will depend on the amount recoverable from the relevant service providers and the applicable booking conditions.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">7. Refund Method</h3>
                  <p className="text-xs leading-relaxed">
                    Approved refunds will generally be processed through the original payment method or another mutually agreed method, subject to applicable payment-provider procedures.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">8. Contact for Cancellation</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Website: www.kradind.com</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. BOOKING & PAYMENT POLICY */}
            {/* ========================================================================= */}
            {activeTab === "booking" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payment Process &amp; Security</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Booking &amp; Payment Policy
                  </h2>
                </div>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Booking Process</h3>
                  <p className="text-xs leading-relaxed">
                    Customers can enquire about our travel services through our website, phone, WhatsApp or other official communication channels. After understanding your requirements, KRAD Global may provide a customized quotation or package proposal.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. Confirmation</h3>
                  <p className="text-xs leading-relaxed">
                    A booking becomes confirmed only after the required payment has been received and confirmation has been issued by KRAD Global or the relevant service provider.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. Payment</h3>
                  <p className="text-xs leading-relaxed">Customers may be required to pay:</p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>An advance amount at the time of booking</li>
                    <li>Additional payments according to the agreed payment schedule</li>
                    <li>The remaining balance before the specified travel date</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    Payment requirements may differ between travel packages and suppliers.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Price Changes</h3>
                  <p className="text-xs leading-relaxed">
                    Quoted prices may change before final confirmation due to availability, airfare changes, hotel rates, taxes, currency fluctuations or supplier price changes. Once a booking has been confirmed, any additional charges will be handled according to the applicable booking terms.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. Payment Security</h3>
                  <p className="text-xs leading-relaxed">
                    Customers should make payments only through payment methods officially communicated by KRAD Global. KRAD Global will never ask customers to disclose:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <span>❌ OTP</span>
                    <span>❌ UPI PIN</span>
                    <span>❌ ATM PIN</span>
                    <span>❌ Card PIN</span>
                    <span>❌ Internet banking password</span>
                    <span>❌ Account password</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    If you receive a suspicious payment request, contact KRAD Global using our official contact details before making payment.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">6. Failure to Complete Payment</h3>
                  <p className="text-xs leading-relaxed">
                    If the required payment is not received within the agreed time, KRAD Global may cancel or release the provisional booking. Any applicable cancellation or supplier charges may apply.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">7. Contact</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Address: Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. COOKIE POLICY */}
            {/* ========================================================================= */}
            {activeTab === "cookie" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <Cookie className="w-4 h-4 text-emerald-600" />
                    <span>Website Technologies</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Cookie Policy
                  </h2>
                  <p className="text-xs text-slate-500 m-0">Website: www.kradind.com</p>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  KRAD Global may use cookies and similar technologies to improve the functionality and performance of our website.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">What Are Cookies?</h3>
                  <p className="text-xs leading-relaxed">
                    Cookies are small text files stored on your device when you visit a website. They help websites remember information and understand how visitors use their services.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Why We Use Cookies</h3>
                  <p className="text-xs leading-relaxed">Cookies may be used to:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs list-disc pl-5">
                    <li>Keep the website functioning</li>
                    <li>Improve website performance</li>
                    <li>Remember preferences</li>
                    <li>Understand website traffic</li>
                    <li>Analyze website usage</li>
                    <li>Improve customer experience</li>
                    <li>Measure marketing performance</li>
                    <li>Support relevant advertising where applicable</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Third-Party Cookies</h3>
                  <p className="text-xs leading-relaxed">
                    Some third-party services used on our website may place their own cookies, including analytics, advertising, payment or embedded-content providers. These third parties operate according to their own policies.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Managing Cookies</h3>
                  <p className="text-xs leading-relaxed">
                    Most browsers allow you to accept, reject or delete cookies through browser settings. Disabling cookies may affect certain website features.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Updates</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global may update this Cookie Policy when our website technologies or services change.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">For questions:</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 6. VISA & INTERNATIONAL TRAVEL DISCLAIMER */}
            {/* ========================================================================= */}
            {activeTab === "visa" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <Plane className="w-4 h-4 text-emerald-600" />
                    <span>International Entry &amp; Immigration</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Visa &amp; International Travel Disclaimer
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  International travel is subject to the immigration and entry requirements of the destination country.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Visa Assistance</h3>
                  <p className="text-xs leading-relaxed">
                    Where offered, KRAD Global may assist customers with visa documentation and application procedures. However, KRAD Global does not guarantee visa approval. Visa decisions are made exclusively by the relevant embassy, consulate, immigration authority or government agency.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Traveller Responsibility</h3>
                  <p className="text-xs leading-relaxed">Travellers are responsible for:</p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>Providing genuine and accurate documents</li>
                    <li>Providing complete information</li>
                    <li>Meeting passport validity requirements</li>
                    <li>Obtaining the appropriate visa</li>
                    <li>Meeting destination-specific entry requirements</li>
                    <li>Following immigration regulations</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Visa Rejection</h3>
                  <p className="text-xs leading-relaxed">
                    If a visa application is rejected, visa fees and other charges may be non-refundable depending on the applicable authority and service-provider rules. A visa rejection does not automatically entitle the customer to a full refund of the tour package. Any refund will be subject to the applicable cancellation terms of the booked services.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Entry into a Country</h3>
                  <p className="text-xs leading-relaxed">
                    Possession of a visa does not necessarily guarantee entry into a country. Final entry decisions are made by immigration authorities at the destination.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Changing Requirements</h3>
                  <p className="text-xs leading-relaxed">
                    Visa, passport, vaccination, health and immigration requirements may change without notice. Travellers should verify the latest requirements before departure.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">Contact</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Website: www.kradind.com</p>
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 7. WEBSITE DISCLAIMER */}
            {/* ========================================================================= */}
            {activeTab === "disclaimer" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <AlertTriangle className="w-4 h-4 text-emerald-600" />
                    <span>General Website Notice</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Website Disclaimer
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  The information provided on <strong>www.kradind.com</strong> is intended for general travel and informational purposes. KRAD Global makes reasonable efforts to keep website information accurate and current. However, travel information, prices, availability and schedules can change.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Information May Change Due To:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs list-disc pl-5">
                    <li>Weather conditions</li>
                    <li>Government regulations</li>
                    <li>Airline schedules</li>
                    <li>Hotel availability</li>
                    <li>Road conditions</li>
                    <li>Local restrictions</li>
                    <li>Immigration requirements</li>
                    <li>Political or security conditions</li>
                    <li>Supplier policies</li>
                    <li>Currency fluctuations</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Images</h3>
                  <p className="text-xs leading-relaxed">
                    Images displayed on our website may be representative and may not always depict the exact hotel room, vehicle, activity or service included in a particular booking. Customers should rely on their final quotation, itinerary and booking confirmation for the exact services included.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Third-Party Services</h3>
                  <p className="text-xs leading-relaxed">
                    KRAD Global may provide links to third-party websites and services. We are not responsible for the content, availability, security or policies of third-party websites.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">Travel Risks</h3>
                  <p className="text-xs leading-relaxed">
                    Travel involves certain risks and unforeseen circumstances. Customers are responsible for following applicable laws, safety instructions and travel requirements.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">No Guarantee</h3>
                  <p className="text-xs leading-relaxed">
                    Publication of information on our website does not guarantee the availability of any particular hotel, flight, activity, destination service or travel package. Availability is confirmed only after the applicable booking has been accepted and confirmed.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">Contact</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>KRAD Global</strong></p>
                    <p className="m-0">Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India</p>
                    <p className="m-0">Email: kradglobalind@gmail.com</p>
                    <p className="m-0">Mobile / WhatsApp: +91 75002 22141</p>
                    <p className="m-0">Website: www.kradind.com</p>
                  </div>
                </section>
              </div>
            )}

          </article>

        </div>

      </main>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
