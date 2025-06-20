"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

export default function ContactPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    whatsapp: "",
    hours1: "",
    hours2: "",
    hours3: "",
  });

  useEffect(() => {
    try {
      const raw = Cookies.get("siteSettings");
      if (raw) {
        const data = JSON.parse(raw);
        setSettings({
          phone: data.contactNo || "+1 (555) 123-4567",
          email: data.email || "contact@soouqna.com",
          addressLine1: data.addressLine1 || "123 Commerce Street",
          addressLine2: data.addressLine2 || "Business District",
          addressLine3: data.addressLine3 || "City, Country",
          whatsapp: data.whatsapp || "15551234567",
          hours1: data.hours1 || "Monday – Friday 9:00 AM – 6:00 PM",
          hours2: data.hours2 || "Saturday 10:00 AM – 4:00 PM",
          hours3: data.hours3 || "Sunday Closed",
        });
      }
    } catch (err) {
      console.error("Failed to parse siteSettings cookie", err);
    }
  }, []);

  return (
    <>
      {/* ────────── Hero ────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-24 text-center">
        <div className="container relative z-10 mx-auto px-4 md:max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {t("contact.heroTitle")}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl">
            {t("contact.heroSubtitle")}
          </p>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20)_0%,transparent_70%)]" />
      </section>

      {/* ────────── Quick Contact Cards ────────── */}
      <div className="container mx-auto -mt-20 px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <InfoCard
            icon={<Phone className="h-8 w-8 text-primary" />}
            title={t("contact.callUs")}
            text={settings.phone}
          />
          <InfoCard
            icon={<Mail className="h-8 w-8 text-primary" />}
            title={t("contact.email")}
            text={settings.email}
          />
          <InfoCard
            icon={<MessageCircle className="h-8 w-8 text-primary" />}
            title={t("contact.liveChat")}
            text={t("contact.liveChatText")}
          />
        </div>

        {/* ────────── Details & CTA ────────── */}
        <div className="mt-16 rounded-xl border bg-background p-10 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Address & Hours */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{t("contact.hqHeading")}</h2>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="text-muted-foreground">
                  {settings.addressLine1}
                  <br />
                  {settings.addressLine2}
                  <br />
                  {settings.addressLine3}
                </p>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary" />
                <p className="text-muted-foreground">
                  {settings.hours1}
                  <br />
                  {settings.hours2}
                  <br />
                  {settings.hours3}
                </p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="rounded-lg bg-muted p-8 text-center">
              <h3 className="mb-4 text-2xl font-semibold">
                {t("contact.needHelp")}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t("contact.needHelpText")}
              </p>
              <a
                href={`https://wa.me/${settings.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition hover:shadow-lg"
              >
                {t("contact.whatsappBtn")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border bg-background p-8 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
