export const UPDATE_QUANTITY = 'update-quantity'
export const RESET_QUANTITY = 'reset-quantity'
export const UPDATE_TOTAL = 'update-total'

export const cartReducer = (state, action) => {
	switch (action.type) {
		case UPDATE_QUANTITY:
			return state.map((item) => {
				if (item.cart_id === action.payload.cart_id) {
					return {
						cart_id: item.cart_id,
						price: item.price,
						quantity: +action.payload.quantity,
						total: item.total,
						updated:
							+action.payload.quantity !== +item.quantity ? true : item.updated,
						updatedCount:
							item.updatedCount +
							(+action.payload.quantity !== +item.quantity ? 1 : 0),
					}
				}
				return item
			})
		case RESET_QUANTITY:
			return state.map((item) => {
				return {
					cart_id: item.cart_id,
					price: item.price,
					quantity: item.quantity,
					total: item.total,
					updated: false,
					updatedCount: item.updatedCount,
				}
			})
		case UPDATE_TOTAL:
			if (item.cart_id === action.payload.cart_id) {
				return {
					cart_id: item.cart_id,
					price: item.price,
					quantity: item.quantity,
					total: +action.payload.total,
					updated: item.updated,
					updatedCount: item.updatedCount,
				}
			}
			return item
		default:
			return state
	}
}
