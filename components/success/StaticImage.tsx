import { useEffect } from 'react';
import Image from 'next/image';

const StaticImage = ({coordinates = []}: { coordinates?: number[] }) => {

	useEffect(() => {
		if (coordinates.length === 0) return

		const [ lng, lat ] = coordinates;

https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-clothing-store+383838(-73.9809,40.684)/-73.9809,40.684,15.95,0/300x200@2x?attribution=true&logo=true&access_token=
		const getStaticImage = async () => {
			fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-clothing-store+383838(${lng},${lat}/${lng},${lat},16,0/300x200@2x?attribution=true&logo=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
		}
	},[])

	return (
		<>
		</>
	)
}

export default StaticImage;