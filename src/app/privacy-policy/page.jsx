import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function PrivacyPolicyPage() {
  // Last updated date
  const lastUpdated = "May 15, 2025";

  // Table of contents items
  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collected", title: "Information We Collect" },
    { id: "information-use", title: "How We Use Your Information" },
    { id: "information-sharing", title: "Information Sharing and Disclosure" },
    { id: "cookies", title: "Cookies and Tracking Technologies" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights and Choices" },
    { id: "childrens-privacy", title: "Children&apos;s Privacy" },
    { id: "international-transfers", title: "International Data Transfers" },
    { id: "policy-changes", title: "Changes to This Privacy Policy" },
    { id: "gdpr", title: "GDPR Compliance" },
    { id: "california-rights", title: "California Privacy Rights" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Privacy Policy
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
                <p className="mb-4 text-muted-foreground">
                  SOOUQNA (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                  is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you visit our website, mobile application,
                  and use our services (collectively, the &quot;Platform&quot;).
                </p>
                <p className="text-muted-foreground">
                  Please read this Privacy Policy carefully. By accessing or
                  using our Platform, you acknowledge that you have read,
                  understood, and agree to be bound by all the terms of this
                  Privacy Policy. If you do not agree with our policies and
                  practices, please do not use our Platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section id="information-collected" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Information We Collect
                </h2>
                <p className="mb-4 text-muted-foreground">
                  We collect several types of information from and about users
                  of our Platform, including:
                </p>

                <h3 className="mb-2 text-xl font-semibold">
                  Personal Information
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Personal information is data that can be used to identify you
                  individually. This may include:
                </p>
                <ul className="ml-6 mb-6 list-disc space-y-2 text-muted-foreground">
                  <li>Name, email address, postal address, and phone number</li>
                  <li>Username and password</li>
                  <li>
                    Payment information (credit card numbers, billing addresses)
                  </li>
                  <li>Date of birth</li>
                  <li>Shipping information</li>
                  <li>Profile pictures</li>
                </ul>

                <h3 className="mb-2 text-xl font-semibold">
                  Non-Personal Information
                </h3>
                <p className="mb-4 text-muted-foreground">
                  We also collect non-personal information that does not
                  directly identify you. This may include:
                </p>
                <ul className="ml-6 mb-6 list-disc space-y-2 text-muted-foreground">
                  <li>Browser type and version</li>
                  <li>Device type and operating system</li>
                  <li>IP address</li>
                  <li>Time and date of visits</li>
                  <li>Pages viewed and features used</li>
                  <li>Referring website addresses</li>
                  <li>Search terms used to reach our Platform</li>
                </ul>

                <h3 className="mb-2 text-xl font-semibold">
                  Information Collection Methods
                </h3>
                <p className="mb-4 text-muted-foreground">
                  We collect information in the following ways:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Direct Collection:</strong> Information you provide
                    when you register, make a purchase, sign up for our
                    newsletter, participate in surveys, or contact customer
                    service.
                  </li>
                  <li>
                    <strong>Automated Collection:</strong> Information collected
                    automatically through cookies, web beacons, and other
                    tracking technologies as you navigate our Platform.
                  </li>
                  <li>
                    <strong>Third-Party Sources:</strong> Information we may
                    receive from business partners, marketing agencies, and
                    analytics providers.
                  </li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section id="information-use" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  How We Use Your Information
                </h2>
                <p className="mb-4 text-muted-foreground">
                  We use the information we collect about you for various
                  purposes, including:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Providing Services:</strong> To process and fulfill
                    your orders, manage your account, and provide customer
                    support.
                  </li>
                  <li>
                    <strong>Personalization:</strong> To personalize your
                    shopping experience, recommend products, and display
                    relevant content.
                  </li>
                  <li>
                    <strong>Communication:</strong> To communicate with you
                    about your account, orders, promotions, and updates to our
                    policies.
                  </li>
                  <li>
                    <strong>Marketing:</strong> To deliver targeted
                    advertisements and marketing communications about our
                    products and services.
                  </li>
                  <li>
                    <strong>Improvement:</strong> To analyze usage patterns,
                    conduct research, and improve our Platform and services.
                  </li>
                  <li>
                    <strong>Security:</strong> To detect, prevent, and address
                    technical issues, fraud, and security breaches.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> To comply with applicable
                    laws, regulations, and legal processes.
                  </li>
                </ul>
              </section>

              {/* Information Sharing and Disclosure */}
              <section id="information-sharing" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Information Sharing and Disclosure
                </h2>
                <p className="mb-4 text-muted-foreground">
                  We may share your information in the following circumstances:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Service Providers:</strong> With third-party service
                    providers who perform services on our behalf, such as
                    payment processing, order fulfillment, data analysis, email
                    delivery, hosting, and customer service.
                  </li>
                  <li>
                    <strong>Business Partners:</strong> With business partners
                    to offer certain products, services, or promotions.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law,
                    regulation, or legal process, such as in response to a court
                    order or government request.
                  </li>
                  <li>
                    <strong>Protection of Rights:</strong> When we believe
                    disclosure is necessary to protect our rights, property, or
                    safety, or that of our users or others.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a
                    merger, acquisition, or sale of assets, your information may
                    be transferred as a business asset.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> In other cases with your
                    explicit consent.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  We do not sell your personal information to third parties for
                  their marketing purposes without your explicit consent.
                </p>
              </section>

              {/* Cookies and Tracking Technologies */}
              <section id="cookies" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Cookies and Tracking Technologies
                </h2>
                <p className="mb-4 text-muted-foreground">
                  We use cookies, web beacons, pixels, and similar tracking
                  technologies to collect information about your browsing
                  activities on our Platform. These technologies help us analyze
                  trends, administer the website, track users&apos; movements
                  around the site, and gather demographic information about our
                  user base as a whole.
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  Types of Cookies We Use
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Essential Cookies:</strong> Necessary for the
                    operation of our Platform, such as enabling login or adding
                    items to your shopping cart.
                  </li>
                  <li>
                    <strong>Analytical/Performance Cookies:</strong> Allow us to
                    recognize and count the number of visitors and see how
                    visitors move around our Platform.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> Used to recognize
                    you when you return to our Platform, enabling us to
                    personalize content and remember your preferences.
                  </li>
                  <li>
                    <strong>Targeting Cookies:</strong> Record your visit to our
                    Platform, the pages you have visited, and the links you have
                    followed to deliver advertisements more relevant to your
                    interests.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  You can control cookies through your browser settings and
                  other tools. However, if you block certain cookies, you may
                  not be able to use all the features of our Platform.
                </p>
              </section>

              {/* Data Security */}
              <section id="data-security" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
                <p className="mb-4 text-muted-foreground">
                  We implement appropriate technical and organizational measures
                  to protect the security of your personal information. However,
                  please understand that no method of transmission over the
                  Internet or electronic storage is 100% secure. While we strive
                  to use commercially acceptable means to protect your personal
                  information, we cannot guarantee its absolute security.
                </p>
                <p className="text-muted-foreground">
                  We maintain security measures including:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>Encryption of sensitive information</li>
                  <li>Secure networks and servers</li>
                  <li>Regular security assessments</li>
                  <li>Access controls for employees and contractors</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              {/* Your Rights and Choices */}
              <section id="your-rights" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Your Rights and Choices
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Depending on your location, you may have certain rights
                  regarding your personal information. These may include:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Access:</strong> The right to request access to your
                    personal information.
                  </li>
                  <li>
                    <strong>Correction:</strong> The right to request that we
                    correct inaccurate or incomplete information.
                  </li>
                  <li>
                    <strong>Deletion:</strong> The right to request that we
                    delete your personal information in certain circumstances.
                  </li>
                  <li>
                    <strong>Restriction:</strong> The right to request that we
                    restrict the processing of your information in certain
                    circumstances.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> The right to receive your
                    personal information in a structured, commonly used, and
                    machine-readable format.
                  </li>
                  <li>
                    <strong>Objection:</strong> The right to object to our
                    processing of your personal information.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  To exercise these rights, please contact us using the
                  information provided in the &quot;Contact Information&quot;
                  section below.
                </p>
                <h3 className="mb-2 mt-6 text-xl font-semibold">
                  Marketing Communications
                </h3>
                <p className="text-muted-foreground">
                  You can opt out of receiving marketing communications from us
                  by clicking the &quot;unsubscribe&quot; link in our emails,
                  updating your communication preferences in your account
                  settings, or contacting us directly.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="childrens-privacy" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground">
                  Our Platform is not intended for children under the age of 13
                  (or 16 in certain jurisdictions). We do not knowingly collect
                  personal information from children. If you are a parent or
                  guardian and believe that your child has provided us with
                  personal information, please contact us immediately. If we
                  become aware that we have collected personal information from
                  children without verification of parental consent, we will
                  take steps to remove that information from our servers.
                </p>
              </section>

              {/* International Data Transfers */}
              <section id="international-transfers" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  International Data Transfers
                </h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to, and maintained on,
                  computers located outside of your state, province, country, or
                  other governmental jurisdiction where the data protection laws
                  may differ from those in your jurisdiction. If you are located
                  outside [Country] and choose to provide information to us,
                  please note that we transfer the information to [Country] and
                  process it there. Your submission of such information
                  represents your agreement to that transfer. We will take all
                  steps reasonably necessary to ensure that your data is treated
                  securely and in accordance with this Privacy Policy, and no
                  transfer of your personal information will take place to an
                  organization or a country unless there are adequate controls
                  in place.
                </p>
              </section>

              {/* Changes to This Privacy Policy */}
              <section id="policy-changes" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last Updated&quot; date at
                  the top. You are advised to review this Privacy Policy
                  periodically for any changes. Changes to this Privacy Policy
                  are effective when they are posted on this page. For
                  significant changes, we will provide a more prominent notice,
                  which may include email notification of Privacy Policy
                  changes.
                </p>
              </section>

              {/* GDPR Compliance */}
              <section id="gdpr" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">GDPR Compliance</h2>
                <p className="mb-4 text-muted-foreground">
                  For users in the European Union (EU) and European Economic
                  Area (EEA), we process your personal data in accordance with
                  the General Data Protection Regulation (GDPR).
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  Legal Basis for Processing
                </h3>
                <p className="mb-4 text-muted-foreground">
                  We will only process your personal data when we have a legal
                  basis to do so. Legal bases include:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Consent:</strong> You have given consent for us to
                    process your personal data for specific purposes.
                  </li>
                  <li>
                    <strong>Contract:</strong> Processing is necessary for the
                    performance of a contract with you.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> Processing is necessary
                    for compliance with a legal obligation.
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> Processing is
                    necessary for our legitimate interests or those of a third
                    party.
                  </li>
                </ul>
                <h3 className="mb-2 mt-6 text-xl font-semibold">
                  Data Protection Officer
                </h3>
                <p className="text-muted-foreground">
                  We have appointed a Data Protection Officer (DPO) who is
                  responsible for overseeing questions regarding this Privacy
                  Policy. If you have any questions about this Privacy Policy,
                  including any requests to exercise your legal rights, please
                  contact our DPO using the details provided in the
                  &quot;Contact Information&quot; section.
                </p>
              </section>

              {/* California Privacy Rights */}
              <section id="california-rights" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  California Privacy Rights
                </h2>
                <p className="mb-4 text-muted-foreground">
                  If you are a California resident, you have specific rights
                  regarding your personal information under the California
                  Consumer Privacy Act (CCPA) and California Privacy Rights Act
                  (CPRA).
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  Your Rights Under CCPA/CPRA
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Right to Know:</strong> You have the right to
                    request information about the personal information we
                    collect, use, disclose, and sell.
                  </li>
                  <li>
                    <strong>Right to Delete:</strong> You have the right to
                    request the deletion of your personal information that we
                    have collected from you, subject to certain exceptions.
                  </li>
                  <li>
                    <strong>Right to Opt-Out:</strong> You have the right to
                    opt-out of the sale of your personal information.
                  </li>
                  <li>
                    <strong>Right to Non-Discrimination:</strong> We will not
                    discriminate against you for exercising any of your CCPA
                    rights.
                  </li>
                  <li>
                    <strong>Right to Correct:</strong> You have the right to
                    request correction of inaccurate personal information.
                  </li>
                  <li>
                    <strong>
                      Right to Limit Use of Sensitive Personal Information:
                    </strong>{" "}
                    You have the right to limit the use and disclosure of
                    sensitive personal information.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  To exercise these rights, please contact us using the
                  information provided in the &quot;Contact Information&quot;
                  section.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                <p className="mb-4 text-muted-foreground">
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy or our data practices, please contact us
                  at:
                </p>
                <div className="text-muted-foreground">
                  <p>SOOUQNA Privacy Team</p>
                  <p>Email: privacy@soouqna.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>
                    Address: 123 Commerce Street, Business District, City,
                    Country
                  </p>
                </div>
                <p className="mt-4 text-muted-foreground">
                  For EU/EEA Data Subjects, our Data Protection Officer can be
                  contacted at dpo@soouqna.com.
                </p>
              </section>

              {/* Acceptance Section */}
              <section className="mt-12 rounded-lg border p-6">
                <div className="text-center">
                  <h2 className="mb-4 text-xl font-bold">
                    Acceptance of Privacy Policy
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    By using the SOOUQNA Platform, you acknowledge that you have
                    read, understood, and agree to be bound by this Privacy
                    Policy.
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
