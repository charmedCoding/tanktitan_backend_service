import { Loader } from "@googlemaps/js-api-loader";

export class MapService {
    private loader: Loader;

    constructor() {
        this.loader = new Loader({
            apiKey: process.env.GMAPS_API_KEY,
            version: "weekly",
        });
    }

    public async getMap(): Promise<google.maps.Map> {
        try {
            await this.loader.load();
            const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
            return map;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

