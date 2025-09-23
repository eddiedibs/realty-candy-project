import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface MarketItems {
  case_shiller_10_market: number;
  case_shiller_20_market: number;
  country: string;
  geoid: string;
  location_type: string;
  median_income: number;
  name: string;
  parcl_exchange_market: number;
  parcl_id: number;
  pricefeed_market: number;
  region: string;
  state_abbreviation: string;
  state_fips_code: string;
  total_population: number;
}

export interface Market {
  items: MarketItems[];
  limit: number;
  links: string[];
  offset: number;
  total: number;
}


export interface MarketMetricsPriceStats {
  sales: number;
  new_listings_for_sale: number;
  new_rental_listings: number;
}

export interface MarketMetricsPrice {
  median: MarketMetricsPriceStats;
  standard_deviation: MarketMetricsPriceStats;
  percentile_20th: MarketMetricsPriceStats;
  percentile_80th: MarketMetricsPriceStats;
}

export interface MarketMetricsItem {
  date: string; // ISO date string
  // month: string;
  price_median_sales: number;
  ppsf_median_sales: number;
  sales: number;
  new_listings_for_sale: number;
  new_rental_listings: number;
  sum_of_event_counts: number;
}

export interface ComputedMarketMetricsItem {
  latestMedianSale: string; // ISO date string
  medianFtSales: string;
  salesLastMonth: string;
}



export interface MarketDetails {
  searchMarket: MarketItems;
  marketMetricsHousing: MarketMetricsItem[];
  computed: ComputedMarketMetricsItem
}


export interface SharedData {
  auth: {
    user: { id: number; name: string; email: string } | null;
  };
  markets: Market;
  marketsDetails: MarketDetails;
}