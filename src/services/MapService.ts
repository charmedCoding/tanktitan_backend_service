import { Loader } from "@googlemaps/js-api-loader";
import {Client, LatLngLiteral} from "@googlemaps/google-maps-services-js";
import {Injectable} from '@nestjs/common'
import { ConfigService} from '@nestjs/config'

// Map API macht mehr Sinn im Frontend weil es direkt eine Map rendert! (kein JSON)
// = wie Iframe
// API Key in Angular enviroment und das auf git ignore
@Injectable()
export class MapService extends Client {
    private readonly accessKey  = process.env.GMAPS_API_KEY;

    constructor (private congig: ConfigService) {
        super()
    }
    async getCoordinates(address: {
        street: string;
        number: string; 
        city: string;
        state: string;
        zip: string;
    }): Promise<LatLngLiteral>{
        const googleRes= await this.geocode({params:{
            address:  `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.zip}`,
            key: this.accessKey,
        }});
        const {lng, lat} = googleRes.data.results[0].geometry.location;
        return {lng, lat};
    }}


