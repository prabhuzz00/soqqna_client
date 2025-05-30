"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "About Us",
            href: `/`,
          },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t("about.title")}
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
            {t("about.description")}
          </p>
        </section>

        {/* Our Story Section */}
        <section className="mb-16 grid gap-8 md:grid-cols-1 md:items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              {t("about.ourStoryTitle")}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {t("about.ourStoryP1")}
            </p>
            <p className="text-muted-foreground">{t("about.ourStoryP2")}</p>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mb-16 bg-muted py-12 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              {t("about.missionTitle")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("about.qualityTitle")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.qualityText")}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("about.customerTitle")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.customerText")}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {t("about.communityTitle")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.communityText")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;

{
  /* <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[400px]">
          <Image
            src="/placeholder.svg"
            alt="SOOUQNA store"
            fill
            className="object-cover"
            priority
          />
        </div> */
}
