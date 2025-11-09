"use client";

import useSWR from "swr";
import LineChartBTC from "./LineChartBTC";
import { AnimatePresence, motion } from "motion/react";
import { FaRegClock } from "react-icons/fa6";
import { useState, useEffect } from "react";

export interface IBitcoinCurrency {
  id: number;
  timestamp: number;
  value: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { method: "GET" });
  return res.json();
};

export default function BitcoinPriceGraph() {
  const { data, isLoading, error } = useSWR("api/getBtc", fetcher);
  // client side rendering of data from api, because i need use client for motion

  // for correct working of animation
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (error) return <div>Error</div>;

  const parsedData: IBitcoinCurrency[] =
    (data?.prices as [number, number][])?.map(([timestamp, value]) => ({
      id: timestamp,
      timestamp,
      value,
    })) || []; // transforming data from coingecko api to array of objects

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            key="loading"
            className="loadingScreen w-screen h-screen bg-blue-500 flex justify-center items-center z-50 absolute top-0 left-0"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >
            <div className="flex flex-row gap-4 text-5xl text-white font-sans font-semibold">
              Loading <FaRegClock />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoading && parsedData.length > 0 && (
        <LineChartBTC data={parsedData} />
      )}
    </>
  );
}
