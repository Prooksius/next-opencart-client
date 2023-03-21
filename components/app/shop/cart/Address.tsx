import { listTranslations } from '@/store/slices/globalsSlice'
import { useSelector } from 'react-redux'
import { ymapSettings } from '@/config'
import { YMaps } from 'react-yandex-maps'
import { AddressMap } from './AddressMap'

export const Address = () => {
	const translations = useSelector(listTranslations)

	return (
		<div className="page-cart__address">
			<h3>{translations('CheckoutYourAddress')}</h3>
			<YMaps version="2.1" query={ymapSettings}>
				<AddressMap />
			</YMaps>
		</div>
	)
}
