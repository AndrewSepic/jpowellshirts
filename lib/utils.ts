import type { ShippingAddress } from '@/lib/types'

export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PW-${timestamp}-${random}`;
}


export async function geocodeAddress(shippingAddress: ShippingAddress) {
	const {address1, city, region, zip, country} = shippingAddress;
	
	const query = [address1, city, region, zip, country]
		.filter(Boolean)
		.join('+');
		
	try {
		console.log('[MAPBOX] Geocoding address:', [city, region].filter(Boolean).join(', '));
		const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
		const json = await response.json();
		console.log('[MAPBOX] ✅ Geocoded:', json.features[0]?.properties?.full_address || json.features[0]?.place_name || 'no match');
		return json.features[0];
	} catch(err) {
		console.error("[MAPBOX] Failed to geocode Address: ", err);
		return null;
	}
}
