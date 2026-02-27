import { useEffect } from 'react';
import Image from 'next/image';

const StaticImage = ({coordinates = []}: { coordinates?: number[] }) => {

	// useEffect(() => {
	// 	if (coordinates.length === 0) return

	
	// },[])

	coordinates.length > 0 && (
		<Image 
		alt="Image of delivery address"
		src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-clothing-store+383838(${coordinates[0]},${coodinates[1]}/${coordinates[0]},${coordinates[1]},16,0/300x200@2x?attribution=true&logo=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}/>
	)
		
}

export default StaticImage;