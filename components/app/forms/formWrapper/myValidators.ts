import validator from "validator"
import type { FieldsData, SelectValue } from "./types"
import { pluralName } from "@/config"
import moment from "moment"

const characterNames = ["символа", "символов", "символов"]

export interface ValidatorProps {
  value: string | number
  param?: boolean | number | string
  fields?: FieldsData
}

export interface SameValidatorProps {
  value: string | number
  param: string
  fields: FieldsData
}

export const required = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (param === false) return false
  if (
    !value.toString().trim().length ||
    !validator.toBoolean(value.toString().trim())
  ) {
    return "Поле обязательно"
  } else return false
}
export const minLength = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (param && value.toString().trim().length < +param) {
		return `Значение должно быть больше ${param} ${
			characterNames[pluralName(+param)]
		}`
	} else return false
}
export const maxLength = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (param && value.toString().trim().length > +param) {
		return `Значение должно быть меньше ${param} ${
			characterNames[pluralName(+param)]
		}`
	} else return false
}
export const minValue = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (parseFloat(String(value)) <= parseFloat(String(param))) {
    return `Значение должно быть больше ${param}`
  } else return false
}

export const dateInFuture = ({ param, value }: ValidatorProps): string | boolean => {
  const today = moment()
  const current = moment(value.toString().split(".").reverse().join("-"))

  const currentEmpty = value.toString().length === 0

  const currentValid = moment(
    value.toString().split(".").reverse().join("-")
  ).isValid()

  const currentFuture = current.isAfter(today)

  if (!currentEmpty) {
    if (currentValid && !currentFuture) return `Дата должна быть в будущем`
  }

  return false
}
export const isDate = ({ param, value }: ValidatorProps): string | boolean => {
  const currentEmpty = value.toString().length === 0

  const currentValid = moment(
    value.toString().split(".").reverse().join("-")
  ).isValid()

  if (!currentEmpty) {
    if (!currentValid) return `Неверная дата`
  }

  return false
}

export const maxValue = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (param && value.toString().trim().length >= +param) {
		return `Значение должно быть меньше ${param}`
	} else return false
}

export const email = ({ param, value }: ValidatorProps): string | boolean => {
  if (param === false) return false
  if (String(value) && !validator.isEmail(String(value))) {
    return `Значение должно быть E-mail`
  } else return false
}

export const isNumeric = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (param === false) return false
  if (!validator.isNumeric(String(value))) {
    return `Значение должно быть числом`
  } else return false
}

export const isAlpha = ({ param, value }: ValidatorProps): string | boolean => {
  if (param === false) return false
  if (!validator.isAlpha(String(value))) {
    return `Значение должно содержать только буквы`
  } else return false
}

export const isIP = ({ param, value }: ValidatorProps): string | boolean => {
  if (param === false) return false
  if (!validator.isIP(String(value), 4)) {
    return `Значение должно быть IP-адресом`
  } else return false
}

export const isAlphanumeric = ({
  param,
  value,
}: ValidatorProps): string | boolean => {
  if (!validator.isAlphanumeric(String(value))) {
    return `Значение должно содержать только буквы и цифры`
  } else return false
}

export const sameAs = ({
  param,
  value,
  fields,
}: SameValidatorProps): string | boolean => {
  if (!fields || !fields[param]) return false
  let val = ""
  if (fields[param].type === "select") {
    val = fields[param].valueObj.value
  } else {
    val = fields[param].value
  }
  if (!validator.equals(String(value), val)) {
    return `Значение должно быть равно полю ${fields[param].label}`
  } else return false
}
