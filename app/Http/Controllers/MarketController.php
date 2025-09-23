<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class MarketController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('query');

        if (!$query) {
            return response()->json([]);
        }

        // Cache results for 5 minutes to avoid hitting API too much
        $cacheKey = 'markets_' . md5($query);
        return Cache::remember($cacheKey, 300, function () use ($query) {
            $response = Http::withHeaders([
                'Authorization' => config('services.parcl.key') // if API requires auth
            ])->get("https://api.parcllabs.com/v1/search/markets", [
                'query' => $query
            ]);

            if ($response->failed()) {
                return [];
            }

            return $response->json();
        });
    }




}
