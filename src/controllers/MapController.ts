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

import { MapService } from "../services/MapService"


@Route("maps")
@Tags("Map")
export class MapController extends Controller {
	MapService: MapService = new MapService()

	/**
	 *
	 * @summary Get map
	 */

	@Get("")
	@Response(500, "Internal Server Error")
	public async getMap(): Promise<any> {
		return this.MapService.getMap()
	}

	
}

