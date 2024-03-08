import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  return (
    <div className="flex flex-col w-full flex-1 bg-background items-center justify-start gap-8 pt-10 pb-4 md:pt-14 md:pb-6 px-4">
      <div className="flex flex-col px-2 md:py-10 justify-start items-center mx-auto max-w-2xl md:w-[42rem]">
        <h1 className="font-bold text-2xl md:text-4xl pb-8">
          Frequently asked questions
        </h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl text-left">
              How much will my cabinets cost?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Cabinets vary dramatically in price just like cars or houses.
              Entry-level cabinets are less expensive than cabinets with special
              finishes and upgraded storage features. HDS provides cabinetry
              that fits most any budget—from basic to bold
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl text-left">
              How long will it take to get the cabinets I order?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Order time varies depending on the manufacturer and the complexity
              of the job. The minimum time is roughly three weeks and can be as
              much as eight weeks during peak times of the year.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl text-left">
              Can you design my kitchen from a sketch of the room that I
              provide?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              We can certainly start with a sketch you provide. Your forethought
              in doing some homework can shorten the time needed to design the
              final layout. However, we will always do our own measurements to
              verify that the design will actually work.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl text-left">
              What is the best type of countertop for the kitchen?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              There are many possible countertop choices. As with cabinets, your
              budget needs to be matched with your desire for flexibility of
              design and product longevity. Laminate, solid surface,
              quartz-enhanced and granite are all good choices.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl text-left">
              Can you match my existing cabinets or furniture?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              All woods and stains change color over time—some more so than
              others. In many cases, HDS can find cabinetry that may be
              compatible with your existing cabinets or furniture. In no case
              can we guarantee an exact match.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-xl text-left">
              What construction features should I look for when choosing
              cabinets?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Certain construction features are a sign of quality cabinets. A
              savvy consumer will look for things such as finished backs in all
              cabinets, drawer guides that also support the drawer bottom,
              conversion varnish (not lacquer) finishes, multi-way adjustable
              hinges, adjustable shelves, and a wide range of heights and
              depths. Newer convenience features include “soft-close” hinges and
              drawers, multi-function drawer systems, and optional task
              lighting. Be sure to check for the KCMA (Kitchen Cabinet
              Manufacturers Association) label, a certification that the
              cabinets meet construction standards designed to ensure many years
              of trouble-free service.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-xl text-left">
              What are the most popular types of cabinets?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              While popular cabinet styles and trends vary from year to year,
              traditional raised-panel oak styling is always a favorite due to
              affordability and durability. A current trend is a “stand-alone”
              furniture look that allows for highly customized design features
              using cabinetry from major manufacturers. Besides oak, certain
              wood species tend to be favored by today's consumers. Maple is
              frequently used in remodeling because of its clean look and its
              ability to blend in with most existing finishes. Cherry has become
              increasingly popular as manufacturers have developed a variety of
              finishes allowing it to work in more applications.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-xl text-left">
              Are environmentally “green” cabinets available at a reasonable
              price?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              HDS represents several manufacturers across the price spectrum
              whose cabinets are certified under the Environmental Stewardship
              Program developed by the KCMA (Kitchen Cabinet Manufacturers
              Association).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-xl text-left">
              What's the difference between manufactured cabinets and
              custom-made cabinets?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Years ago there was a significant difference in the sizes and
              finishes available from "custom" cabinetmakers and the "stock"
              manufacturers. Today, many cabinet manufacturers offer custom
              sizing and finishes that rival, and may even exceed, the
              possibilities of a local custom cabinet shop.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className="text-xl text-left">
              Do you charge a design fee, measure fee or other fees in addition
              to the contract price for cabinets and installation?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              HDS does not charge a measure fee or a design fee for a first
              design or estimate. In some cases, where multiple design revisions
              are requested, a design retainer may be requested. That retainer
              is then credited in full to the final cost of the job.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-11">
            <AccordionTrigger className="text-xl text-left">
              Do you do major remodeling?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              HDS specializes in "light" kitchen, office, or laundry room
              remodeling. We have strong working relationships with several
              quality, full-line remodeling firms for those jobs that require
              major structural renovation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-12">
            <AccordionTrigger className="text-xl text-left">
              Do you provide cabinets for remodeling only, or also for new
              construction?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              HDS works with a number of reputable remodelers and can provide
              cabinets through your contractor or directly to you for your
              kitchen or bath remodeling project or room addition. We also work
              with many custom home builders, who consult with our designers to
              assure that the layouts for kitchen cabinets, bath cabinets,
              laundry room cabinets and other cabinetry are chosen to properly
              fit the budget and space. We will coordinate directly with your
              builder and also consult directly with you
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
