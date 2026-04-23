import type { Order } from '../types/order';
import { mockOrders } from '../data/mockOrders';

const API_URL = 'https://my.api.mockaroo.com/orders.json?key=e49e6840';

// In-memory cache to ensure consistent data between Home and Orders pages
// since Mockaroo generates randomized data on every GET request.
let cachedOrders: Order[] | null = null;

export async function fetchOrders(forceRefresh = false): Promise<Order[]> {
  if (cachedOrders && !forceRefresh) {
    return cachedOrders;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    //console.log("🚀 ~ API_URL:", API_URL)
    const data: Order[] = await response.json();
    //console.log("🚀 ~ data:", data)
    cachedOrders = data; // Store in cache
    return data;
  } catch (error) {
    // When the API errors out (like the 500 Mockaroo error), we fallback to the packagedata
    console.warn('API unavailable (Mockaroo limit reached). Using fallback packagedata.json data instead.');

    cachedOrders = mockOrders; // Store fallback in cache
    // Simulate a tiny delay so the UI still shows a loading state smoothly during fallback
    return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 600));
  }
}
