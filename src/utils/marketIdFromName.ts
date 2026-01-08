import { markets } from "@/consts/markets";

const marketFromName = (name: string) => {
  const processedName = name.trim().toLowerCase();

  return markets.find(
    (market) => market.name.trim().toLowerCase() === processedName,
  );
};

export default marketFromName;
