"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const lastUpdated = "May 15, 2025";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          {t("privacy.title")}
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          {t("privacy.lastUpdated")}: {lastUpdated}
        </p>
      </section>

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold">{t("privacy.toc")}</h2>
                <nav className="space-y-2 text-sm">
                  <div className="line-clamp-1">
                    <a
                      href="#introduction"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.introHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#information-collected"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.collectHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#information-use"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.useHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#information-sharing"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.shareHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#cookies"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.cookiesHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#data-security"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.securityHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#your-rights"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.rightsHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#childrens-privacy"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.childrenHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#international-transfers"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.intlHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#policy-changes"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.changesHeading")}
                    </a>
                  </div>
                  <div className="line-clamp-1">
                    <a
                      href="#gdpr"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.gdprHeading")}
                    </a>
                  </div>
                  {/* <div className="line-clamp-1">
                    <a
                      href="#california-rights"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.caHeading")}
                    </a>
                  </div> */}
                  <div className="line-clamp-1">
                    <a
                      href="#contact"
                      className="inline-flex items-center text-muted-foreground hover:text-foreground hover:underline"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t("privacy.contactHeading")}
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
                  {t("privacy.introHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.introP1")}
                </p>
                <p className="text-muted-foreground">{t("privacy.introP2")}</p>
              </section>

              {/* Information We Collect */}
              <section id="information-collected" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.collectHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.collectP1")}
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.personal")}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.personalP")}
                </p>
                <ul className="ml-6 mb-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.li1")}</li>
                  <li>{t("privacy.li2")}</li>
                  <li>{t("privacy.li3")}</li>
                  <li>{t("privacy.li4")}</li>
                  <li>{t("privacy.li5")}</li>
                  <li>{t("privacy.li6")}</li>
                </ul>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.nonPersonal")}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.nonPersonalP")}
                </p>
                <ul className="ml-6 mb-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.nli1")}</li>
                  <li>{t("privacy.nli2")}</li>
                  <li>{t("privacy.nli3")}</li>
                  <li>{t("privacy.nli4")}</li>
                  <li>{t("privacy.nli5")}</li>
                  <li>{t("privacy.nli6")}</li>
                </ul>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.methods")}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.methodsP")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.m1")}</li>
                  <li>{t("privacy.m2")}</li>
                  <li>{t("privacy.m3")}</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section id="information-use" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.useHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.useP1")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.use1")}</li>
                  <li>{t("privacy.use2")}</li>
                  <li>{t("privacy.use3")}</li>
                  <li>{t("privacy.use4")}</li>
                  <li>{t("privacy.use5")}</li>
                  <li>{t("privacy.use6")}</li>
                  <li>{t("privacy.use7")}</li>
                </ul>
              </section>

              {/* Information Sharing and Disclosure */}
              <section id="information-sharing" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.shareHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.shareP1")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.share1")}</li>
                  <li>{t("privacy.share2")}</li>
                  <li>{t("privacy.share3")}</li>
                  <li>{t("privacy.share4")}</li>
                  <li>{t("privacy.share5")}</li>
                  <li>{t("privacy.share6")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("privacy.shareNote")}
                </p>
              </section>

              {/* Cookies and Tracking Technologies */}
              <section id="cookies" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.cookiesHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.cookiesP1")}
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.cookieTypes")}
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.ct1")}</li>
                  <li>{t("privacy.ct2")}</li>
                  <li>{t("privacy.ct3")}</li>
                  <li>{t("privacy.ct4")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("privacy.cookiesP2")}
                </p>
              </section>

              {/* Data Security */}
              <section id="data-security" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.securityHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.securityP1")}
                </p>
                <p className="text-muted-foreground">
                  {t("privacy.securityP2")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.sec1")}</li>
                  <li>{t("privacy.sec2")}</li>
                  <li>{t("privacy.sec3")}</li>
                  <li>{t("privacy.sec4")}</li>
                  <li>{t("privacy.sec5")}</li>
                </ul>
              </section>

              {/* Your Rights and Choices */}
              <section id="your-rights" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.rightsHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.rightsP1")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.r1")}</li>
                  <li>{t("privacy.r2")}</li>
                  <li>{t("privacy.r3")}</li>
                  <li>{t("privacy.r4")}</li>
                  <li>{t("privacy.r5")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("privacy.rightsNote")}
                </p>
                <h3 className="mb-2 mt-6 text-xl font-semibold">
                  {t("privacy.marketingHeading")}
                </h3>
                <p className="text-muted-foreground">
                  {t("privacy.marketingP")}
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="childrens-privacy" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.childrenHeading")}
                </h2>
                <p className="text-muted-foreground">
                  {t("privacy.childrenP")}
                </p>
              </section>

              {/* International Data Transfers */}
              <section id="international-transfers" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.intlHeading")}
                </h2>
                <p className="text-muted-foreground">{t("privacy.intlP")}</p>
              </section>

              {/* Changes to This Privacy Policy */}
              <section id="policy-changes" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.changesHeading")}
                </h2>
                <p className="text-muted-foreground">{t("privacy.changesP")}</p>
              </section>

              {/* GDPR Compliance */}
              <section id="gdpr" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.gdprHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.gdprP1")}
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.gdprLegalHeading")}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.gdprLegalP")}
                </p>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.g1")}</li>
                  <li>{t("privacy.g2")}</li>
                  <li>{t("privacy.g3")}</li>
                  <li>{t("privacy.g4")}</li>
                </ul>
                <h3 className="mb-2 mt-6 text-xl font-semibold">
                  {t("privacy.gdprDPOHeading")}
                </h3>
                <p className="text-muted-foreground">{t("privacy.gdprDPOP")}</p>
              </section>

              {/* California Privacy Rights */}
              {/* <section id="california-rights" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.caHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.caP1")}
                </p>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("privacy.caRightsHeading")}
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>{t("privacy.c1")}</li>
                  <li>{t("privacy.c2")}</li>
                  <li>{t("privacy.c3")}</li>
                  <li>{t("privacy.c4")}</li>
                  <li>{t("privacy.c5")}</li>
                  <li>{t("privacy.c6")}</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  {t("privacy.caNote")}
                </p>
              </section> */}

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="mb-4 text-2xl font-bold">
                  {t("privacy.contactHeading")}
                </h2>
                <p className="mb-4 text-muted-foreground">
                  {t("privacy.contactP1")}
                </p>
                <div className="text-muted-foreground space-y-1">
                  <p>{t("privacy.contactName")}</p>
                  <p>{t("privacy.contactEmail")}</p>
                  <p>{t("privacy.contactPhone")}</p>
                  <p>{t("privacy.contactAddress")}</p>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {t("privacy.contactP2")}
                </p>
              </section>

              {/* Acceptance Section */}
              <section className="mt-12 rounded-lg border p-6">
                <div className="text-center">
                  <h2 className="mb-4 text-xl font-bold">
                    {t("privacy.accept")}
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    {t("privacy.acceptP")}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {t("privacy.returnHome")}
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
