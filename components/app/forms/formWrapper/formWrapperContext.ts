import { createContext } from "react"
import type { FormContextProps } from "./types"

const initialState: FormContextProps = {
	form: {
		fields: {},
	},
	setForm: () => {},
	checkForm: () => {},
	checkField: () => {},
	errorField: () => {},
	clearForm: () => {},
	setFieldValue: () => {},
}

export const FormWrapperContext = createContext<FormContextProps>(initialState)
