// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import Breadcrumb from "@/components/Breadcrumb";
// import {
//   ShoppingBag,
//   Users,
//   BarChart3,
//   ShieldCheck,
//   LifeBuoy,
//   Store,
// } from "lucide-react";

// export default function AboutPage() {
//   return (
//     <>
//       <Breadcrumb
//         paths={[
//           {
//             label: "About Us",
//             href: "/",
//           },
//         ]}
//       />

//       {/* ─────────────────────  HERO  ───────────────────── */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-24 text-center">
//         <div className="container relative z-10 mx-auto px-4 md:max-w-4xl">
//           <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
//             About Us – SOOUQNA
//           </h1>
//           <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
//             SOOUQNA was founded in 2020 with an ambitious vision that blends
//             tradition with innovation: to build a modern e‑commerce marketplace
//             connecting shoppers worldwide with carefully selected, reliable
//             products.
//           </p>
//           <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
//             Our name is inspired by the Arabic word <em>Souq</em> (market),
//             reflecting our cultural roots and our passion for merging
//             traditional commerce with a forward‑thinking digital spirit.
//           </p>
//         </div>

//         {/* decorative blurred blob */}
//         <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20)_0%,transparent_70%)]" />
//       </section>

//       <div className="container mx-auto px-4">
//         {/* ─────────────────────  STORY  ───────────────────── */}
//         <section className="my-24 grid gap-12 md:grid-cols-2 md:items-center">
//           <div>
//             <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
//             <p className="mb-6 text-muted-foreground">
//               What began as a small project with humble steps quickly evolved
//               into a comprehensive platform that attracts thousands of visitors
//               each month and serves a growing community of sellers and buyers.
//               We work every day to elevate the shopping experience and give
//               every vendor an equal opportunity to grow—regardless of their size
//               or background.
//             </p>
//           </div>

//           {/* illustrative image */}
//           <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-lg md:order-last md:max-w-none">
//             <Image
//               src="/images/about-hero.jpg" // replace with your asset
//               width={700}
//               height={460}
//               alt="Team working together"
//               className="h-full w-full object-cover"
//             />
//           </div>
//         </section>

//         {/* ─────────────────────  MISSION & VISION  ───────────────────── */}
//         <section className="my-24 grid gap-8 md:grid-cols-2">
//           <div className="rounded-lg border p-8 shadow-sm">
//             <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
//             <p className="text-muted-foreground">
//               We believe commerce should be transparent, fair, and built on
//               mutual trust. Our mission is to empower entrepreneurs and vendors
//               to reach customers easily while giving shoppers a safe, enjoyable
//               experience curated with care.
//             </p>
//           </div>
//           <div className="rounded-lg border p-8 shadow-sm">
//             <h2 className="mb-4 text-3xl font-bold">Our Vision</h2>
//             <p className="text-muted-foreground">
//               To become the leading e‑commerce marketplace in the region and the
//               Arab world — the first place individuals and businesses think of
//               when buying or selling online.
//             </p>
//           </div>
//         </section>

//         {/* ─────────────────────  DIFFERENTIATORS  ───────────────────── */}
//         <section className="my-24 rounded-lg bg-muted px-6 py-16 text-center">
//           <h2 className="mb-12 text-3xl font-bold">What Makes Us Different?</h2>
//           <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
//             <Feature
//               icon={<Store className="h-8 w-8 text-primary" />}
//               text="A simple and user‑friendly interface for all age groups"
//             />
//             <Feature
//               icon={<LifeBuoy className="h-8 w-8 text-primary" />}
//               text="24/7 technical support and business consultations"
//             />
//             <Feature
//               icon={<BarChart3 className="h-8 w-8 text-primary" />}
//               text="Analytics & performance tracking tools for vendors"
//             />
//             <Feature
//               icon={<ShoppingBag className="h-8 w-8 text-primary" />}
//               text="Commission‑free environment with no monthly fees"
//             />
//             <Feature
//               icon={<ShieldCheck className="h-8 w-8 text-primary" />}
//               text="Strict commitment to quality & transparency"
//             />
//             <Feature
//               icon={<Users className="h-8 w-8 text-primary" />}
//               text="A community built on trust and diversity"
//             />
//           </div>
//         </section>

//         {/* ─────────────────────  CTA  ───────────────────── */}
//         <section className="my-32 text-center">
//           <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
//             At SOOUQNA, we don’t just sell products — we build a thriving
//             digital community that grows through collaboration, expands through
//             trust, and flourishes through diversity.
//           </p>
//           <p className="mx-auto mt-4 max-w-3xl text-lg font-semibold text-muted-foreground">
//             Whether you’re a buyer searching for great deals or a seller eager
//             to reach a wider audience, SOOUQNA is your ideal platform.
//           </p>
//           <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <Link
//               href="/shop"
//               className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition hover:shadow-lg"
//             >
//               Start Shopping
//             </Link>
//             <Link
//               href="/become-vendor"
//               className="inline-flex items-center rounded-md border px-6 py-3 text-sm font-medium text-primary shadow transition hover:bg-primary/10 hover:shadow-lg"
//             >
//               Become a Vendor
//             </Link>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }

// /* ───────────────────────── helpers ───────────────────────── */
// const Feature = ({ icon, text }) => (
//   <div className="flex flex-col items-center gap-4 px-4 text-center">
//     <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//       {icon}
//     </div>
//     <p className="text-sm font-medium text-muted-foreground">{text}</p>
//   </div>
// );

"use client";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  ShoppingBag,
  Users,
  BarChart3,
  ShieldCheck,
  LifeBuoy,
  Store,
} from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumb
        paths={[{ label: t("about.breadcrumb"), href: "/" }]} // "About Us"
      />

      {/* ─────────────────────  HERO  ───────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-24 text-center">
        <div className="container relative z-10 mx-auto px-4 md:max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {t("about.heroTitle")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("about.heroP1")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("about.heroP2")}
          </p>
        </div>

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20)_0%,transparent_70%)]" />
      </section>

      <div className="container mx-auto px-4">
        {/* ─────────────────────  STORY  ───────────────────── */}
        <section className="my-24 grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              {t("about.ourStoryTitle")}
            </h2>
            <p className="mb-6 text-muted-foreground">{t("about.storyP1")}</p>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-lg md:order-last md:max-w-none">
            <Image
              src="/about-hero.png"
              width={700}
              height={460}
              alt={t("about.heroImgAlt")}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* ─────────────────────  MISSION & VISION  ───────────────────── */}
        <section className="my-24 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">
              {t("about.missionTitle")}
            </h2>
            <p className="text-muted-foreground">{t("about.missionText")}</p>
          </div>
          <div className="rounded-lg border p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">
              {t("about.visionTitle")}
            </h2>
            <p className="text-muted-foreground">{t("about.visionText")}</p>
          </div>
        </section>

        {/* ─────────────────────  DIFFERENTIATORS  ───────────────────── */}
        <section className="my-24 rounded-lg bg-muted px-6 py-16 text-center">
          <h2 className="mb-12 text-3xl font-bold">
            {t("about.differentTitle")}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Store className="h-8 w-8 text-primary" />}
              text={t("about.diff1")}
            />
            <Feature
              icon={<LifeBuoy className="h-8 w-8 text-primary" />}
              text={t("about.diff2")}
            />
            <Feature
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              text={t("about.diff3")}
            />
            <Feature
              icon={<ShoppingBag className="h-8 w-8 text-primary" />}
              text={t("about.diff4")}
            />
            <Feature
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              text={t("about.diff5")}
            />
            <Feature
              icon={<Users className="h-8 w-8 text-primary" />}
              text={t("about.diff6")}
            />
          </div>
        </section>

        {/* ─────────────────────  CTA  ───────────────────── */}
        <section className="my-32 text-center">
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {t("about.ctaP1")}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-lg font-semibold text-muted-foreground">
            {t("about.ctaP2")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition hover:shadow-lg"
            >
              {t("about.ctaShop")}
            </Link>
            <Link
              href="https://seller.soouqna.com"
              className="inline-flex items-center rounded-md border px-6 py-3 text-sm font-medium text-primary shadow transition hover:bg-primary/10 hover:shadow-lg"
            >
              {t("about.ctaVendor")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

const Feature = ({ icon, text }) => (
  <div className="flex flex-col items-center gap-4 px-4 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
      {icon}
    </div>
    <p className="text-sm font-medium text-muted-foreground">{text}</p>
  </div>
);
