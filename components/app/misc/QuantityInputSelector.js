import { QUANTITY_LIMIT } from 'config'

export const QuantityInputSelector = ({
	quantity,
	disabled,
	updateQuantity,
}) => {
	return (
		<span className="quantity-selector">
			<button
				type="button"
				disabled={disabled}
				onClick={() => updateQuantity(quantity > 1 ? quantity - 1 : 1)}
			>
				-
			</button>
			<span>
				<input
					type="number"
					value={quantity}
					onChange={(e) =>
						updateQuantity(
							Number(e.target.value) > 0
								? Number(e.target.value) < QUANTITY_LIMIT
									? e.target.value
									: QUANTITY_LIMIT
								: 1
						)
					}
				/>
			</span>
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
