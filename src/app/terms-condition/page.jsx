"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";

export default function TermsPage() {
  const { t } = useTranslation();
  // Last updated date
  const lastUpdated = "May 15, 2025";

  // Table of contents items
  const tableOfContents = [
    { id: "Electronic", title: t("terms.electronicTitle") },
    { id: "Recommendations", title: t("terms.RecommendationsTitle") },
    {
      id: "Database-Rights",
      title: t("terms.DatabaseRightsTitle"),
    },
    { id: "Trademarks", title: t("terms.TrademarksTitle") },
    { id: "Licensing-Access", title: t("terms.LicensingAccessTitle") },
    { id: "Account", title: t("terms.AccountTitle") },
    { id: "Reviews", title: t("terms.ReviewsTitle") },
    { id: "intellectual-property", title: t("terms.intellectualTitle") },
    { id: "Other-Businesses", title: t("terms.BusinessesTitle") },
    { id: "role", title: t("terms.roleTitle") },
    { id: "Our-Responsibility", title: t("terms.ResponsibilityTitle") },
    { id: "Disclaimer", title: t("terms.DisclaimerTitle") },
    { id: "Children", title: t("terms.ChildrenTitle") },
    { id: "Product-Information", title: t("terms.ProductInfoTitle") },
    { id: "Customs", title: t("terms.CustomsTitle") },
    { id: "Return-Policy", title: t("terms.ReturnTitle") },
  ];

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "Terms and Condition",
            href: `/`,
          },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            {t("terms.termsConditionsTitle")}
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
                  <h2 className="mb-4 font-semibold">
                    {t("terms.TableContents")}
                  </h2>
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
                <section className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.welcomeTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.welcomep1")}
                  </p>
                </section>

                {/* Introduction */}
                <section className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.TermsofUse")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.termofusep1")}
                  </p>
                </section>

                {/* Electronic Correspondence */}
                <section id="Electronic" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.electronicTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.electronicp1")}
                  </p>
                </section>

                {/* Recommendations and Customization */}
                <section id="Recommendations" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.RecommendationsTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.recommendationsp1")}
                  </p>
                </section>

                {/* Database-Rights */}
                <section id="Database-Rights" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.DatabaseRightsTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.databaseRightsp1")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.databaseRightsp2")}
                  </p>
                </section>

                {/* Trademarks */}
                <section id="Trademarks" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.TrademarksTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.trademarksp1")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.trademarksp2")}
                  </p>
                </section>

                {/* Licensing-Access*/}
                <section id="Licensing-Access" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.LicensingAccessTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.licensingAccessp1")}
                  </p>
                </section>

                {/* Account */}
                <section id="Account" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.AccountTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.accountp1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.accountp2")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.accountp3")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.accountp4")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.accountp5")}
                  </p>
                </section>

                {/* Returns and Refunds */}
                <section id="Reviews" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.ReviewsTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.reviewsp1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.reviewsp2")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.reviewsp3")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.reviewsp4")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.reviewsp5")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.reviewsp6")}
                  </p>
                </section>

                {/* Intellectual Property */}
                <section id="intellectual-property" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.intellectualTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.intellectualp1")}
                  </p>
                </section>

                {/* Other-Businesses */}
                <section id="Other-Businesses" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.BusinessesTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.businessp1")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.businessp2")}
                  </p>
                </section>

                {/* role */}
                <section id="role" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.roleTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.rolep1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.rolep2")}
                  </p>
                  <p className="text-muted-foreground">{t("terms.rolep3")}</p>
                </section>

                {/* Our-Responsibility */}
                <section id="Our-Responsibility" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.ResponsibilityTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.responsibilityp1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.responsibilityp2")}
                  </p>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    <li>{t("terms.responsibilityLi1")}</li>
                    <li>{t("terms.responsibilityLi2")}</li>
                    <li>{t("terms.responsibilityLi3")}</li>
                  </ul>
                  <p className="text-muted-foreground">
                    {t("terms.responsibilityp3")}
                  </p>
                </section>

                {/* Disclaimer */}
                <section id="Disclaimer" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.DisclaimerTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.disclaimerp1")}
                  </p>
                </section>

                {/* Children */}
                <section id="Children" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.ChildrenTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("terms.childrenp1")}
                  </p>
                </section>

                {/* Product-Information */}
                <section id="Product-Information" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.ProductInfoTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.productInfop1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.productInfop2")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.productInfop3")}
                  </p>
                </section>

                {/* Customs */}
                <section id="Customs" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.CustomsTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.customsP1")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("terms.customsP2")}
                  </p>
                </section>

                {/* Return-Policy */}
                <section id="Return-Policy" className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.ReturnTitle")}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.returnp1")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.returnp2")}
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    {t("terms.returnp3")}
                  </p>
                  <p className="text-muted-foreground">{t("terms.returnp4")}</p>
                </section>

                {/* additional terms */}
                <section className="scroll-mt-20">
                  <h2 className="mb-4 text-2xl font-bold">
                    {t("terms.additionalTitle")}
                  </h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    <li>{t("terms.additionalLi1")}</li>
                    <li>{t("terms.additionalLi2")}</li>
                    <li>{t("terms.additionalLi3")}</li>
                  </ul>
                </section>

                {/* Acceptance Section */}
                <section className="mt-12 rounded-lg border p-6">
                  <div className="text-center">
                    <h2 className="mb-4 text-xl font-bold">
                      {t("terms.acceptanceTitle")}
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                      {t("terms.acceptanceP1")}
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      {t("terms.returnto")}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
