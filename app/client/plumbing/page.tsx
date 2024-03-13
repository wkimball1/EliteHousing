import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import background from "@/img/plumbing-hero.jpg";
import Link from "next/link";

const tableData = [
  {
    id: 1,
    companyName: "Kohler Kitchen Faucets",
    productType: "Plumbing",
    website: "www.us.kohler.com",
  },
  {
    id: 2,
    companyName: "Grohe Kitchen Faucets",
    productType: "Plumbing",
    website: "www.grohe.us",
  },
  {
    id: 3,
    companyName: "American Standard Kitchen Faucets",
    productType: "Plumbing",
    website: "www.americanstandard-us.com",
  },
  {
    id: 4,
    companyName: "BlaNCo Kitchen Faucets",
    productType: "Plumbing",
    website: "www.blanco.com/us-en/",
  },
  {
    id: 5,
    companyName: "Delta Faucets",
    productType: "Plumbing",
    website: "www.deltafaucet.com",
  },
  {
    id: 6,
    companyName: "Price Pfister Faucets",
    productType: "Plumbing",
    website: "www.pricepfister.com",
  },
  {
    id: 7,
    companyName: "Newport Kitchen Faucets",
    productType: "Plumbing",
    website: "www.newportbrass.com",
  },
  {
    id: 8,
    companyName: "Elkay Kitchen Faucets",
    productType: "Plumbing",
    website: "www.elkay.com",
  },
  {
    id: 9,
    companyName: "Herbeau Kitchen Faucets",
    productType: "Plumbing",
    website: "www.herbeau.com",
  },
  {
    id: 10,
    companyName: "Hansgrohe Kitchen Faucets",
    productType: "Plumbing",
    website: "www.hansgrohe.com",
  },
  {
    id: 11,
    companyName: "Moen Kitchen Faucets",
    productType: "Plumbing",
    website: "www.moen.com",
  },
];

const CardList = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-wrap justify-around">
      {data.map((item: any) => (
        <Card key={item.id} className="border-none w-96 my-2 md:mx-2 shadow-md">
          <CardHeader>
            <CardTitle>{item.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`https://${item.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.website}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function PlumbingPage() {
  return (
    <div className="">
      <div
        className="hero min-h-screen relative"
        style={{
          backgroundImage: `url(${background.src})`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h2 className="mb-5 text-5xl font-bold text-slate-200">
              Transform Your Space with Premium Plumbing Fixtures
            </h2>
            <p className="mb-5 text-slate-200">
              Upgrade your kitchen and bath with our exclusive selection of
              top-tier plumbing suppliers. Discover a wide range of exquisite
              faucets, toilets, and sinks that blend style and functionality
              seamlessly. Elevate your living spaces and make a statement with
              our curated collection of premium fixtures that cater to both
              aesthetics and performance. Explore now for a transformative
              experience in crafting the heart of your home and the sanctuary of
              your bath.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/client/contact"
                className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a
                href="/client/faq"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="divider py-12"></div>
      <div className="flex flex-col justify-start items-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Our Kitchen and Bath Plumbing Suppliers
        </h2>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around py-8 ">
          {<CardList data={tableData} />}
        </div>
      </div>
    </div>
  );
}
