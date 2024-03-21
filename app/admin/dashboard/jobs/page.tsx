"use client";
import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import JobsTable from "./job-table";

import { Tables } from "@/types_db";

type Job = Tables<"jobs">;
function JobsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseJobs, setJobs] = useState<Job[] | null>([]);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let { data, error } = await supabase.from("jobs").select("*");
        setJobs(data);
        console.log(data);
      } catch (err) {
        console.log("Error occured when fetching data" + err);
      }
      setIsLoading(false);
    })();
  }, []);
  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Jobs
      </h1>
      <div className="container mx-auto py-10">
        <Tabs defaultValue="all-jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="current-jobs">Current Jobs</TabsTrigger>
            <TabsTrigger value="past-jobs">Past Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="all-jobs">
            <JobsTable data={supabaseJobs || []} />
          </TabsContent>
          <TabsContent value="current-jobs"></TabsContent>
          <TabsContent value="past-jobs"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default JobsPage;
