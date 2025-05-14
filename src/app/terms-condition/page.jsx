"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function TermsPage() {
  // Last updated date
  const lastUpdated = "May 15, 2025";

  // Table of contents items
  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "eligibility", title: "Eligibility" },
    { id: "account", title: "Account Registration" },
    { id: "purchases", title: "Purchases and Payments" },
    { id: "shipping", title: "Shipping and Delivery" },
    { id: "returns", title: "Returns and Refunds" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "user-content", title: "User Content" },
    { id: "prohibited", title: "Prohibited Activities" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "termination", title: "Termination" },
    { id: "governing-law", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Last Updated: {lastUpdated}
        </p>
      </section>

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold">Table of Contents</h2>
                <nav className="space-y-2 text-sm">
                  {tableOfContents.map((item) => (
                    <div key={item.id} className="line-clamp-1">
                      <a
                        href={`#${item.id}`}
                        className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                      >
                        <ArrowRight className="mr-1 h-3 w-3" />
                        {item.title}
                      </a>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-10">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to SOOUQNA. These Terms and Conditions govern your use
                  of the SOOUQNA website, mobile application, and services
                  (collectively, the "Platform"). By accessing or using our
                  Platform, you agree to be bound by these Terms and Conditions.
                  Please read them carefully.
                </p>
              </section>

              {/* Acceptance of Terms */}
              <section id="acceptance" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using the SOOUQNA Platform, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms and Conditions. If you do not agree to these terms, you
                  must not use our Platform.
                </p>
              </section>

              {/* Eligibility */}
              <section id="eligibility" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Eligibility</h2>
                <p className="mb-4 text-muted-foreground">
                  To use our Platform, you must be at least 18 years of age or
                  the legal age of majority in your jurisdiction, whichever is
                  greater. By using our Platform, you represent and warrant that
                  you meet these eligibility requirements.
                </p>
                <p className="text-muted-foreground">
                  If you are using the Platform on behalf of a business or legal
                  entity, you represent and warrant that you have the authority
                  to bind that entity to these Terms and Conditions.
                </p>
              </section>

              {/* Account Registration */}
              <section id="account" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Account Registration
                </h2>
                <p className="mb-4 text-muted-foreground">
                  To access certain features of our Platform, you may need to
                  register for an account. You agree to provide accurate,
                  current, and complete information during the registration
                  process and to update such information to keep it accurate,
                  current, and complete.
                </p>
                <p className="mb-4 text-muted-foreground">
                  You are responsible for safeguarding your password and for all
                  activities that occur under your account. You agree to notify
                  us immediately of any unauthorized use of your account.
                </p>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account if
                  any information provided during the registration process or
                  thereafter proves to be inaccurate, false, or misleading.
                </p>
              </section>

              {/* Purchases and Payments */}
              <section id="purchases" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Purchases and Payments
                </h2>
                <p className="mb-4 text-muted-foreground">
                  All product descriptions, prices, and availability are subject
                  to change at any time without notice. We reserve the right to
                  limit quantities of any products or services purchased.
                </p>
                <p className="mb-4 text-muted-foreground">
                  When making a purchase, you agree to provide current,
                  complete, and accurate payment information. By submitting your
                  payment information, you authorize us to charge your payment
                  method for the total amount of your order, including taxes and
                  shipping fees where applicable.
                </p>
                <p className="text-muted-foreground">
                  All payments are processed securely through our payment
                  processors. We do not store your complete payment information
                  on our servers.
                </p>
              </section>

              {/* Shipping and Delivery */}
              <section id="shipping" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Shipping and Delivery
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Shipping times are estimates and are not guaranteed. We are
                  not responsible for delays caused by customs, international
                  shipping, or other factors beyond our control.
                </p>
                <p className="text-muted-foreground">
                  Risk of loss and title for items purchased pass to you upon
                  delivery of the items to the carrier. You are responsible for
                  filing any claims with carriers for damaged and/or lost
                  shipments.
                </p>
              </section>

              {/* Returns and Refunds */}
              <section id="returns" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Returns and Refunds</h2>
                <p className="mb-4 text-muted-foreground">
                  We accept returns within 30 days of purchase. Items must be in
                  their original condition, unworn, and with all tags attached.
                  Certain products, including intimate items, perishable goods,
                  and custom-made products, are not eligible for return.
                </p>
                <p className="mb-4 text-muted-foreground">
                  To initiate a return, please contact our customer service
                  team. Return shipping costs are the responsibility of the
                  customer unless the item received was defective or incorrect.
                </p>
                <p className="text-muted-foreground">
                  Refunds will be issued to the original payment method once we
                  receive and inspect the returned items. Processing times for
                  refunds may vary depending on your payment method.
                </p>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Intellectual Property
                </h2>
                <p className="mb-4 text-muted-foreground">
                  All content on our Platform, including text, graphics, logos,
                  images, audio clips, digital downloads, and software, is the
                  property of SOOUQNA or its content suppliers and is protected
                  by international copyright, trademark, and other intellectual
                  property laws.
                </p>
                <p className="text-muted-foreground">
                  You may not reproduce, distribute, modify, create derivative
                  works from, publicly display, publicly perform, republish,
                  download, store, or transmit any of the material on our
                  Platform without our prior written consent.
                </p>
              </section>

              {/* User Content */}
              <section id="user-content" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">User Content</h2>
                <p className="mb-4 text-muted-foreground">
                  By submitting content to our Platform (including but not
                  limited to product reviews, comments, and feedback), you grant
                  SOOUQNA a non-exclusive, royalty-free, perpetual, irrevocable,
                  and fully sublicensable right to use, reproduce, modify,
                  adapt, publish, translate, create derivative works from,
                  distribute, and display such content throughout the world in
                  any media.
                </p>
                <p className="mb-4 text-muted-foreground">
                  You represent and warrant that you own or control all rights
                  to the content you post, that the content is accurate, and
                  that use of the content does not violate these Terms and
                  Conditions.
                </p>
                <p className="text-muted-foreground">
                  We have the right but not the obligation to monitor and edit
                  or remove any content submitted to our Platform.
                </p>
              </section>

              {/* Prohibited Activities */}
              <section id="prohibited" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Prohibited Activities
                </h2>
                <p className="mb-4 text-muted-foreground">
                  You agree not to use our Platform for any unlawful purpose or
                  in any way that could damage, disable, overburden, or impair
                  the Platform. Prohibited activities include but are not
                  limited to:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    Using the Platform for any fraudulent or illegal purpose
                  </li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Impersonating another person or entity</li>
                  <li>Submitting false or misleading information</li>
                  <li>Interfering with the proper working of the Platform</li>
                  <li>
                    Attempting to gain unauthorized access to the Platform or
                    its related systems
                  </li>
                  <li>Engaging in any automated use of the system</li>
                  <li>Selling or transferring your account to another party</li>
                </ul>
              </section>

              {/* Privacy Policy */}
              <section id="privacy" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Privacy Policy</h2>
                <p className="mb-4 text-muted-foreground">
                  Your use of our Platform is also governed by our Privacy
                  Policy, which is incorporated by reference into these Terms
                  and Conditions. Please review our Privacy Policy to understand
                  our practices regarding the collection, use, and disclosure of
                  your personal information.
                </p>
                <p className="text-muted-foreground">
                  Our Privacy Policy can be accessed at{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary underline hover:text-primary/80"
                  >
                    soouqna.com/privacy
                  </Link>
                  .
                </p>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Limitation of Liability
                </h2>
                <p className="mb-4 text-muted-foreground">
                  In no event shall SOOUQNA, its officers, directors, employees,
                  or agents, be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    Your access to or use of or inability to access or use the
                    Platform
                  </li>
                  <li>
                    Any conduct or content of any third party on the Platform
                  </li>
                  <li>Any content obtained from the Platform</li>
                  <li>
                    Unauthorized access, use, or alteration of your
                    transmissions or content
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  Our liability to you for any cause whatsoever and regardless
                  of the form of the action, will be limited to the amount paid
                  by you to SOOUQNA for the applicable purchase.
                </p>
              </section>

              {/* Termination */}
              <section id="termination" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Termination</h2>
                <p className="mb-4 text-muted-foreground">
                  We reserve the right to terminate or suspend your account and
                  bar access to the Platform immediately, without prior notice
                  or liability, for any reason whatsoever, including without
                  limitation if you breach these Terms and Conditions.
                </p>
                <p className="text-muted-foreground">
                  All provisions of these Terms and Conditions which by their
                  nature should survive termination shall survive termination,
                  including, without limitation, ownership provisions, warranty
                  disclaimers, indemnity, and limitations of liability.
                </p>
              </section>

              {/* Governing Law */}
              <section id="governing-law" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms and Conditions shall be governed by and construed
                  in accordance with the laws of [Your Country/State], without
                  regard to its conflict of law provisions. Any dispute arising
                  out of or relating to these Terms and Conditions shall be
                  subject to the exclusive jurisdiction of the courts located
                  within [Your City, State/Country].
                </p>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Changes to Terms</h2>
                <p className="mb-4 text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms and Conditions at any time. The most
                  current version will be posted on our website with the
                  effective date.
                </p>
                <p className="text-muted-foreground">
                  Your continued use of the Platform after any such changes
                  constitutes your acceptance of the new Terms and Conditions.
                  Please check this page periodically for changes. If the
                  changes are significant, we will provide a more prominent
                  notice.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                <p className="mb-4 text-muted-foreground">
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                </p>
                <div className="text-muted-foreground">
                  <p>SOOUQNA Customer Support</p>
                  <p>Email: legal@soouqna.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>
                    Address: 123 Commerce Street, Business District, City,
                    Country
                  </p>
                </div>
              </section>

              {/* Acceptance Section */}
              <section className="mt-12 rounded-lg border p-6">
                <div className="text-center">
                  <h2 className="mb-4 text-xl font-bold">
                    Acceptance of Terms
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    By using the SOOUQNA Platform, you acknowledge that you have
                    read, understood, and agree to be bound by these Terms and
                    Conditions.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Return to Homepage
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
