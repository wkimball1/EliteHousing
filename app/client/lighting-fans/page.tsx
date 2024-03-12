import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import background from "@/img/cabinet-hero.jpg";
import Link from "next/link";

const tableData = [
  {
    id: 1,
    companyName: "American Lighting",
    productType: "Lighting",
    website: "www.americanlighting.com",
  },
  {
    id: 2,
    companyName: "Kichler Lighting",
    productType: "Lighting",
    website: "www.kichler.com",
  },
  {
    id: 3,
    companyName: "Hunter Fans",
    productType: "Fans",
    website: "www.hunterfan.com",
  },
  {
    id: 4,
    companyName: "Broan",
    productType: "Ventilation",
    website: "www.broan-nutone.com",
  },
  {
    id: 5,
    companyName: "Lightolier",
    productType: "Lighting",
    website: "www.lightolier.com",
  },
  {
    id: 6,
    companyName: "Progress Lighting",
    productType: "Lighting",
    website: "www.progresslighting.com",
  },
  {
    id: 7,
    companyName: "Ledalite - Sonata",
    productType: "Lighting",
    website: "www.ledalite.com",
  },
  {
    id: 8,
    companyName: "Juno Lighting",
    productType: "Lighting",
    website: "www.junolighting.com",
  },
  {
    id: 9,
    companyName: "Framburg Lighting",
    productType: "Lighting",
    website: "www.framburg.com",
  },
  {
    id: 10,
    companyName: "Task Lighting Corporation",
    productType: "Lighting",
    website: "www.tasklighting.co.nz",
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

export default function AppliancesPage() {
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
              Illuminate Your Space with Elegance and Comfort
            </h2>
            <p className="mb-5 text-slate-200">
              Discover a world of brilliance and soothing breeze with our
              premium lighting and fan suppliers. From enchanting chandeliers to
              state-of-the-art ceiling fans, our carefully curated selection is
              designed to elevate your living spaces. Explore a range of styles
              and functionalities that not only illuminate your surroundings but
              also provide a refreshing ambiance. Unleash the perfect blend of
              aesthetics and functionality - make your home a beacon of style
              with our lighting and fan collections. Dive into a realm of
              possibilities and transform your space into a haven of
              sophistication and comfort.
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
          Our Lighting and Fan Suppliers
        </h2>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around py-8 ">
          {<CardList data={tableData} />}
        </div>
      </div>
    </div>
  );
}
