import { useEffect } from 'react';
import Image from 'next/image';

const StaticImage = ({coordinates}: { coordinates?: number[] }) => {

	if (coordinates?.length === 0) {
		return;
	}

	return (
		<Image 
			className="bg-gray-50 rounded-lg mb-8 border-16"
			alt="Image of delivery address"
			width={550}
			height={300}
			src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-clothing-store+383838(${coordinates[0]},${coordinates[1]}/${coordinates[0]},${coordinates[1]},12,0/550x300@2x?attribution=true&logo=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}/>
	)
		
}

export default StaticImage;