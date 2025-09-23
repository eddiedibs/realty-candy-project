import { Head, usePage } from "@inertiajs/react";
import { type MarketDetails } from "@/types";
import { PropertyDetailsCard } from '@/components/property-details-card';
import { PropertyDetailsChartCard } from '@/components/property-details-chart-card';
import { motion, AnimatePresence } from "framer-motion";

interface MarketProps {
    market: MarketDetails;
}

export default function MarketDetails({ market }: MarketProps) {

    return (
        <>
            <Head title={market.searchMarket.name} />
            <AnimatePresence key="market-details">
                <motion.div
                        key={"market-details"}
                        initial={{ opacity: 0, y: 10 }}   // starts invisible, slightly shifted
                        animate={{ opacity: 1, y: 0 }}    // animates into place
                        exit={{ opacity: 0, y: -10 }}     // fades out if removed
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="grid grid-cols-1 gap-6 mt-24 bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#121212] sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <PropertyDetailsCard
                            title={"Market."}
                            content={market.searchMarket.name}
                            />
                            <PropertyDetailsCard
                            title={"Median Sale (latest)."}
                            content={market.computed.latestMedianSale ? `$${market.computed.latestMedianSale}` : "Not set"}
                            />
                            <PropertyDetailsCard
                            title={"Median $/ft² (sales)."}
                            content={market.computed.medianFtSales ? `$${market.computed.medianFtSales}` : "Not set"}
                            />
                            <PropertyDetailsCard
                            title={"Sales (last month)"}
                            content={market.computed.salesLastMonth ? `${market.computed.salesLastMonth}` : "Not set"}
                            />
                </motion.div>
            </AnimatePresence>
                
            <div className="flex flex-col w- p-20 gap-6 mt-24 bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#121212]">
                <PropertyDetailsChartCard
                    title="Median Sale Price (trend)"
                    content="Median Price"
                    data={market.marketMetricsHousing}
                    lineTypes={["price_median_sales"]}
                    xAxisDataKey={"date"}
                    formatter={"$"}
                    yAxisDataKey={"price_median_sales"}
                    chartConfig={{
                        price_median_sales: {
                            label: "Median Sale",
                            color: "#36a3ea",
                        },
                        }}
                    />
                <PropertyDetailsChartCard
                    title="Market Activity & Inventory"
                    content="Activity & Inventory"
                    data={market.marketMetricsHousing}
                    lineTypes={["sales", "new_listings_for_sale", "new_rental_listings"]}
                    xAxisDataKey={"date"}
                    formatter={""}
                    yAxisDataKey={"sum_of_event_counts"}
                    chartConfig={{
                        sales: {
                            label: "Sales",
                            color: "#4ac0c0",
                        },
                        new_listings_for_sale: {
                            label: "New Listings For Sale",
                            color: "#ff6384",
                        },
                        new_rental_listings: {
                            label: "New Rental Listings",
                            color: "#ffcc56",
                        },
                        }}
                    />
            </div>
        </>
    );
}
