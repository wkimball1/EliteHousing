"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { sendEmail } from "@/utils/send-email";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/components/ui/use-toast";

export type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  function onSubmit(data: FormData) {
    const message = sendEmail(data);
    router.push("/");
  }

  return (
    <div className="w-full flex flex-1 flex-col">
      <div className="flex md:py-10 justify-center items-center">
        <h2 className="text-lg md:text-2xl font-bold">
          Let us know how we can help you today!
        </h2>
      </div>
      <div className="flex w-full pt-8 justify-center items-start flex-1 bg-background">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4"
        >
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-primary"
            >
              Full Name*
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              className="w-full rounded-md border border-gray-300 bg-background py-3 px-6 text-base font-medium text-primary-foreground outline-none focus:border-blue-500 focus:shadow-md"
              {...register("name", { required: true })}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-3 block text-base font-medium text-primary"
            >
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="example@domain.com"
              className="w-full rounded-md border border-gray-300 bg-background py-3 px-6 text-base font-medium text-primary-foreground outline-none focus:border-blue-500 focus:shadow-md"
              {...register("email", { required: true })}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="message"
              className="mb-3 block text-base font-medium text-primary"
            >
              Message*
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="What services are you looking for?"
              className="w-full resize-none rounded-md border border-gray-300 bg-background py-3 px-6 text-base font-medium text-primary-foreground outline-none focus:border-purple-500 focus:shadow-md"
              {...register("message", { required: true })}
            ></textarea>
          </div>
          <div>
            <button className="hover:shadow-form rounded-md bg-blue-500 py-3 px-8 text-base font-semibold text-white outline-none w-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}