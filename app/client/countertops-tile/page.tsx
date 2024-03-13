import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import background from "@/img/countertops-tile-hero.jpg";
import Link from "next/link";

const tableData = [
  {
    id: 1,
    companyName: "Formica",
    productType: "Laminate",
    website: "www.formica.com",
  },
  {
    id: 2,
    companyName: "Nevamar",
    productType: "Laminate",
    website: "panolam.com/nevamar/",
  },
  {
    id: 3,
    companyName: "Pionite",
    productType: "Laminate",
    website: "panolam.com/pionite/",
  },
  {
    id: 4,
    companyName: "Wilsonart",
    productType: "Laminate",
    website: "www.wilsonart.com/",
  },
  {
    id: 5,
    companyName: "Cosentino",
    productType: "Stone",
    website: "www.silestone.com/index.php",
  },
  {
    id: 6,
    companyName: "DuPont Zodiaq",
    productType: "Stone",
    website: "www.dupont.com/zodiaq/a/en/h/Home/index.html",
  },
  {
    id: 7,
    companyName: "Green Mountain Soapstone",
    productType: "Stone",
    website: "greenmountainsoapstone.com/",
  },
  {
    id: 8,
    companyName: "Burlington Stone",
    productType: "Stone",
    website: "burlingtonstone.co.uk/",
  },
  {
    id: 9,
    companyName: "Cool Concrete Solutions",
    productType: "Concrete",
    website: "www.coolconcretecreations.com/",
  },
  {
    id: 10,
    companyName: "Cheng Design",
    productType: "Concrete",
    website: "www.chengdesign.com/",
  },
  {
    id: 11,
    companyName: "Dremcoat Flooring",
    productType: "Concrete",
    website: "www.dreamcoatflooring.com/stained-concrete-phoenix-az/",
  },
  {
    id: 12,
    companyName: "American Olean",
    productType: "Tile",
    website: "www.americanolean.com/",
  },
  {
    id: 13,
    companyName: "Congoleum",
    productType: "Tile",
    website: "www.congoleum.com/",
  },
  {
    id: 14,
    companyName: "Epro",
    productType: "Tile",
    website: "eprotile.com/",
  },
  {
    id: 15,
    companyName: "Florida Tile",
    productType: "Tile",
    website: "www.floridatile.com/",
  },
  {
    id: 16,
    companyName: "Dordini Italian Tile",
    productType: "Tile",
    website: "www.tilesdordini.com/",
  },
];

const CardList = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-wrap justify-around">
      {data.map((item: any) => (
        <Card key={item.id} className="border-none w-96 my-2 md:mx-2 shadow-md">
          <CardHeader>
            <CardTitle>{item.companyName}</CardTitle>
            <CardDescription>{item.productType}</CardDescription>
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
              Elevate Your Home with Stunning Countertops and Tile
            </h2>
            <p className="mb-5 text-slate-200">
              Transform your home with exquisite countertops and tile options
              from our reputable suppliers. Explore a curated selection of
              premium materials and designs crafted to enhance the beauty and
              functionality of your living spaces. Whether you're remodeling
              your kitchen, bathroom, or any other area, discover the perfect
              surfaces that reflect your style and elevate your home's ambiance.
            </p>
            <p className="mb-5 text-slate-200">
              Dive into our collection of countertops and tile from top-notch
              suppliers below. From durable granite and luxurious marble to
              stylish ceramic and versatile porcelain, find the perfect
              solutions to bring your design vision to life. Explore a world of
              possibilities and create spaces that inspire.
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
          Our Countertop and Tile Suppliers
        </h2>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around py-8 ">
          {<CardList data={tableData} />}
        </div>
      </div>
    </div>
  );
}
