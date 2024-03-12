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
    companyName: "American Woodmark Corporation",
    productType: "Cabinets",
    address: "Winchester, VA 22601 USA",
    phone: "(540) 665-9100",
    fax: "(540) 665-9176",
    website: "www.americanwoodmark.com",
  },
  {
    id: 2,
    companyName: "Armstrong Cabinet Products",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Addison, TX 75001 USA",
    phone: "(214) 887-2000 or (800) 527-5903",
    fax: "(214) 887-2530",
    website: "www.armstrong.com",
  },
  {
    id: 3,
    companyName: "Bass Cabinet Mfg., INC.",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Mesa, NC 85210 USA",
    phone: "(480) 962-5249",
    fax: "(480) 962-7919",
    website: "www.BassCabinet.com",
  },
  {
    id: 4,
    companyName: "Evans Cabinet Corp.",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Dublin, GA 31021 USA",
    phone: "(478) 272-2530",
    fax: "(478) 272-2731",
    website: "www.evanscabinet.com",
  },
  {
    id: 5,
    companyName: "CornerStone Cabinetry",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Bladenboro, NC 28320 USA",
    phone: "(910) 648-5300",
    fax: "(910) 648-5324",
    website: "www.cornerstone-cabinetry.com",
  },
  {
    id: 6,
    companyName: "Custom Wood Products, LLC",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Jacksonville, FL USA",
    website: "www.customwoodjacksonville.com",
  },
  {
    id: 7,
    companyName: "KraftMaid Cabinetry",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Middlefield, OH 44062",
    phone: "(440)632-5333",
    website: "www.kraftmaid.com",
  },
  {
    id: 8,
    companyName: "Fertig's Highland Collection, INC.",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "Moorefield, WV 26836 USA",
    phone: "(304) 538-6215",
    fax: "(304) 538-7439",
    website: "www.fertigcabinet.com",
  },
  {
    id: 9,
    companyName: "Marsh Furniture Company",
    productType: "Cabinets", // You can update this based on the actual product type
    address: "High Point, NC 27261-0870 USA",
    phone: "(336) 884-7363",
    fax: "(336) 884-0883",
    website: "www.marshfurniture.com",
  },
  {
    id: 10,
    companyName: "Thomasville Cabinetry",
    productType: "Cabinets",
    phone: "1-800-756-6497",
    website: "www.thomasvillecabinetry.com",
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
            <p>{item.address}</p>
            <p>Phone: {item.phone}</p>
            <p>FAX: {item.fax}</p>
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

export default function CabinetsPage() {
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
              Discover Unparalleled Quality from Our Trusted Cabinet Suppliers
            </h2>
            <p className="mb-5 text-slate-200">
              Unlock the door to a world of premium craftsmanship and superior
              quality with our carefully curated cabinet suppliers. Each
              supplier in our collection is renowned for delivering excellence,
              offering an extensive range of styles and finishes to suit your
              unique taste. Dive into the unparalleled artistry and precision of
              our suppliers' collections, bringing innovation and sophistication
              to your home. Explore our cabinet selection now and witness the
              transformative power of top-tier suppliers at your fingertips.
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
          Our Cabinet Suppliers
        </h2>
        <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around py-8 ">
          {<CardList data={tableData} />}
        </div>
      </div>
    </div>
  );
}
