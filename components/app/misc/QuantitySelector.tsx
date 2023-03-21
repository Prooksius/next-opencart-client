import { QUANTITY_LIMIT } from '@/config'

interface QuantitySelectorProps {
	quantity: number
	disabled: boolean
	updateQuantity: (quantity: number) => void
}

export const QuantitySelector = ({
	quantity,
	disabled,
	updateQuantity,
}: QuantitySelectorProps) => {
	return (
		<span className="quantity-selector">
			<button
				type="button"
				disabled={disabled}
				onClick={() => updateQuantity(quantity > 1 ? quantity - 1 : 1)}
			>
				-
			</button>
			<span>{quantity}</span>
			<button
				type="button"
				onClick={() =>
					updateQuantity(
						quantity < QUANTITY_LIMIT ? quantity + 1 : QUANTITY_LIMIT
					)
				}
			>
				+
			</button>
		</span>
	)
}
