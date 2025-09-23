<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Carbon\Carbon;


Route::get('/', function () {

    return Inertia::render('welcome', [
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('/markets/{parcl_id}', function ($parcl_id) {
    $market = Cache::remember('market_detail_' . $parcl_id, 300, function () use ($parcl_id) {
        try {
            // 🔹 Fetch search market
            $searchMarketResponse = Http::withHeaders([
                'Authorization' => config('services.parcl.key')
            ])->get("https://api.parcllabs.com/v1/search/markets", [
                'parcl_id' => $parcl_id
            ]);

            if (!$searchMarketResponse->successful()) {
                \Log::warning("Search market API returned status: {$searchMarketResponse->status()}");
                return [];
            }

            $searchMarketResponseBody = $searchMarketResponse->json(); 
            if (!isset($searchMarketResponseBody['items']) || !is_array($searchMarketResponseBody['items'])) {
                \Log::warning("Search market API returned invalid data", $searchMarketResponseBody);
                return [];
            }

            $searchMarketItems = $searchMarketResponseBody['items'];
            $searchMarketItem = $searchMarketItems[0] ?? null;

            // 🔹 Fetch market metrics housing
            $marketMetricsHousingResp = Http::withHeaders([
                'Authorization' => config('services.parcl.key')
            ])->get("https://api.parcllabs.com/v1/market_metrics/{$parcl_id}/housing_event_prices");

            if (!$marketMetricsHousingResp->successful()) {
                \Log::warning("Housing metrics API returned status: {$marketMetricsHousingResp->status()}");
                return [];
            }

            $marketMetricsHousingRespBody = $marketMetricsHousingResp->json(); 
            $marketMetricsHousingItems = $marketMetricsHousingRespBody['items'] ?? [];

            $salesLastMonth = null;
            $latestMedianSale = null;
            $medianFtSales = null;

            if (!empty($marketMetricsHousingItems)) {
                usort($marketMetricsHousingItems, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

                foreach ($marketMetricsHousingItems as $item) {
                    if ($latestMedianSale === null && !empty($item['price']['median']['sales'])) {
                        $latestMedianSale = $item['price']['median']['sales'];
                    }
                    if ($medianFtSales === null && !empty($item['price_per_square_foot']['median']['sales'])) {
                        $medianFtSales = $item['price_per_square_foot']['median']['sales'];
                    }
                    if ($latestMedianSale !== null && $medianFtSales !== null) break;
                }
            }

            // --- Fetch salesLastMonth from event counts endpoint ---
            $marketEventCountsResp = Http::withHeaders([
                'Authorization' => config('services.parcl.key')
            ])->get("https://api.parcllabs.com/v1/market_metrics/{$parcl_id}/housing_event_counts");

            if (!$marketEventCountsResp->successful()) {
                \Log::warning("Housing event counts API returned status: {$marketEventCountsResp->status()}");
                return [];
            }

            $marketEventCountsRespBody = $marketEventCountsResp->json(); 
            $marketEventCountsItems = $marketEventCountsRespBody['items'] ?? [];

            if (!empty($marketEventCountsItems)) {
                usort($marketEventCountsItems, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

                foreach ($marketEventCountsItems as $event) {
                    if (isset($event['sales']) && $event['sales'] !== null) {
                        $salesLastMonth = $event['sales'];
                        break;
                    }
                }
            }

            // --- Transform housing metrics into chart-ready data ---
            $chartData = collect($marketMetricsHousingItems)
                ->map(function ($item) use ($marketEventCountsItems) {

                    $eventCounts = collect($marketEventCountsItems)
                        ->firstWhere('date', $item['date']) ?? [];

                    $newListingsForSale = $eventCounts['new_listings_for_sale'] ?? 0;
                    $newRentalListings = $eventCounts['new_rental_listings'] ?? 0;
                    $sales = $eventCounts['sales'] ?? 0;

                    return [
                        'date' => $item['date'],
                        'price_median_sales' => $item['price']['median']['sales'] ?? 0,
                        'ppsf_median_sales' => $item['price_per_square_foot']['median']['sales'] ?? 0,
                        'sales' => $sales,
                        'new_listings_for_sale' => $newListingsForSale,
                        'new_rental_listings' => $newRentalListings,
                        'sum_of_event_counts' => $newListingsForSale + $newRentalListings + $sales,
                    ];
                })
                ->sortBy(fn($item) => Carbon::parse($item['date']))
                ->values()
                ->toArray();

            return [
                'searchMarket' => $searchMarketItem,
                'marketMetricsHousing' => $chartData,
                'computed' => [
                    'latestMedianSale' => $latestMedianSale,
                    'medianFtSales' => $medianFtSales,
                    'salesLastMonth' => $salesLastMonth,
                ]
            ];
        } catch (\Exception $e) {
            \Log::error("API request failed: " . $e->getMessage());
            return [];
        }
    });

    return Inertia::render('MarketDetails', [
        'market' => $market
    ]);
})->name('market.show');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
