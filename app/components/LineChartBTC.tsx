"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import { IBitcoinCurrency } from "./BitcoinPriceGraph";
import { useState } from "react";
import { motion } from "motion/react";

interface IperiodSwitcher {
  id: number;
  period: "1d" | "3d" | "7d" | "31d";
  buttonName: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 text-black p-2 rounded-md shadow-md">
        <p>Date: {label}</p>
        <p>Price: ${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const periodSwitcher: IperiodSwitcher[] = [
  {
    id: 0,
    period: "1d",
    buttonName: "1 day",
  },
  {
    id: 1,
    period: "3d",
    buttonName: "3 days",
  },
  {
    id: 2,
    period: "7d",
    buttonName: "7 days",
  },
  {
    id: 4,
    period: "31d",
    buttonName: "31 days",
  },
];

export default function LineChartBTC({ data }: { data: IBitcoinCurrency[] }) {
  const [period, setPeriod] = useState<"1d" | "3d" | "7d" | "31d">("7d");

  const currentDate = Date.now();

  const filteredDataByPeriod = data.filter((el) =>
    period === "1d"
      ? el.timestamp >= currentDate - 86400000
      : period === "3d"
      ? el.timestamp >= currentDate - 3 * 86400000
      : period === "7d"
      ? el.timestamp >= currentDate - 7 * 86400000
      : period === "31d"
      ? el.timestamp >= currentDate - 31 * 86400000
      : ""
  );

  return (
    <div className="chartWrapper sm:w-5/6 sm:h-5/6 w-11/12 h-11/12 flex flex-col items-start gap-4 bg-blue-500 rounded-2xl px-8 py-4 font-sans">
      <div className="topPanel flex xl:flex-row flex-col gap-4 xl:justify-between w-full sm:text-2xl text-xl text-white">
        <div className="mainInformation flex gap-2 max-[480px]:flex-col">
          <span>BTC: {data.at(-1)?.value.toFixed(2)}$</span>
          <span>
            as: {new Date(data.at(-1)?.timestamp ?? "").toLocaleDateString()}
          </span>
          <span>
            {new Date(data.at(-1)?.timestamp ?? "").toLocaleTimeString()}
          </span>
        </div>
        <div className={`periodSwitcherButtons flex flex-row gap-2`}>
          {periodSwitcher.map((el) => (
            <motion.button
              key={el.id}
              onClick={() => setPeriod(el.period)}
              className={`w-24 bg-white text-black rounded-2xl ${
                period === el.period ? "border-2 border-black" : "border-0"
              }`}
              initial={{scale: 1}}
              whileTap={{scale: 0.8}}
              whileHover={{scale: 1.1}}
              transition={{duration: 0.2}}
            >
              {el.buttonName}
            </motion.button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" maxHeight={800}>
        <AreaChart
          className="w-full text-white"
          responsive
          data={filteredDataByPeriod.map((el) => ({
            price: el.value.toFixed(2),
            time:
              period === "1d"
                ? new Date(el.timestamp).toLocaleTimeString().toString()
                : new Date(el.timestamp).toLocaleDateString().toString(),
          }))}
        >
          <CartesianGrid />
          <Area dataKey="price" dot={false} stroke="red" fill="#ffffff" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis dataKey="price" stroke="#fff" />
          <Tooltip content={CustomTooltip} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
