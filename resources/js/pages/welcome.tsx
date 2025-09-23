import { Head } from '@inertiajs/react';
import { type MarketItems } from '@/types';
import { useSearchStore } from "@/stores/useSearchStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome() {
    const { results, setLoading } = useSearchStore();
    const dataToShow = results?.items ?? [];

    const handleClick = () => {
        setLoading(true); // spinner appears in navbar
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="grid grid-cols-1 gap-6 mt-24 bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#121212] sm:grid-cols-2 lg:grid-cols-3">
            {dataToShow.map((item: MarketItems) => (
                    <AnimatePresence key={item.parcl_id}>
                    <a key={item.parcl_id} href={`/markets/${item.parcl_id}`} onClick={handleClick}>
                    <motion.div
                        key={item.parcl_id}
                        initial={{ opacity: 0, y: 10 }}   // starts invisible, slightly shifted
                        animate={{ opacity: 1, y: 0 }}    // animates into place
                        exit={{ opacity: 0, y: -10 }}     // fades out if removed
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-36 p-4 border rounded-md shadow-sm bg-white dark:bg-[#23232e]"
                    >
                        <h2 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{item.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.region}, {item.state_abbreviation}, {item.country}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                        Population:{" "}
                        {item.total_population
                            ? `${item.total_population.toLocaleString()}`
                            : "Not set"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                        Median Income:{" "}
                        {item.median_income
                            ? `$${item.median_income.toLocaleString()}`
                            : "Not set"}
                        </p>
                    </motion.div>
                    </a>
                    </AnimatePresence>
            ))}
            

            <div className="hidden h-14.5 lg:block"></div>
            </div>

        </>
    );
}
