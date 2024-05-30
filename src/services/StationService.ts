import { db } from "./DatabaseService"
import { Station } from "../types/Station"
import { StationRequest } from "../types/StationRequest"
import axios from "axios"

export class StationService {
	// filterparameter übers frontend übergeben können
	public async getAllDieselStations(sRequest: StationRequest ): Promise<Station[]> {
		// const lat = "52.52099975265203"
		// const lng = "13.43803882598877"
		// const rad = 2
		// const sort = "price"
		// const type = "diesel"

		//STUTTGART
		// const lat = "48.783333"
		// const lng = "9.183333"
		// const rad = 2
		// const sort = "price"
		// const type = "diesel"
		
		try {
			const response = await axios.get(
				`${process.env.BASE_URL}/json/list.php?lat=${sRequest.lat}&lng=${sRequest.lng}&rad=${sRequest.rad}&sort=${sRequest.sort}&type=${sRequest.type}&apikey=${process.env.API_KEY}`
			)
			console.log(response)
		// 	const stations = response.data.stations;

        // 	// Define the regex pattern to match names
       	// 	 const pattern = /^[A-Za-z\s'-]+/;

       	// 	// Extract and clean the names
       	// 	const cleanedNames = stations.map(station => {
        //     const match = station.name.match(pattern);
		// 	return {
        //         ...station,
        //         name: match ? match[0].trim() : ''
        //     };
        // });

        // console.log(cleanedNames);
        // return cleanedNames;
		console.log(response.data.stations)
			return response.data.stations
		} catch (error) {
			console.log(error)
			throw Error(error)
		}
	}
}
