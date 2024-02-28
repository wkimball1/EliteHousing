"use client";
import React, { useState, useEffect } from "react";

import { redirect, usePathname } from "next/navigation";
import { createStripePortal } from "@/utils/stripe/server";

export default function handleStripePortalRequest(customerId: string) {
  const currentPath = usePathname();
  const [returnUrl, setRedirectUrl] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        // await async "fetchBooks()" function
        const redirectUrl = await createStripePortal(currentPath, customerId);
        redirect(redirectUrl);
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
  }, []);
  return <></>
}
