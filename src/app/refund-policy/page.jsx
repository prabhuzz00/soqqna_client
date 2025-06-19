"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

export default function RefundPolicyPage() {
  const { t } = useTranslation();
  const lastUpdated = "June 20, 2025";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          {t("refund.title")}
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          {t("refund.lastUpdatedPrefix")} {lastUpdated}
        </p>
      </section>

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold">
                  {t("refund.TableContents" ?? "Table of Contents")}
                </h2>
                <nav className="space-y-2 text-sm">
                  <div className="line-clamp-1">
                    <a
                      href="#introduction"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.introHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#return-eligibility-conditions"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.eligibilityHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#return-steps"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.stepsHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#refund-process"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.refundHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#exceptions"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.exceptionsHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#damaged-products"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.damagedHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#exchanges"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.exchangeHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#order-cancellation"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.cancelHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#international-returns"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.intlHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#return-shipping-costs"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.shippingHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#refund-timeline"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.timelineHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#contact"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("refund.contactHeading")}
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-10">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.introHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.introP1")}
                </p>
                <p className="text-muted-foreground">{t("refund.introP2")}</p>
              </section>

              {/* Return Eligibility Conditions */}
              <section
                id="return-eligibility-conditions"
                className="scroll-mt-20"
              >
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.eligibilityHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.eligibilityDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.eligibility1")}</li>
                  <li>{t("refund.eligibility2")}</li>
                  <li>{t("refund.eligibility3")}</li>
                  <li>{t("refund.eligibility4")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("refund.eligibilityNote")}
                </p>
              </section>

              {/* Return Steps */}
              <section id="return-steps" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.stepsHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.stepsDesc")}
                </p>
                <ol className="ml-6 list-decimal space-y-4 text-muted-foreground">
                  <li>{t("refund.step1")}</li>
                  <li>{t("refund.step2")}</li>
                  <li>{t("refund.step3")}</li>
                  <li>{t("refund.step4")}</li>
                  <li>{t("refund.step5")}</li>
                  <li>{t("refund.step6")}</li>
                </ol>
                <p className="mt-4 text-muted-foreground">
                  {t("refund.stepsNote")}
                </p>
              </section>

              {/* Refund Process */}
              <section id="refund-process" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.refundHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.refundDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.refund1")}</li>
                  <li>{t("refund.refund2")}</li>
                  <li>{t("refund.refund3")}</li>
                  <li>{t("refund.refund4")}</li>
                </ul>
              </section>

              {/* Exceptions */}
              <section id="exceptions" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.exceptionsHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.exceptionsDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.exception1")}</li>
                  <li>{t("refund.exception2")}</li>
                  <li>{t("refund.exception3")}</li>
                  <li>{t("refund.exception4")}</li>
                  <li>{t("refund.exception5")}</li>
                  <li>{t("refund.exception6")}</li>
                  <li>{t("refund.exception7")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("refund.exceptionsNote")}
                </p>
              </section>

              {/* Damaged Products */}
              <section id="damaged-products" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.damagedHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.damagedDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.damagedInfo1")}</li>
                  <li>{t("refund.damagedInfo2")}</li>
                  <li>{t("refund.damagedInfo3")}</li>
                </ul>
                <p className="mb-4 mt-4 text-muted-foreground">
                  {t("refund.damagedSolutionsHeading")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.damagedSolution1")}</li>
                  <li>{t("refund.damagedSolution2")}</li>
                  <li>{t("refund.damagedSolution3")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("refund.damagedNote")}
                </p>
              </section>

              {/* Exchanges */}
              <section id="exchanges" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.exchangeHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.exchangeDesc")}
                </p>
                <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
                  <li>{t("refund.exchangeStep1")}</li>
                  <li>{t("refund.exchangeStep2")}</li>
                  <li>{t("refund.exchangeStep3")}</li>
                </ol>
                <p className="mb-4 mt-4 text-muted-foreground">
                  {t("refund.exchangeHeading")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.exchangeNote1")}</li>
                  <li>{t("refund.exchangeNote2")}</li>
                  <li>{t("refund.exchangeNote3")}</li>
                  <li>{t("refund.exchangeNote4")}</li>
                </ul>
              </section>

              {/* Order Cancellation */}
              <section id="order-cancellation" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.cancelHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.cancelDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.cancel1")}</li>
                  <li>{t("refund.cancel2")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("refund.cancelNote")}
                </p>
              </section>

              {/* International Returns */}
              <section id="international-returns" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.intlHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.intlDesc")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.intl1")}</li>
                  <li>{t("refund.intl2")}</li>
                  <li>{t("refund.intl3")}</li>
                  <li>{t("refund.intl4")}</li>
                </ul>
              </section>

              {/* Return Shipping Costs */}
              <section id="return-shipping-costs" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.shippingHeading")}
                </h2>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.shipping1")}</li>
                  <li>{t("refund.shipping2")}</li>
                  <li>{t("refund.shipping3")}</li>
                </ul>
              </section>

              {/* Refund Timeline */}
              <section id="refund-timeline" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.timelineHeading")}
                </h2>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("refund.timeline1")}</li>
                  <li>{t("refund.timeline2")}</li>
                  <li>{t("refund.timeline3")}</li>
                  <li>{t("refund.timeline4")}</li>
                  <li>{t("refund.timeline5")}</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("refund.contactHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("refund.contactDesc")}
                </p>
                <div className="text-muted-foreground space-y-1">
                  <p>{t("refund.contactTeam")}</p>
                  <p>{t("refund.contactEmail")}</p>
                  <p>{t("refund.contactPhone")}</p>
                  <p>{t("refund.contactHours")}</p>
                </div>
              </section>

              {/* Acceptance Section */}
              <section className="mt-12 rounded-lg border p-6">
                <div className="text-center">
                  <h2 className="mb-4 text-xl font-bold">
                    {t("refund.acceptanceHeading")}
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    {t("refund.acceptanceDesc")}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {t("refund.returnHome")}
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
