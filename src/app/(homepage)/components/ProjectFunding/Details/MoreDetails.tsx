import React from "react";

import { RealtMarketData } from "@/hooks/useRealtMarketData";

import ExternalLink from "@/components/ExternalLink";

import { DetailsCategory, DetailsGrid, DetailsListItem } from "./DetailsLayout";
import {
  formatCurrency,
  formatCurrencyDecimals,
  formatDate,
  formatNumber,
} from "./formatters";

interface MoreDetailsProps {
  data: RealtMarketData;
}

const MoreDetails: React.FC<MoreDetailsProps> = ({ data }) => (
  <div className="flex flex-col gap-6">
    {/* Token Information */}
    <DetailsCategory title="🪙 Token Information">
      <DetailsGrid>
        <DetailsListItem
          label="Token Price"
          value={formatCurrencyDecimals(data.tokenPrice)}
        />
        <DetailsListItem
          label="Total Tokens"
          value={formatNumber(data.totalTokens)}
        />
        <DetailsListItem label="Symbol" value={data.symbol} small />
        <DetailsListItem
          label="Series Number"
          value={`#${data.seriesNumber}`}
        />
        <DetailsListItem
          label="Marketplace"
          value={
            <ExternalLink url={data.marketplaceLink} text="View on RealT" />
          }
        />
      </DetailsGrid>
    </DetailsCategory>

    {/* Financial Details */}
    <DetailsCategory title="💰 Financial Details">
      <DetailsGrid>
        <DetailsListItem
          label="Underlying Asset Price"
          value={formatCurrency(data.underlyingAssetPrice)}
        />
        <DetailsListItem
          label="Net Rent / Month"
          value={formatCurrencyDecimals(data.netRentMonth)}
        />
        <DetailsListItem
          label="Net Rent / Day"
          value={formatCurrencyDecimals(data.netRentDay)}
        />
        <DetailsListItem
          label="Property Management"
          value={`${formatCurrencyDecimals(data.propertyManagement)}/mo (${(data.propertyManagementPercent * 100).toFixed(0)}%)`}
        />
        <DetailsListItem
          label="RealT Platform Fee"
          value={`${formatCurrencyDecimals(data.realtPlatform)}/mo (${(data.realtPlatformPercent * 100).toFixed(0)}%)`}
        />
        <DetailsListItem
          label="Insurance"
          value={`${formatCurrency(data.insurance)}/yr`}
        />
        <DetailsListItem
          label="Property Taxes"
          value={`${formatCurrency(data.propertyTaxes)}/yr`}
        />
        <DetailsListItem
          label="Utilities"
          value={
            data.utilities > 0
              ? `${formatCurrency(data.utilities)}/yr`
              : "Tenant Paid"
          }
        />
        <DetailsListItem
          label="Initial Maintenance Reserve"
          value={formatCurrency(data.initialMaintenanceReserve)}
        />
        <DetailsListItem
          label="Renovation Reserve"
          value={formatCurrency(data.renovationReserve)}
        />
        <DetailsListItem
          label="Monthly Maintenance"
          value={formatCurrency(data.propertyMaintenanceMonthly)}
        />
        <DetailsListItem
          label="Miscellaneous Costs"
          value={formatCurrency(data.miscellaneousCosts)}
        />
      </DetailsGrid>
    </DetailsCategory>

    {/* Property Details */}
    <DetailsCategory title="🏗️ Property Details">
      <DetailsGrid>
        <DetailsListItem
          label="Lot Size"
          value={data.lotSize ? `${formatNumber(data.lotSize)} sq ft` : "N/A"}
        />
        <DetailsListItem
          label="Construction Year"
          value={String(data.constructionYear)}
        />
        <DetailsListItem
          label="Construction Type"
          value={data.constructionType}
        />
        <DetailsListItem label="Roof Type" value={data.roofType} />
        <DetailsListItem label="Foundation" value={data.foundation} />
        <DetailsListItem label="Heating" value={data.heating || "N/A"} />
        <DetailsListItem label="Cooling" value={data.cooling || "N/A"} />
        <DetailsListItem label="Neighborhood" value={data.neighborhood} />
      </DetailsGrid>
    </DetailsCategory>

    {/* Rental Information */}
    <DetailsCategory title="👥 Rental Information">
      <DetailsGrid>
        <DetailsListItem
          label="Has Tenants"
          value={data.hasTenants ? "Yes" : "No"}
        />
        <DetailsListItem
          label="Rented Units"
          value={`${data.rentedUnits} / ${data.totalUnits}`}
        />
        <DetailsListItem
          label="Rent Start Date"
          value={formatDate(data.rentStartDate.date)}
        />
        <DetailsListItem
          label="Rental Type"
          value={data.rentalType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        />
      </DetailsGrid>
    </DetailsCategory>
  </div>
);

export default MoreDetails;
