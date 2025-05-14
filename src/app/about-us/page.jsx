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

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          About SOOUQNA
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
          Your trusted destination for quality products and exceptional shopping
          experiences.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
          <p className="mb-4 text-muted-foreground">
            SOOUQNA was founded in 2020 with a simple mission: to create an
            online marketplace that connects customers with high-quality
            products from around the world. Our name, inspired by the Arabic
            word &quot;souq&quot; (market), reflects our commitment to building
            a vibrant digital marketplace.
          </p>
          <p className="text-muted-foreground">
            What started as a small operation has grown into a trusted
            e-commerce platform serving thousands of customers. Throughout our
            journey, we&apos;ve remained dedicated to our core values of
            quality, transparency, and customer satisfaction.
          </p>
        </div>
        <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[400px]">
          <Image
            src="/placeholder.svg"
            alt="SOOUQNA store"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="mb-16 bg-muted py-12 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Our Mission & Values
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Products</h3>
              <p className="text-muted-foreground">
                We carefully curate our selection to ensure every product meets
                our high standards of quality and value.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We&apos;re committed to
                providing exceptional service at every step of your journey.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Community Impact</h3>
              <p className="text-muted-foreground">
                We believe in giving back to the communities we serve through
                sustainable practices and charitable initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
