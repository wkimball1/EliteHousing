"use server";
import React, { useState, useEffect } from "react";

import { createStripePortal } from "@/utils/stripe/server";
import { redirect } from "next/navigation";

export default async function handleStripePortalRequest(
  customerId: string,
  pathname: string
) {
  const currentPath = pathname;

  const redirectUrl = await createStripePortal(currentPath, customerId);
  if (!!redirectUrl) {
    redirect(`${redirectUrl}`);
  } else {
    return alert("failed");
  }
}
