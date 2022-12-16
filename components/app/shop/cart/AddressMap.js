import { listTranslations, listCurrency } from '@/store/slices/globalsSlice'
import {
	listCustomerData,
	listCustomerAddress,
	listAddressRegions,
	setCustomerData,
	setCustomerAddress,
	setAddressRegions,
} from '@/store/slices/cartSlice'
import {
	getCookie,
	setCookies,
	checkCookies,
	removeCookies,
} from 'cookies-next'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Map, Placemark } from 'react-yandex-maps'

const defaultMapData = {
	center: [55.751574, 37.573856],
	zoom: 10,
}

export const AddressMap = () => {
	const dispatch = useDispatch()
	const translations = useSelector(listTranslations)
	const ymaps = useRef(null)
	const suggestView = useRef(null)

	const customerData = useSelector(listCustomerData)
	const customerAddress = useSelector(listCustomerAddress)

	const [opened, setOpened] = useState(false)
	const [mapPosition, setMapPosition] = useState(defaultMapData)
	const addressRegions = useSelector(listAddressRegions)

	const boundsChange = (event) => {
		console.log('event.originalEvent', event.originalEvent)
		setMapPosition({
			center: event.originalEvent.newCenter,
			zoom: event.originalEvent.newZoom,
		})
	}

	const doSetCustomerAddress = (address) => {
		dispatch(setCustomerAddress(address))
	}

	const mapClick = async (event) => {
		console.log('click event', event.originalEvent)
		const coords = event.get('coords')
		console.log('addressRegions', addressRegions)
		console.log('coords', coords)
		console.log('ymaps', ymaps)

		const res = await ymaps.current.geocode(coords)
		const firstGeoObject = res.geoObjects.get(0)

		const addressLine = firstGeoObject.getAddressLine()

		console.log('suggestView.current.options', suggestView.current.options)
		if (opened) {
			suggestView.current.state.set('request', addressLine)
		} else {
			document.getElementById('searchAddress').value = addressLine
		}
		console.log('addressLine', addressLine)

		doSetCustomerAddress({
			country: firstGeoObject.getCountry(),
			countryCode: firstGeoObject.getCountryCode(),
			region: firstGeoObject.getAdministrativeAreas().join(', '),
			city: firstGeoObject.getLocalities().join(', '),
			street: firstGeoObject.getThoroughfare(),
			house: firstGeoObject.getPremiseNumber(),
			geo_lat: coords[0],
			geo_lon: coords[1],
			postalCode:
				firstGeoObject.properties.getAll().metaDataProperty?.GeocoderMetaData
					?.Address?.postal_code,
		})
	}

	const doSelect = async (event) => {
		// !!! здесь почему-то недоступен стейт компонента !!!
		const value = event.get('item').value

		const res = await ymaps.current.geocode(value)
		const firstGeoObject = res.geoObjects.get(0)
		const coords = firstGeoObject.geometry.getCoordinates()

		doSetCustomerAddress({
			country: firstGeoObject.getCountry(),
			countryCode: firstGeoObject.getCountryCode(),
			region: firstGeoObject.getAdministrativeAreas().join(', '),
			city: firstGeoObject.getLocalities().join(', '),
			street: firstGeoObject.getThoroughfare(),
			house: firstGeoObject.getPremiseNumber(),
			geo_lat: coords[0],
			geo_lon: coords[1],
			postalCode:
				firstGeoObject.properties.getAll().metaDataProperty?.GeocoderMetaData
					?.Address?.postal_code,
		})
	}

	const onLoadMap = async (ympasInstance) => {
		ymaps.current = ympasInstance

		suggestView.current = new ymaps.current.SuggestView('searchAddress')
		suggestView.current.events.add('select', doSelect)

    
		const coords = [customerAddress.geo_lat, customerAddress.geo_lon]
		const res = await ymaps.current.geocode(coords)
		const firstGeoObject = res.geoObjects.get(0)

		const addressLine = firstGeoObject.getAddressLine()
		console.log('addressLine', addressLine)
		document.getElementById('searchAddress').value = addressLine

		const geojson = await ymaps.current.borders.load('RU')
		console.log('geojson', geojson)
		const regions_arr = geojson.features.map((item) => ({
			name: item.properties.name,
			code: item.properties.iso3166,
		}))
		dispatch(setAddressRegions(regions_arr))
	}

	useEffect(() => {
		let zoom = 10
		if (customerAddress?.street) {
			zoom = 14
		}
		if (customerAddress?.house) {
			zoom = 17
		}

		const currentMapData = {
			center:
				customerAddress?.geo_lat && customerAddress?.geo_lon
					? [customerAddress.geo_lat, customerAddress.geo_lon]
					: [55.751574, 37.573856],
			zoom,
		}

		setMapPosition(currentMapData)
	}, [customerAddress])

	return (
		<div className="page-cart__address-map">
			<input type="text" id="searchAddress" onClick={() => setOpened(true)} />
			<Map
				modules={[
					'geolocation',
					'geocode',
					'SuggestView',
					'suggest',
					'borders',
				]}
				defaultState={defaultMapData}
				state={mapPosition}
				width="100%"
				height={'400px'}
				onLoad={onLoadMap}
				onClick={mapClick}
				onBoundsChange={boundsChange}
			>
				<Placemark
					defaultGeometry={[55.751574, 37.573856]}
					geometry={[customerAddress?.geo_lat, customerAddress?.geo_lon]}
				/>
			</Map>
		</div>
	)
}
