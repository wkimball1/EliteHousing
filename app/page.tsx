import NavBar from "@/components/NavBar";
import background from "../img/kitchen-hero2.jpg";
import step1 from "../img/step1.jpg";
import step2 from "../img/step2.jpg";
import step3 from "../img/step3-1.jpg";
import { MdOutlineCountertops } from "react-icons/md";
import { BiCabinet } from "react-icons/bi";
import { LuLampCeiling } from "react-icons/lu";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Index() {
  return (
    <div className="flex flex-col w-full h-screen bg-background">
      <div className="w-full fixed z-50 top-0 left-0">
        <NavBar />
      </div>
      <div className="flex flex-col w-full flex-1 bg-background items-center justify-center gap-8 pt-10 pb-4 md:pt-14 md:pb-6 px-4">
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: `url(${background.src})`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-lg">
              <h1 className="mb-5 text-5xl font-bold text-slate-200">
                Elevate Your Living Spaces with Premier Renovations
              </h1>
              <p className="mb-5 text-slate-200">
                Transform your home with our expert renovation services. From
                modernizing kitchens to refreshing baths and optimizing laundry
                rooms, Home Renovation Systems is your trusted partner for
                creating spaces that inspire and delight. Click "Get Started" to
                connect with our experts today.
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
          <h2 className="text-2xl md:text-3xl font-semibold">WHAT WE OFFER</h2>
          <div className="flex flex-col justify-center items-center sm:flex-row sm:flex-wrap w-full justify-around pt-8 ">
            <Card className="border-none w-96 my-2 md:mx-2 shadow-xl">
              <CardHeader>
                <CardTitle>
                  <BiCabinet size={50} className="bg-slate-500 rounded" />
                </CardTitle>
                <CardDescription className="text-xl md:text-3xl font-semibold py-2">
                  Cabinets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Elevate your spaces with our bespoke cabinetry solutions. Our
                  expert craftsmen specialize in designing and installing
                  high-quality kitchen, bath, and laundry room cabinets.
                  Transform your interiors with functional and aesthetically
                  pleasing storage solutions tailored to your unique style.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none w-96 my-2 md:mx-2 shadow-xl">
              <CardHeader>
                <CardTitle>
                  <MdOutlineCountertops
                    size={50}
                    className="bg-slate-500 rounded"
                  />
                </CardTitle>
                <CardDescription className="text-xl md:text-3xl font-semibold py-2">
                  Kitchen and Bath
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Revitalize your kitchen and bath spaces with our comprehensive
                  plumbing, countertops, and floor tile services. From precision
                  plumbing installations to luxurious countertop selections and
                  exquisite floor tile designs, we bring elegance and
                  functionality to every corner of your home. Trust our skilled
                  team for seamless and stunning transformations.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none w-96 my-2 md:mx-2 shadow-xl">
              <CardHeader>
                <CardTitle>
                  <LuLampCeiling size={50} className="bg-slate-500 rounded" />
                </CardTitle>
                <CardDescription className="text-xl md:text-3xl font-semibold py-2">
                  Lighting and Fans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Illuminate your living spaces with our curated collection of
                  lighting fixtures and fans. Our selection includes stylish and
                  energy-efficient options to enhance the ambiance of your home.
                  Whether you're seeking modern pendant lights, classic
                  chandeliers, or efficient ceiling fans, our experts will
                  assist you in choosing the perfect lighting solutions for
                  every room.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="divider py-12"></div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            WHAT TO DO NEXT?
          </h2>
          <div className="flex flex-col items-center justify-center sm:flex-row sm:flex-wrap w-full justify-around my-12">
            <Card className="w-full my-2 md:mx-2 sm:w-1/4 md:w-1/4 lg:w-1/4 shadow-xl">
              <CardHeader>
                <CardTitle>1. BOOK A FREE CONSULTATION!</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={step1.src}
                  alt="consultant planning a kitchen design"
                />
              </CardContent>
              <CardFooter>
                <p className="font-semibold">Share your goals and budget.</p>
              </CardFooter>
            </Card>
            <Card className="w-full my-2 md:mx-2 sm:w-1/4 md:w-1/4 lg:w-1/4 shadow-xl">
              <CardHeader>
                <CardTitle>2. AN EXPERT COMES TO YOUR HOME!</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={step2.src}
                  alt="consultant in client's house discussing kitchen"
                />
              </CardContent>
              <CardFooter>
                <p className="font-semibold">
                  Get a free same-day or next-day visit and receive an estimate.
                  We also offer virtual consultations.
                </p>
              </CardFooter>
            </Card>
            <Card className="w-full my-2 md: mx-2 sm:w-1/4 md:w-1/4 lg:w-1/4 shadow-xl">
              <CardHeader>
                <CardTitle>3. INSTALLATION & PROJECT MANAGEMENT</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={step3.src} alt="contractor renovating kitchen" />
              </CardContent>
              <CardFooter>
                <p className="font-semibold">
                  Our licensed pros complete the project on time and on budget
                  while project coordinators manage everything for you.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
