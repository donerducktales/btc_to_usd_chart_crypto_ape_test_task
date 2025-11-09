import BitcoinPriceGraph from "./components/BitcoinPriceGraph";

export default function Home() {
  return (
    <main className="main w-full h-screen flex flex-col items-center justify-center">
      <BitcoinPriceGraph />
    </main>
  );
}
