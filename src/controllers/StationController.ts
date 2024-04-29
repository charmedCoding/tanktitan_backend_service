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
} from "tsoa";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/ErrorHandler";
import { generateRandomString } from "../utils/StringGenerator";
import { StationService } from "../services/StationService";
import { StationRequest } from "../types/StationRequest";
import { Station } from "../types/Station";

@Route("stations")
@Tags("Station")
export class StationController extends Controller {
    StationService: StationService = new StationService();

    /**
     * @summary Get all stations
     * @param lat Latitude
     * @param lng Longitude
     * @param rad Radius in meters
	 * @param sort Filter
	 * @param type Fuel Type
     */
    @Get("")
    @Response(500, "Internal Server Error")
    public async getAllDieselStations(
        // @Query() lat: string,
        // @Query() lng: string,
        // @Query() rad: number, 
		// @Query() sort: string,
		// @Query() type: string
    ): Promise<Station[]> {
        // const sRequest: StationRequest = {
        //     lat,
        //     lng,
        //     rad,
		// 	sort,
		// 	type
        // };
        return this.StationService.getAllDieselStations();
        // return this.StationService.getAllDieselStations(sRequest);
    }
}
