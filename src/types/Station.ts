export interface Station {
	/**
	 *
	 */
	id: string
	/**
	 * @minLength 3
	 * @maxLength 50
	 */
	name: string
	brand: string
	street: string
	place: string

	/**
	 *
	 */
	lat: number
	lng: number
	dist: number
	price: number

	/**
	 * @isBool
	 * @default false
	 */
	isOpen: boolean

	/**
	 *
	 */
	houseNumber: number
	postCode: number
}
