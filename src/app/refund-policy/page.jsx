import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function RefundPolicyPage() {
  // Last updated date
  const lastUpdated = "May 15, 2025";

  // Table of contents items
  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "return-eligibility", title: "Return Eligibility" },
    { id: "return-process", title: "Return Process" },
    { id: "refund-process", title: "Refund Process" },
    { id: "exceptions", title: "Exceptions and Non-Returnable Items" },
    { id: "damaged-items", title: "Damaged or Defective Items" },
    { id: "exchanges", title: "Exchanges" },
    { id: "cancellations", title: "Cancellations" },
    { id: "international-returns", title: "International Returns" },
    { id: "shipping-costs", title: "Return Shipping Costs" },
    { id: "refund-timeline", title: "Refund Timeline" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Refund Policy
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
                  At SOOUQNA, we want you to be completely satisfied with your
                  purchase. We understand that sometimes a product may not meet
                  your expectations or may not be exactly what you need. This
                  Refund Policy outlines our procedures for returns, refunds,
                  and exchanges to ensure a smooth and fair process for all our
                  customers.
                </p>
                <p className="text-muted-foreground">
                  Please read this policy carefully before making a purchase. By
                  placing an order on our Platform, you agree to the terms
                  outlined in this Refund Policy.
                </p>
              </section>

              {/* Return Eligibility */}
              <section id="return-eligibility" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Return Eligibility</h2>
                <p className="mb-4 text-muted-foreground">
                  To be eligible for a return, your item must meet the following
                  criteria:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    The item must be returned within 30 days of the delivery
                    date. Items returned after this period may not be accepted.
                  </li>
                  <li>
                    The item must be in its original condition, unused, unworn,
                    and with all tags and labels attached.
                  </li>
                  <li>
                    The item must be in its original packaging, which should be
                    intact and undamaged.
                  </li>
                  <li>
                    You must have proof of purchase, such as an order number or
                    receipt.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  Please note that certain items are not eligible for return due
                  to hygiene and safety reasons. See the &quot;Exceptions and
                  Non-Returnable Items&quot; section for more details.
                </p>
              </section>

              {/* Return Process */}
              <section id="return-process" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Return Process</h2>
                <p className="mb-4 text-muted-foreground">
                  To initiate a return, please follow these steps:
                </p>
                <ol className="ml-6 list-decimal space-y-4 text-muted-foreground">
                  <li>
                    <strong>Contact Customer Service:</strong> Reach out to our
                    customer service team through our Contact Us page, by email
                    at returns@soouqna.com, or by phone at +1 (555) 123-4567
                    within 30 days of receiving your order.
                  </li>
                  <li>
                    <strong>Provide Order Information:</strong> Include your
                    order number, the item(s) you wish to return, and the reason
                    for the return.
                  </li>
                  <li>
                    <strong>Receive Return Authorization:</strong> Our team will
                    review your request and, if approved, provide you with a
                    Return Merchandise Authorization (RMA) number and return
                    instructions.
                  </li>
                  <li>
                    <strong>Package the Item:</strong> Securely package the item
                    in its original packaging, including all accessories,
                    manuals, and free gifts that came with the product.
                  </li>
                  <li>
                    <strong>Attach Return Label:</strong> Print and attach the
                    return shipping label provided by our customer service team
                    (if applicable).
                  </li>
                  <li>
                    <strong>Ship the Item:</strong> Send the package to the
                    address provided in the return instructions. We recommend
                    using a trackable shipping method.
                  </li>
                </ol>
                <p className="mt-4 text-muted-foreground">
                  Once we receive your return, our team will inspect the item to
                  ensure it meets our return eligibility criteria. You will be
                  notified by email once your return has been processed.
                </p>
              </section>

              {/* Refund Process */}
              <section id="refund-process" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Refund Process</h2>
                <p className="mb-4 text-muted-foreground">
                  After your return is received and inspected, we will process
                  your refund according to the following guidelines:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Original Payment Method:</strong> Refunds will be
                    issued to the original payment method used for the purchase.
                  </li>
                  <li>
                    <strong>Refund Amount:</strong> The refund will include the
                    full purchase price of the returned item(s). Shipping
                    charges are non-refundable unless the return is due to our
                    error (wrong item shipped, defective product, etc.).
                  </li>
                  <li>
                    <strong>Store Credit:</strong> In some cases, we may offer
                    store credit instead of a refund to the original payment
                    method. This will be clearly communicated during the return
                    process.
                  </li>
                  <li>
                    <strong>Gift Returns:</strong> For items received as gifts,
                    refunds will be issued as store credit to the gift
                    recipient.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  You will receive an email notification when your refund has
                  been processed. Please see the &quot;Refund Timeline&quot;
                  section for information on when to expect your refund.
                </p>
              </section>

              {/* Exceptions and Non-Returnable Items */}
              <section id="exceptions" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Exceptions and Non-Returnable Items
                </h2>
                <p className="mb-4 text-muted-foreground">
                  The following items cannot be returned or refunded:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Personal Care Items:</strong> Products such as
                    cosmetics, perfumes, and personal hygiene items that have
                    been opened or used, due to health and safety regulations.
                  </li>
                  <li>
                    <strong>Intimate Apparel:</strong> Underwear, swimwear, and
                    other intimate items, unless they are defective or damaged
                    upon receipt.
                  </li>
                  <li>
                    <strong>Perishable Goods:</strong> Food items, flowers, and
                    other perishable products.
                  </li>
                  <li>
                    <strong>Custom-Made Products:</strong> Items that were
                    customized or personalized specifically for you.
                  </li>
                  <li>
                    <strong>Digital Products:</strong> Downloaded software,
                    e-books, digital content, or online services that have been
                    accessed or used.
                  </li>
                  <li>
                    <strong>Gift Cards:</strong> Prepaid cards or gift
                    certificates.
                  </li>
                  <li>
                    <strong>Clearance Items:</strong> Products marked as
                    &quot;Final Sale,&quot; &quot;Clearance,&quot; or &quot;As
                    Is.&quot;
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  If you have received any of these non-returnable items in a
                  damaged or defective condition, please contact our customer
                  service team within 48 hours of delivery.
                </p>
              </section>

              {/* Damaged or Defective Items */}
              <section id="damaged-items" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Damaged or Defective Items
                </h2>
                <p className="mb-4 text-muted-foreground">
                  If you receive an item that is damaged or defective, please
                  contact our customer service team within 48 hours of delivery.
                  Please provide:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>Your order number</li>
                  <li>A description of the damage or defect</li>
                  <li>Photos of the damaged or defective item</li>
                </ul>
                <p className="mb-4 mt-4 text-muted-foreground">
                  For damaged or defective items, we offer the following
                  solutions:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    Replacement of the same item (subject to availability)
                  </li>
                  <li>Full refund including any shipping charges</li>
                  <li>
                    Store credit for the full amount plus an additional 10% as a
                    goodwill gesture
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  We may request that you return the damaged or defective item
                  for inspection. In such cases, we will cover the return
                  shipping costs.
                </p>
              </section>

              {/* Exchanges */}
              <section id="exchanges" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Exchanges</h2>
                <p className="mb-4 text-muted-foreground">
                  If you would like to exchange an item for a different size,
                  color, or product, please follow these steps:
                </p>
                <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
                  <li>
                    Contact our customer service team to request an exchange
                    within 30 days of receiving your order.
                  </li>
                  <li>
                    Specify the item you wish to return and the item you would
                    like to receive instead.
                  </li>
                  <li>
                    Our team will check the availability of the requested item
                    and provide you with exchange instructions.
                  </li>
                </ol>
                <p className="mb-4 mt-4 text-muted-foreground">
                  Please note the following regarding exchanges:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    If the new item costs more than the original item, you will
                    need to pay the price difference.
                  </li>
                  <li>
                    If the new item costs less than the original item, we will
                    refund the difference to your original payment method.
                  </li>
                  <li>
                    Exchanges are subject to product availability. If the
                    requested item is out of stock, we will offer a refund or
                    store credit.
                  </li>
                  <li>
                    Only one exchange is permitted per order. Additional changes
                    will be processed as new purchases.
                  </li>
                </ul>
              </section>

              {/* Cancellations */}
              <section id="cancellations" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Cancellations</h2>
                <p className="mb-4 text-muted-foreground">
                  You may cancel an order under the following conditions:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Pre-Shipment Cancellations:</strong> Orders can be
                    cancelled at no charge if they have not yet been shipped. To
                    cancel an order, contact our customer service team as soon
                    as possible with your order number.
                  </li>
                  <li>
                    <strong>Post-Shipment Cancellations:</strong> Once an order
                    has been shipped, it cannot be cancelled. Instead, you will
                    need to receive the item and follow our return process.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  For pre-shipment cancellations, refunds will be processed to
                  the original payment method within 3-5 business days.
                </p>
              </section>

              {/* International Returns */}
              <section id="international-returns" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  International Returns
                </h2>
                <p className="mb-4 text-muted-foreground">
                  For customers outside of [Country], our return policy applies
                  with the following additional considerations:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    The return window remains 30 days, but we understand that
                    international shipping may take longer. Please contact us as
                    soon as possible if you wish to initiate a return.
                  </li>
                  <li>
                    You are responsible for any customs duties, taxes, or fees
                    incurred during the return shipping process.
                  </li>
                  <li>
                    International returns should be sent with a trackable
                    shipping method that provides proof of delivery.
                  </li>
                  <li>
                    Please mark the package as &quot;Returned Merchandise&quot;
                    to avoid additional customs charges.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  Due to the complexity of international returns, processing
                  times may be longer than for domestic returns. We appreciate
                  your patience.
                </p>
              </section>

              {/* Return Shipping Costs */}
              <section id="shipping-costs" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  Return Shipping Costs
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Our policy regarding return shipping costs is as follows:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Customer&apos;s Responsibility:</strong> In most
                    cases, the customer is responsible for return shipping
                    costs. We recommend using a trackable shipping method to
                    ensure the package reaches our returns department.
                  </li>
                  <li>
                    <strong>SOOUQNA&apos;s Responsibility:</strong> We will
                    cover return shipping costs if the return is due to our
                    error (wrong item shipped, defective product, etc.). In such
                    cases, we will provide a prepaid return shipping label.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  Original shipping charges are non-refundable unless the return
                  is due to our error.
                </p>
              </section>

              {/* Refund Timeline */}
              <section id="refund-timeline" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Refund Timeline</h2>
                <p className="mb-4 text-muted-foreground">
                  Once your return is received and inspected, you can expect the
                  following timeline for your refund:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>
                    <strong>Processing Time:</strong> We will process your
                    return within 3-5 business days of receiving the item.
                  </li>
                  <li>
                    <strong>Credit Card Refunds:</strong> Refunds to credit
                    cards typically appear on your statement within 5-10
                    business days after processing, depending on your credit
                    card company.
                  </li>
                  <li>
                    <strong>Debit Card Refunds:</strong> Refunds to debit cards
                    typically appear in your account within 5-7 business days
                    after processing.
                  </li>
                  <li>
                    <strong>PayPal Refunds:</strong> Refunds to PayPal accounts
                    are usually processed within 1-2 business days.
                  </li>
                  <li>
                    <strong>Store Credit:</strong> Store credit is issued
                    immediately after your return is approved and will be sent
                    to your email address.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  If you haven&apos;t received your refund within the expected
                  timeframe, please check your bank account or credit card
                  statement first, then contact our customer service team for
                  assistance.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                <p className="mb-4 text-muted-foreground">
                  If you have any questions or concerns about our Refund Policy,
                  please contact our customer service team:
                </p>
                <div className="text-muted-foreground">
                  <p>SOOUQNA Customer Support</p>
                  <p>Email: returns@soouqna.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Hours: Monday-Friday, 9:00 AM - 6:00 PM (Local Time)</p>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Our team is committed to resolving any issues promptly and
                  ensuring your satisfaction with our products and services.
                </p>
              </section>

              {/* Acceptance Section */}
              <section className="mt-12 rounded-lg border p-6">
                <div className="text-center">
                  <h2 className="mb-4 text-xl font-bold">
                    Acceptance of Refund Policy
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    By placing an order on the SOOUQNA Platform, you acknowledge
                    that you have read, understood, and agree to be bound by
                    this Refund Policy.
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
