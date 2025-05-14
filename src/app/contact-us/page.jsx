"use client";
import { useRouter } from "next/navigation";
// import ContactForm from "./contact-form";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

const ContactPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
          We&apos;re here to help! Reach out to our team with any questions,
          feedback, or support needs.
        </p>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Contact Information */}
        <section className="space-y-8">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Get In Touch</h2>
            <p className="text-muted-foreground">
              Our customer support team is available to assist you with any
              questions or concerns about our products and services.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">
                  contact@soouqna.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-sm text-muted-foreground">
                  123 Commerce Street
                  <br />
                  Business District
                  <br />
                  City, Country
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9AM - 6PM
                  <br />
                  Saturday: 10AM - 4PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">Our Location</h3>
            <div className="h-[300px] overflow-hidden rounded-lg bg-muted">
              {/* Placeholder for map - in a real implementation, you would integrate Google Maps or similar */}
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Map placeholder - integrate with Google Maps or similar
                    service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
            {/* <ContactForm /> */}
          </div>
        </section>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-4xl space-y-6">
          {[
            {
              question: "What are your shipping options?",
              answer:
                "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and international shipping (7-14 business days). Shipping costs vary based on location and order size.",
            },
            {
              question: "How can I track my order?",
              answer:
                "Once your order ships, you&apos;ll receive a tracking number via email. You can use this number to track your package on our website or through the carrier&apos;s tracking system.",
            },
            {
              question: "What is your return policy?",
              answer:
                "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Please contact our customer service team to initiate a return.",
            },
            {
              question: "Do you offer international shipping?",
              answer:
                "Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days, and customs fees may apply depending on your location.",
            },
          ].map((faq, index) => (
            <div key={index} className="rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
