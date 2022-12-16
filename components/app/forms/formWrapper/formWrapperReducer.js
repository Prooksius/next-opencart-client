import { SET_FIELD, SET_FORM, CHECK_FORM, CHECK_FIELD } from "./types"
import {
  ValidatorProps,
  maxLength,
  minLength,
  maxValue,
  minValue,
  required,
  email,
  sameAs,
  isNumeric,
  isAlpha,
  isAlphanumeric,
} from "./myValidators"

// Массив валидаторов, ссылающихся на другие поля формы
const connectedFields = ["sameAs"]

const validateHandlers = {
  required: (param, value, fields) => param && required({ value }),
  minLength: (param, value, fields) => minLength({ value, param }),
  maxLength: (param, value, fields) => maxLength({ value, param }),
  minValue: (param, value, fields) => minValue({ value, param }),
  maxValue: (param, value, fields) => maxValue({ value, param }),
  email: (param, value, fields) => email({ value }),
  isNumber: (param, value, fields) => isNumeric({ value }),
  isAlpha: (param, value, fields) => isAlpha({ value }),
  isAlphanumeric: (param, value, fields) => isAlphanumeric({ value }),
  sameAs: (param, value, fields) => sameAs({ value, param, fields }),
}

const handlers = {
  [SET_FORM]: (state, { payload }) => payload,
  [SET_FIELD]: (state, { payload }) => {
    const copyState = Object.assign({}, state)

    if (Object.keys(copyState.fields).includes(payload.field)) {
      const field = copyState.fields[payload.field]

      if (field) {
        field.value = payload.value
        field.errorMessage = ""
        field.dirty = true
        const validations = field.validations
        Object.entries(validations).every(([key, value]) => {
          // В вызове функции валидатора:
          //  - первый параметр - параметр валидатора (например в случае minLength(5) - это 5)
          //  - второй параметр - значение текущего поля
          //  - третий параметр - все поля формы
          const invalid = validateHandlers[key](
            value,
            payload.value,
            copyState.fields
          )
          if (connectedFields.includes(key)) {
            handlers[CHECK_FIELD](state, {
              type: CHECK_FIELD,
              payload: { field: value },
            })
          }
          if (invalid) {
            field.errorMessage = invalid
            return false
          }
          return true
        })
      }
    }
    return copyState
  },
  [CHECK_FIELD]: (state, { payload }) => {
    const copyState = Object.assign({}, state)

    if (Object.keys(copyState.fields).includes(payload.field)) {
      const field = copyState.fields[payload.field]

      if (field) {
        field.errorMessage = ""
        field.dirty = true
        const validations = field.validations
        Object.entries(validations).every(([key, value]) => {
          // В вызове функции валидатора:
          //  - первый параметр - параметр валидатора (например в случае minLength(5) - это 5)
          //  - второй параметр - значение текущего поля
          //  - третий параметр - все поля формы
          const invalid = validateHandlers[key](
            value,
            field.value,
            copyState.fields
          )
          if (invalid) {
            field.errorMessage = invalid
            return false
          }
          return true
        })
      }
    }
    return copyState
  },
  [CHECK_FORM]: (state) => {
    const copyState = Object.assign({}, state)

    const fields = copyState.fields

    Object.entries(fields).every(([key, field]) => {
      field.errorMessage = ""
      field.dirty = true
      Object.entries(field.validations).every(([key, value]) => {
        const invalid = validateHandlers[key](value, field.value, fields)
        if (invalid) {
          field.errorMessage = invalid
          return false
        }
        return true
      })
      return true
    })
    return copyState
  },
  DEFAULT: (state) => state,
}

export const formWrapperReducer = (state, action) => {
  //  console.log('state', state)
  //  console.log('action', action)
  const handle = handlers[action.type] || handlers.DEFAULT
  const newState = handle(state, action)
  return newState
}
