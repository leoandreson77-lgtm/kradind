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
  HeartHandshake,
  Compass,
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
  | "disclaimer"
  | "editorial";

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
      ["privacy", "terms", "cancellation", "booking", "cookie", "visa", "disclaimer", "editorial"].includes(
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
    // Route navigation matching specific canonical pages
    const routeMap: Record<PolicyTab, string> = {
      privacy: "/privacy-policy",
      terms: "/terms-and-conditions",
      editorial: "/editorial-and-safety-policy",
      cancellation: "/cancellation-and-refund-policy",
      booking: "/booking-and-payment-policy",
      cookie: "/cookie-policy",
      disclaimer: "/website-disclaimer",
      visa: "/visa-and-international-travel-disclaimer",
    };
    if (routeMap[tab]) {
      router.push(routeMap[tab], { scroll: false });
    }
  };

  const tabs = [
    {
      id: "privacy" as PolicyTab,
      name: "Privacy Policy",
      shortName: "Privacy Policy",
      icon: Shield,
      badge: "DPDP Act 2023 Compliant",
    },
    {
      id: "terms" as PolicyTab,
      name: "Terms & Conditions",
      shortName: "Terms & Conditions",
      icon: FileText,
      badge: "Service Agreement",
    },
    {
      id: "editorial" as PolicyTab,
      name: "Editorial & Safety Policy",
      shortName: "Editorial & Safety Policy",
      icon: Shield,
      badge: "E-E-A-T Verified Standards",
    },
    {
      id: "cancellation" as PolicyTab,
      name: "Cancellation & Refund Policy",
      shortName: "Cancellation & Refund Policy",
      icon: RefreshCw,
      badge: "Fair Cancellation Slabs",
    },
    {
      id: "booking" as PolicyTab,
      name: "Booking & Payment Policy",
      shortName: "Booking & Payment Policy",
      icon: CreditCard,
      badge: "Secure Payment Protocol",
    },
    {
      id: "cookie" as PolicyTab,
      name: "Cookie Policy",
      shortName: "Cookie Policy",
      icon: Cookie,
      badge: "Tracking & Tech",
    },
    {
      id: "disclaimer" as PolicyTab,
      name: "Website Disclaimer",
      shortName: "Website Disclaimer",
      icon: AlertTriangle,
      badge: "General Legal Notice",
    },
    {
      id: "visa" as PolicyTab,
      name: "Visa & International Travel Disclaimer",
      shortName: "Visa & International Travel Disclaimer",
      icon: Plane,
      badge: "Immigration & Entry",
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
                    <span>Data Protection &amp; Privacy Standards • DPDP Act 2023 Compliant</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Privacy Policy
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span>Effective Date: <strong>09 September 2026</strong></span>
                    <span>•</span>
                    <span>Last Updated: <strong>21 September 2026</strong></span>
                    <span>•</span>
                    <span>Governing Entity: <strong>KRADIND Adventures Private Limited / KRAD Global</strong></span>
                  </div>
                </div>

                {/* Statutory Overview Box */}
                <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/80 text-xs leading-relaxed text-emerald-950 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Official Privacy &amp; Data Protection Commitment</span>
                  </div>
                  <p className="m-0">
                    KRADIND Adventures Private Limited operating jointly with KRAD Global (&quot;KRADIND&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides high-altitude alpine expeditions, Himalayan trekking circuits, and domestic and international travel management via our official domain <strong className="text-emerald-900">www.kradind.com</strong>. We are resolutely committed to safeguarding your personal data in strict conformity with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, the <strong>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
                  </p>
                  <p className="m-0 text-[11px] text-emerald-800">
                    This Privacy Policy comprehensively governs the collection, processing, storage, sharing, and statutory deletion of personal data collected from website visitors, travel inquirers, booking customers, and expedition participants.
                  </p>
                </div>

                {/* 1. Introduction & Statutory Scope */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Introduction, Operating Entity &amp; Scope</h3>
                  <p className="text-xs leading-relaxed">
                    Under the DPDP Act 2023, KRADIND Adventures Private Limited functions as a <em>Data Fiduciary</em> determining the purpose and means of processing personal data provided by you (the <em>Data Principal</em>). This policy applies to:
                  </p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li>Visitors accessing <strong>www.kradind.com</strong> or our associated mobile interfaces.</li>
                    <li>Individuals submitting tour inquiries, quotation requests, or live chat messages.</li>
                    <li>Confirmed travellers booking domestic holidays, high-altitude treks, or international excursions.</li>
                    <li>Participants completing alpine health declarations and base-camp documentation.</li>
                    <li>Users communicating via official WhatsApp helplines, telephone calls, or emails.</li>
                  </ul>
                </section>

                {/* 2. Detailed Categories of Personal Data Collected */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. Categories of Personal Data We Collect</h3>
                  <p className="text-xs leading-relaxed">
                    To deliver secure mountain expeditions and travel itineraries, we collect specific categories of information based on the nature of your interaction:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <FileText className="w-3.5 h-3.5" />
                        2.1 Personal Identity &amp; Contact Details
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Full legal name (matching government-issued photo ID)</li>
                        <li>Gender, date of birth, and age verification</li>
                        <li>Primary telephone number and WhatsApp mobile contact</li>
                        <li>Verified email address for confirmations and vouchers</li>
                        <li>Complete residential address and state of domicile</li>
                        <li>Father&apos;s/Guardian&apos;s name (for minor participants)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <Shield className="w-3.5 h-3.5" />
                        2.2 Government ID &amp; Forest / Army Permits
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Government Photo ID proof (Aadhaar Card, Voter ID, Driving Licence)</li>
                        <li>Passport copy (number, expiry date, nationality, place of issue)</li>
                        <li>State Forest Department trek entry permits and sanctuary tokens</li>
                        <li>Inner Line Permits (ILP) and Border Area ITBP / Army clearances</li>
                        <li>Foreign national details: Visa copy, e-FRRO registration, Form C data</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        2.3 Alpine Medical Fitness &amp; Emergency Health
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Self-declaration of physical fitness for high altitude (10,000+ ft)</li>
                        <li>Pre-existing medical conditions (asthma, hypertension, cardiac ailments, epilepsy)</li>
                        <li>Past history of Acute Mountain Sickness (AMS), HAPE, or HACE</li>
                        <li>Blood group, critical allergies, and dietary restrictions</li>
                        <li>Next-of-kin emergency contact: Full name, relationship, 24x7 phone</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <CreditCard className="w-3.5 h-3.5" />
                        2.4 Financial &amp; Transaction Information
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Payment transaction reference IDs and UTR numbers</li>
                        <li>Bank transfer counterfoils (NEFT/RTGS/IMPS receipts)</li>
                        <li>Billing entity name, address, and corporate GSTIN</li>
                        <li>Refund bank account details (in event of approved cancellation)</li>
                        <li><strong className="text-slate-800">Notice:</strong> Card numbers and CVVs are handled solely by RBI-licensed PCI-DSS gateways and are NEVER stored by us</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <Compass className="w-3.5 h-3.5" />
                        2.5 Telemetry, Safety Logs &amp; Trail Media
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Base camp check-in rosters and morning pulse-oximeter logs</li>
                        <li>Satellite communicator / VHF radio check-in timestamps</li>
                        <li>Emergency SOS GPS coordinates during rescue operations</li>
                        <li>Expedition photographs and group celebration summit media</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-800">
                        <Lock className="w-3.5 h-3.5" />
                        2.6 Technical Logs &amp; Web Analytics
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>Internet Protocol (IP) address and approximate geolocation</li>
                        <li>Browser version, operating system, and device identifiers</li>
                        <li>Pages visited, duration of visit, and referral URLs</li>
                        <li>Session cookies and preference tokens</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 3. Methods of Data Collection */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. How We Collect Your Personal Information</h3>
                  <p className="text-xs leading-relaxed">
                    We collect personal data transparently through the following lawful avenues:
                  </p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li><strong>Direct Digital Submissions:</strong> Booking inquiry forms, itinerary customizer, and contact modals on www.kradind.com.</li>
                    <li><strong>Direct Communication:</strong> Verbal and text discussions via our verified WhatsApp (+91 75002 22141) and official email (@kradind.com).</li>
                    <li><strong>Offline Base Camp Check-In:</strong> Physical sign-in registers, photo ID verification, and medical fitness forms at assembly points in Rishikesh, Dehradun, Sankri, Joshimath, Manali, Leh, or Srinagar.</li>
                    <li><strong>Automated Telemetry:</strong> Cookies, server error logs, and web analytics tracking as you browse our digital interfaces.</li>
                    <li><strong>Authorised Third Parties:</strong> Corporate HR coordinators or group organizers providing participant rosters with your prior authorization.</li>
                  </ul>
                </section>

                {/* 4. Lawful Grounds & Specific Purposes */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Lawful Grounds &amp; Purposes of Processing</h3>
                  <p className="text-xs leading-relaxed">
                    In compliance with Section 4 and Section 7 of the DPDP Act 2023, personal data is processed solely under valid lawful grounds:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-3 text-left border-b border-slate-200">Lawful Basis</th>
                          <th className="p-3 text-left border-b border-slate-200">Processing Activity</th>
                          <th className="p-3 text-left border-b border-slate-200">Categories of Data Used</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-600">
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Performance of Contract</td>
                          <td className="p-3">Executing tour bookings, securing mountain homestays/campsites, provisioning trek leaders, reserving flights/cabs.</td>
                          <td className="p-3">Identity, Contact, Travel preferences, Financial receipts.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Explicit Consent</td>
                          <td className="p-3">Providing customized quotes, trail condition advisories, weather radar alerts, and promotional announcements.</td>
                          <td className="p-3">Name, Email, WhatsApp number, Itinerary choices.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Vital Interests (Life Safety)</td>
                          <td className="p-3">High-altitude medical rescue, administering emergency wilderness first aid, helicopter evacuation dispatch during AMS/trauma.</td>
                          <td className="p-3">Medical fitness declaration, Blood group, Emergency contact, GPS telemetry.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Statutory &amp; Legal Compliance</td>
                          <td className="p-3">State Forest Department wildlife permits, ITBP border clearance, e-FRRO foreigner registration, GST invoicing, police verification.</td>
                          <td className="p-3">Government Photo ID, Passport, Visa, Tax invoice data.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 5. Sharing & Authorised Disclosures */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. Sharing &amp; Third-Party Disclosures</h3>
                  <p className="text-xs leading-relaxed">
                    Personal data is shared strictly on a confidential, need-to-know basis with verified operational partners:
                  </p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li><strong>Accommodations &amp; Campsites:</strong> Hotels, eco-lodges, homestays, and alpine camping teams for guest check-in rosters.</li>
                    <li><strong>Government &amp; Forest Authorities:</strong> State Forest Departments (Uttarakhand, Himachal Pradesh, J&amp;K, Ladakh, Sikkim), Wildlife Wardens, District Magistrates, and Armed Forces for permit verification.</li>
                    <li><strong>Transport &amp; Flight Carriers:</strong> Mountain taxi associations, tempo traveller operators, and airline consolidators.</li>
                    <li><strong>Expedition Staff:</strong> Certified NIM/HMI trek leaders, high-altitude guides, and base camp coordinators.</li>
                    <li><strong>Emergency Medical &amp; Rescue Agencies:</strong> Wilderness First Aid paramedics, local mountain hospitals, State Disaster Response Force (SDRF), NDRF, and emergency helicopter evacuation services.</li>
                    <li><strong>Payment Gateways &amp; Banks:</strong> RBI-licensed payment processors (PCI-DSS compliant) for processing digital payments and refunds.</li>
                    <li><strong>Law Enforcement &amp; Regulatory Bodies:</strong> When legally mandated under valid Indian court orders or police summons.</li>
                  </ul>
                  
                  {/* Strict No Sale Guarantee */}
                  <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl text-xs font-semibold text-emerald-950 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm text-emerald-900 block mb-0.5">Strict Anti-Commercialization Guarantee</strong>
                      KRADIND Adventures Private Limited and KRAD Global explicitly warrant that we <strong>NEVER</strong> sell, rent, lease, trade, or monetize your personal or medical data to third-party brokers, advertisers, or marketing firms under any circumstances.
                    </div>
                  </div>
                </section>

                {/* 6. International Cross-Border Transfers */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">6. Cross-Border / International Data Transfers</h3>
                  <p className="text-xs leading-relaxed">
                    For international tour packages (e.g., Dubai, Bali, Thailand, Singapore, Nepal, Europe, etc.), your passport bio-data and itinerary requirements are transferred to overseas Destination Management Companies (DMCs), foreign airlines, embassies, and hotels solely to execute the travel services. All cross-border transfers adhere to Section 16 of the DPDP Act 2023 and ensure adequate security protocols.
                  </p>
                </section>

                {/* 7. Anti-Fraud & Payment Security Advisory */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">7. Anti-Fraud Advisory &amp; Payment Security Protocols</h3>
                  <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-3 text-xs text-rose-950">
                    <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>CRITICAL CONSUMER SECURITY ADVISORY</span>
                    </div>
                    <p className="m-0 leading-relaxed">
                      KRADIND Adventures and KRAD Global representatives will <strong>NEVER</strong> request, solicit, or require you to disclose:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-bold text-rose-900 pt-1">
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ One-Time Password (OTP)</span>
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ UPI PIN / QR Approvals</span>
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ ATM / Debit Card PIN</span>
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ CVV / Card Security Code</span>
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ Net Banking Passwords</span>
                      <span className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">❌ Screen-Sharing App Installs</span>
                    </div>
                    <p className="m-0 text-[11px] text-rose-800">
                      All official remittances must be made solely to official company bank accounts or through verified payment links ending in <strong>kradind.com</strong>.
                    </p>
                  </div>
                </section>

                {/* 8. Cookies & Web Tracking */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">8. Cookies &amp; Tracking Technologies</h3>
                  <p className="text-xs leading-relaxed">
                    Our web portal uses first-party and trusted third-party cookies to optimize user experience:
                  </p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li><strong>Strictly Necessary Cookies:</strong> Essential for session authentication, page routing, and CSRF attack prevention.</li>
                    <li><strong>Performance &amp; Analytics Cookies:</strong> Google Analytics cookies to monitor traffic flows, server latency, and popular trekking routes.</li>
                    <li><strong>Functional Cookies:</strong> Storing currency preferences and itinerary filter states.</li>
                    <li><strong>Security Cookies:</strong> Detecting bot traffic and unauthorized access attempts.</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    You may manage or disable cookies via your browser settings. For further technical details, review our <Link href="/cookie-policy" className="text-emerald-700 underline font-semibold">Cookie Policy</Link>.
                  </p>
                </section>

                {/* 9. Data Security Safeguards */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">9. Technical &amp; Organizational Data Security</h3>
                  <p className="text-xs leading-relaxed">
                    We maintain comprehensive technical and administrative safeguards in accordance with Section 8(5) of the DPDP Act 2023 and the SPDI Rules 2011:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">🔐 TLS 256-Bit Transport Encryption</strong>
                      <p className="text-slate-600 m-0">All website transmissions are encrypted using modern Transport Layer Security certificates.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">🛡️ Role-Based Access Controls (RBAC)</strong>
                      <p className="text-slate-600 m-0">Trekker medical records and ID copies are accessible exclusively by verified expedition directors.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">🏢 Secure Cloud Infrastructure</strong>
                      <p className="text-slate-600 m-0">Hosted in enterprise data centers featuring regular vulnerability assessments and firewall shielding.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">📋 Physical Document Shredding</strong>
                      <p className="text-slate-600 m-0">Printed base camp rosters and health declarations are securely shredded upon statutory expiry.</p>
                    </div>
                  </div>
                </section>

                {/* 10. Data Retention Schedule */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">10. Data Retention &amp; Disposal Schedule</h3>
                  <p className="text-xs leading-relaxed">
                    Personal data is retained only for periods strictly necessary to fulfill the operational purpose or comply with statutory requirements:
                  </p>
                  <ul className="text-xs space-y-1.5 list-disc pl-5">
                    <li><strong>Pre-Booking Inquiries:</strong> Retained for 180 days to facilitate trip planning, then permanently purged.</li>
                    <li><strong>Completed Booking Records:</strong> Retained for the duration of the journey plus 90 days for post-trip service support.</li>
                    <li><strong>Tax, Invoicing &amp; Financial Audits:</strong> Retained for a mandatory statutory duration of <strong>7 years</strong> in compliance with Section 44AA of the Income Tax Act, 1961 and the GST Act, 2017.</li>
                    <li><strong>High-Altitude Medical Disclosures:</strong> Retained for <strong>1 year</strong> following trek completion for liability and insurance verification, after which they are securely expunged.</li>
                    <li><strong>Forest Department &amp; Border Permits:</strong> Retained in adherence to specific state forestry guidelines.</li>
                  </ul>
                </section>

                {/* 11. Your Statutory Privacy Rights */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">11. Your Rights as a Data Principal (DPDP Act 2023)</h3>
                  <p className="text-xs leading-relaxed">
                    Under Chapter III of the Digital Personal Data Protection Act 2023, you hold the following enforceable rights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">1. Right to Access Information</strong>
                      <span className="text-slate-600">Request a summary of your personal data being processed and identities of entities with whom data was shared.</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">2. Right to Correction &amp; Completion</strong>
                      <span className="text-slate-600">Request rectification of inaccurate data or completion of incomplete personal information.</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">3. Right to Erasure / Deletion</strong>
                      <span className="text-slate-600">Request permanent deletion of data when the processing purpose is fulfilled, subject to statutory tax laws.</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">4. Right to Withdraw Consent</strong>
                      <span className="text-slate-600">Withdraw consent for marketing communications or optional services at any time with immediate effect.</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">5. Right of Grievance Redressal</strong>
                      <span className="text-slate-600">Direct access to our designated Grievance Officer with guaranteed statutory response timelines.</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block">6. Right to Nominate</strong>
                      <span className="text-slate-600">Nominate any individual to exercise your data rights in the unfortunate event of death or incapacity.</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    To exercise any statutory right, submit a written request to our Grievance Officer at <a href="mailto:grievance@kradind.com" className="text-emerald-700 underline font-semibold">grievance@kradind.com</a>.
                  </p>
                </section>

                {/* 12. Protection of Children & Minors */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">12. Protection of Children &amp; Minors</h3>
                  <p className="text-xs leading-relaxed">
                    In compliance with Section 9 of the DPDP Act 2023, KRADIND Adventures does not knowingly process personal data of individuals under the age of 18 without verifiable consent from a parent or lawful guardian. Minors participating in high-altitude treks must be accompanied by an adult guardian or provide written parental consent alongside valid guardian ID verification. We strictly abstain from tracking or behavioral profiling of minor users.
                  </p>
                </section>

                {/* 13. Trail Photography & Media Consent */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">13. Trail Photography, Videography &amp; Social Media</h3>
                  <p className="text-xs leading-relaxed">
                    During scheduled expeditions, our mountain leads may capture candid group photos or summit reels for expedition documentation and community sharing on official channels. If you do not wish to be included in public media:
                  </p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>Inform the trek leader during the base camp briefing before trail departure.</li>
                    <li>Or submit an opt-out email with your batch details to <a href="mailto:support@kradind.com" className="text-emerald-700 underline">support@kradind.com</a>.</li>
                    <li>Upon receiving a takedown request, we will blur or remove the participant&apos;s likeness from digital media within <strong>48 hours</strong>.</li>
                  </ul>
                </section>

                {/* 14. Third-Party Websites */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">14. External Third-Party Links</h3>
                  <p className="text-xs leading-relaxed">
                    Our website may contain links to external portals such as airline web check-ins, national park portals, regional weather bureaus, or payment intermediaries. KRADIND Adventures does not control and is not liable for the privacy practices, content, or data handling protocols of third-party platforms.
                  </p>
                </section>

                {/* 15. Policy Updates & Versioning */}
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">15. Amendments to This Privacy Policy</h3>
                  <p className="text-xs leading-relaxed">
                    We may update this Privacy Policy periodically to reflect technological changes, alpine operational improvements, or updates to Indian data protection laws. Significant amendments will be highlighted through a prominent notice on <strong>www.kradind.com</strong> along with a revised &quot;Last Updated&quot; date.
                  </p>
                </section>

                {/* 16. Designated Grievance Officer & Statutory Contacts */}
                <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Statutory Grievance Redressal Mechanism</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed m-0">
                    Pursuant to Section 19 of the Digital Personal Data Protection Act, 2023 and Rule 5(9) of the Information Technology (SPDI) Rules, 2011, the details of the designated <strong>Grievance Redressal Officer</strong> are published below:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-slate-200">
                    <div className="space-y-2">
                      <p className="m-0"><strong>Designation:</strong> Data Protection &amp; Grievance Redressal Officer</p>
                      <p className="m-0"><strong>Operating Entity:</strong> KRADIND Adventures Private Limited &amp; KRAD Global</p>
                      <p className="m-0"><strong>Official Website:</strong> <a href="https://kradind.com" className="text-emerald-400 underline">www.kradind.com</a></p>
                      <p className="m-0"><strong>Registered Office:</strong> Hall No. H-04, 401 Pratap Palace, Indiranagar Colony, Dehradun, Uttarakhand – 248001, India</p>
                    </div>

                    <div className="space-y-2">
                      <p className="m-0">
                        <strong>Dedicated Grievance Email:</strong>{" "}
                        <a href="mailto:grievance@kradind.com" className="text-emerald-400 underline font-bold">
                          grievance@kradind.com
                        </a>
                      </p>
                      <p className="m-0">
                        <strong>Operational Support Email:</strong>{" "}
                        <a href="mailto:support@kradind.com" className="text-emerald-400 underline">
                          support@kradind.com
                        </a>{" "}
                        /{" "}
                        <a href="mailto:kradglobalind@gmail.com" className="text-emerald-400 underline">
                          kradglobalind@gmail.com
                        </a>
                      </p>
                      <p className="m-0">
                        <strong>Emergency Helpline:</strong>{" "}
                        <a href="tel:+917500222141" className="text-emerald-400 font-bold">
                          +91 75002 22141
                        </a>
                      </p>
                      <p className="m-0 text-[11px] text-slate-400">
                        <strong>Service Level Agreement (SLA):</strong> Acknowledgment within <strong>24 hours</strong>; final resolution within <strong>15 working days</strong>.
                      </p>
                    </div>
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

            {/* ========================================================================= */}
            {/* 8. EDITORIAL & SAFETY POLICY (E-E-A-T STANDARDS) */}
            {/* ========================================================================= */}
            {activeTab === "editorial" && (
              <div className="space-y-8 prose prose-slate max-w-none text-slate-700">
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>E-E-A-T Verification &amp; Expedition Quality</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font m-0">
                    Editorial &amp; Safety Policy
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  At <strong>KRADIND Adventures (www.kradind.com)</strong>, we adhere to strict editorial integrity, mountaineering accuracy, and wilderness safety standards. Our content is curated, fact-checked, and regularly audited to ensure every trekker receives safe, authentic, and verified guidance.
                </p>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">1. Author Expertise &amp; Trail Leadership</h3>
                  <p className="text-xs leading-relaxed">
                    All itinerary descriptions, altitude acclimatization profiles, gear recommendations, and difficulty ratings are written or reviewed by certified mountaineering professionals, including graduates of the <strong>Nehru Institute of Mountaineering (NIM)</strong>, <strong>Himalayan Mountaineering Institute (HMI)</strong>, and <strong>Wilderness First Aid (WFA)</strong> certified expedition leads.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">2. Ground Truth &amp; Live Weather Radar</h3>
                  <p className="text-xs leading-relaxed">
                    Our Live Trail Radar updates are sourced directly from mountain base camps, local guides, and regional weather monitors. When trail conditions change due to unseasonal snow, landslides, or high-altitude weather advisories, our expedition team updates route statuses promptly.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">3. Leave No Trace (LNT) &amp; Eco-Trekking Standards</h3>
                  <p className="text-xs leading-relaxed">
                    We strictly endorse the 7 Principles of Leave No Trace. We mandate that small batch departures (maximum 15 participants) leave mountain campsites cleaner than they were found, carrying back all dry and non-biodegradable waste.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">4. Independent Advice &amp; Transparency</h3>
                  <p className="text-xs leading-relaxed">
                    Our gear advice, fitness guidelines, and trek difficulty assessments are completely independent and impartial. We never accept payment to misrepresent trail difficulty or safety requirements.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 m-0">5. Corrections &amp; Feedback Policy</h3>
                  <p className="text-xs leading-relaxed">
                    We welcome feedback from the mountaineering community. If you spot an inaccuracy regarding trail distances, elevations, or regional regulations, please email our editorial desk at <strong>support@kradind.com</strong>. We verify and correct confirmed errors within 48 hours.
                  </p>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm m-0">Editorial Desk Contact</h4>
                  <div className="pt-2 text-slate-800 space-y-1 font-medium">
                    <p className="m-0"><strong>Chief Expedition Directorate:</strong> KRADIND Expedition Team</p>
                    <p className="m-0"><strong>Organization:</strong> KRADIND Adventures Private Limited</p>
                    <p className="m-0"><strong>Address:</strong> Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India</p>
                    <p className="m-0"><strong>Email:</strong> support@kradind.com / kradglobalind@gmail.com</p>
                    <p className="m-0"><strong>Last Reviewed:</strong> 14 September 2026</p>
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
