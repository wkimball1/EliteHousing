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
    companyName: "Asko",
    productType: "Appliances",
    website: "us.asko.com",
  },
  {
    id: 2,
    companyName: "Best",
    productType: "Appliances",
    website: "bestrangehoods.com/en-us",
  },
  {
    id: 3,
    companyName: "Bosch",
    productType: "Appliances",
    website: "www.bosch-home.com/us/",
  },
  {
    id: 4,
    companyName: "Broan",
    productType: "Appliances",
    website: "www.broan-nutone.com/",
  },
  {
    id: 5,
    companyName: "Dacor",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.dacor.com/",
  },
  {
    id: 6,
    companyName: "Danby",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.danby.com/",
  },
  {
    id: 7,
    companyName: "DCS",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.dcsappliances.com/us/",
  },
  {
    id: 8,
    companyName: "Faber",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.faberonline.com/",
  },
  {
    id: 9,
    companyName: "Fisher & Paykel",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.fisherpaykel.com/us/",
  },
  {
    id: 10,
    companyName: "Gaggenau",
    productType: "Appliances",
    website: "www.gaggenau.com",
  },
  {
    id: 11,
    companyName: "Insinkerator",
    productType: "Appliances",
    website: "insinkerator.emerson.com/en-us",
  },
  {
    id: 12,
    companyName: "Jenn Air",
    productType: "Appliances",
    website: "www.jennair.com/ranges.html",
  },
  {
    id: 13,
    companyName: "Marvel",
    productType: "Appliances",
    website: "www.marvelrefrigeration.com",
  },
  {
    id: 14,
    companyName: "Miele",
    productType: "Appliances",
    website: "www.mieleusa.com",
  },
  {
    id: 15,
    companyName: "Scotsman",
    productType: "Appliances", // You can update this based on the actual product type
    website: "scotsmanhomeice.com",
  },
  {
    id: 16,
    companyName: "Sub-Zero",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.subzero-wolf.com/sub-zero",
  },
  {
    id: 17,
    companyName: "Thermador",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.thermador.com/us/",
  },
  {
    id: 18,
    companyName: "U Line",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.u-line.com",
  },
  {
    id: 19,
    companyName: "Venmar",
    productType: "Appliances", // You can update this based on the actual product type
    website: "www.venmar.ca/home.html",
  },
  {
    id: 20,
    companyName: "Viking",
    productType: "Appliances",
    website: "www.vikingrange.com/consumer/index.jsp",
  },
  {
    id: 21,
    companyName: "Wolf",
    productType: "Appliances",
    website: "wolfgourmet.com",
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
              Upgrade Your Home with Top-Notch Appliances
            </h2>
            <p className="mb-5 text-slate-200">
              Elevate your living spaces with cutting-edge appliances from our
              trusted suppliers. Discover a world of innovation and
              functionality, where quality meets style. Explore our range of
              high-performance appliances designed to make your daily life
              easier and more enjoyable. From sleek kitchen gadgets to
              energy-efficient home solutions, find the perfect additions for
              your home. Dive into a world of possibilities – browse our
              appliance suppliers below.
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
          Our Appliance Suppliers
        </h2>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around py-8 ">
          {<CardList data={tableData} />}
        </div>
      </div>
    </div>
  );
}
