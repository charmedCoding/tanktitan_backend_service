export interface StationRequest {
    /**
	 * @minLength 3
	 * @maxLength 50
	 */
    lat: string,
    lng: string,
    rad: number,
    sort: string,
    type: string
}