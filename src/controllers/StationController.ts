import {
	Controller,
	Get,
	Path,
	Patch,
	Post,
	Put,
	Route,
	Tags,
	Response,
	Body,
	Delete,
	SuccessResponse,
	Query,
} from "tsoa"
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/ErrorHandler"
import { generateRandomString } from "../utils/StringGenerator"
import { StationService } from "../services/StationService"
import { Station } from "../types/Station"

@Route("stations")
@Tags("Station")
export class StationController extends Controller {
	StationService: StationService = new StationService()

	/**
	 *
	 * @summary Get all stations
	 */

	@Get("")
	@Response(500, "Internal Server Error")
	public async getAllDieselStations(): Promise<any[]> {
		return this.StationService.getAllDieselStations()
	}

	
}
