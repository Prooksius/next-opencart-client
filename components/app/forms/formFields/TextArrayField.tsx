import React, { useState, useContext, useEffect } from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import { PlusIcon } from "@/components/app/icons/PlusIcon"
import { DeleteIcon } from "@/components/app/icons/DeleteIcon"
import type { NS } from "../formWrapper/types"
import {
  email,
  isNumeric,
  isAlpha,
  isAlphanumeric,
  isIP,
} from "../formWrapper/myValidators"

interface TextArrayFieldProps {
  name: string
}

type FormValidFunc = (
  param: boolean | number | string,
  value: string
) => string | boolean

type FormValidHandlers = {
  [key: string]: FormValidFunc
}

const validateHandlers: FormValidHandlers = {
  email: (param, value) => email({ value, param }),
  isNumber: (param, value) => isNumeric({ value, param }),
  isIP: (param, value) => isIP({ value, param }),
  isAlpha: (param, value) => isAlpha({ value, param }),
  isAlphanumeric: (param, value) => isAlphanumeric({ value, param }),
}

const TextArrayField: React.FC<TextArrayFieldProps> = ({ name }) => {
  const [fieldFocused, setFieldFocused] = useState(false)
  const [errors, setErrors] = useState<boolean[]>([])
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields ? form.fields[name] : null

  useEffect(() => {
    setErrors([])
    // eslint-disable-next-line
  }, [])

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const required = thisField.validations?.required || false

  const validations: string[] = []
  if (thisField.validations) {
    Object.keys(thisField.validations).map((key) => {
      if (key !== "required" && thisField.validations[key] === false)
        validations.push(key)
    })
  }

  const fieldChange = (value: string, curIndex: number) => {
    validations.map((item) => {
      const isInvalid = validateHandlers[item](true, value)
      setErrors(
        errors.map((item, index) => {
          if (index !== curIndex) {
            return item
          } else {
            return isInvalid !== false
          }
        })
      )
    })
  }

  return (
    <div
      className={classnames(
        "form-field",
        "form-group",
        "form-array-field",
        { noLabel: thisField.label === "" },
        { focused: fieldFocused },
        { hasValue: thisField.valueArr.length },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      {thisField.valueArr.length > 0 && (
        <div className="form-field">
          {thisField.valueArr.map((value, index) => (
            <div
              className={classnames("form-field form-fild-array-item", {
                invalid: errors[index],
              })}
              key={name + "-" + index}
            >
              <input
                type={thisField.type}
                autoComplete="off"
                value={value.value || ""}
                onFocus={() => setFieldFocused(true)}
                onBlur={() => setFieldFocused(false)}
                onChange={(e) => {
                  fieldChange(e.target.value, index)
                  setFieldValue({
                    field: name,
                    value: {
                      value: e.target.value,
                      checked: true,
                    },
                    index,
                  })
                }}
              />
              <span className="form-fild-array__counter">{index + 1}</span>
              <button
                type="button"
                className="btn btn-simple btn-simple-big btn-group-right btn-red"
                onClick={() => {
                  setErrors(
                    errors.filter((item, itemIndex) => itemIndex !== index)
                  )
                  setFieldValue({ field: name, index })
                }}
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="btn btn-simple btn-simple-big btn-simple-border"
        onClick={() => {
          setErrors([...errors, true])
          setFieldValue({
            field: name,
            value: { value: "" },
            index: thisField.valueArr.length,
          })
        }}
      >
        <PlusIcon />
      </button>
      <small
        className={classnames("error-label", {
          opened: thisField.errorMessage,
        })}
      >
        {thisField.errorMessage}
      </small>
      {thisField.label && (
        <label>
          {thisField.label}
          {required && <span className="required">*</span>}
        </label>
      )}
    </div>
  )
}

export default TextArrayField
