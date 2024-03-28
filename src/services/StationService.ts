import { db } from "./DatabaseService"
import { Station } from "../types/Station"
import axios from "axios"

export class StationService {
	// filterparameter übers frontend übergeben können
	public async getAllDieselStations(): Promise<any[]> {
		const lat = "52.52099975265203"
		const lng = "13.43803882598877"
		const rad = 2
		const sort = "price"
		const type = "diesel"
		
		try {
			const response = await axios.get(
				`${process.env.BASE_URL}/json/list.php?lat=${lat}&lng=${lng}&rad=${rad}&sort=${sort}&type=${type}&apikey=${process.env.API_KEY}`
			)
			console.log(response)
			return response.data
		} catch (error) {
			console.log(error)
			throw Error(error)
		}
	}
}
