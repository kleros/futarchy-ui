import { useQuery } from "@tanstack/react-query";

export interface RealtMarketData {
  fullName: string;
  shortName: string;
  symbol: string;
  productType: string;
  tokenPrice: number;
  canal: string;
  currency: string;
  totalTokens: number;
  totalTokensRegSummed: number;
  uuid: string;
  ethereumContract: string;
  xDaiContract: string;
  gnosisContract: string;
  goerliContract: string | null;
  totalInvestment: number;
  grossRentYear: number;
  grossRentMonth: number;
  propertyManagement: number;
  propertyManagementPercent: number;
  realtPlatform: number;
  realtPlatformPercent: number;
  insurance: number;
  propertyTaxes: number;
  utilities: number;
  initialMaintenanceReserve: number;
  netRentDay: number;
  netRentMonth: number;
  netRentYear: number;
  netRentDayPerToken: number;
  netRentMonthPerToken: number;
  netRentYearPerToken: number;
  annualPercentageYield: number;
  coordinate: {
    lat: string;
    lng: string;
  };
  marketplaceLink: string;
  imageLink: string[];
  propertyType: number;
  propertyTypeName: string;
  squareFeet: number;
  lotSize: number;
  bedroomBath: string;
  hasTenants: boolean;
  rentedUnits: number;
  totalUnits: number;
  termOfLease: string | null;
  renewalDate: string | null;
  section8paid: number;
  subsidyStatus: string;
  subsidyStatusValue: string | null;
  subsidyBy: string | null;
  sellPropertyTo: string;
  secondaryMarketplace: {
    UniswapV1: number;
    UniswapV2: number;
  };
  secondaryMarketplaces: Array<{
    chainId: number;
    chainName: string;
    dexName: string;
    contractPool: string;
    pair: {
      contract: string;
      symbol: string;
      name: string;
    };
  }>;
  blockchainAddresses: {
    ethereum: {
      chainName: string;
      chainId: number;
      contract: string;
      distributor: string;
      maintenance: string;
    };
    xDai: {
      chainName: string;
      chainId: number;
      contract: string;
      distributor: string;
      rmmPoolAddress: number;
      rmmV3WrapperAddress: string;
      chainlinkPriceContract: string;
    };
    sepolia: {
      chainName: string;
      chainId: number;
      contract: number;
      distributor: number;
      rmmPoolAddress: number;
      chainlinkPriceContract: number;
    };
  };
  underlyingAssetPrice: number;
  renovationReserve: number;
  propertyMaintenanceMonthly: number;
  rentStartDate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  lastUpdate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  originSecondaryMarketplaces: Array<{
    chainId: number;
    chainName: string;
    dexName: string;
    contractPool: string;
  }>;
  initialLaunchDate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  seriesNumber: number;
  constructionYear: number;
  constructionType: string;
  roofType: string;
  assetParking: string | null;
  foundation: string;
  heating: string;
  cooling: string;
  tokenIdRules: number;
  rentCalculationType: string;
  realtListingFeePercent: number;
  realtListingFee: number;
  miscellaneousCosts: number;
  propertyStories: string | null;
  rentalType: string;
  tokenPrices: string | null;
  renovationPoolMonthlyPercentFee: number;
  renovationPoolInitialFee: string | null;
  rentalHistory: Array<{
    date: string;
    value: string;
    adjustment_date: string;
    gross_income_annual: {
      old: string;
      new: string;
    };
    rented_units: {
      old: string;
      new: string;
    };
    total_units: {
      old: string;
      new: string;
    };
    monthly_subsidy: {
      old: string;
      new: string;
    };
    payer_name: {
      old: string;
      new: string;
    };
  }>;
  neighborhood: string;
  [key: string]: unknown;
}

async function fetchAllRealtData(): Promise<Record<string, RealtMarketData>> {
  const response = await fetch("/.netlify/functions/realt-proxy");
  if (!response.ok) {
    throw new Error("Failed to fetch RealT market data");
  }
  return response.json();
}

export function useAllRealtMarketData() {
  return useQuery<Record<string, RealtMarketData>, Error>({
    queryKey: ["realtAllMarketData"],
    queryFn: fetchAllRealtData,
  });
}

export function useRealtMarketData(contractAddress: string) {
  return useQuery<Record<string, RealtMarketData>, Error, RealtMarketData>({
    queryKey: ["realtAllMarketData"],
    queryFn: fetchAllRealtData,
    select: (allData) => {
      const data = allData[contractAddress.toLowerCase()];
      if (!data) {
        throw new Error(
          `No data found for contract address: ${contractAddress}`,
        );
      }
      return data;
    },
    enabled: !!contractAddress,
  });
}
