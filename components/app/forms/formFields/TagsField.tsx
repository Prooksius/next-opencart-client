import React, {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import CreatableSelect from "react-select/creatable"
import Select, { components } from "react-select"
import type { StylesConfig } from "react-select"
import type { FieldData, NS, SelectValue } from "../formWrapper/types"
import Image from "next/image"

const { SingleValue, MultiValue, Option } = components

const colourStyles: StylesConfig<NS, true> = {
  control: (styles) => styles,
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: data.color ? data.color : "#222",
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? data.color + "40"
        : undefined,
    }
  },
  multiValue: (styles, { data }) => {
    console.log("data", data)
    return {
      ...styles,
      backgroundColor: data.color ? data.color + "40" : "var(--linkColor)",
    }
  },
  multiValueLabel: (styles, { data }) => {
    return {
      ...styles,
      color: data.color ? data.color : "#222",
    }
  },
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
}

const IconSingleValue = (props: any) => (
  <SingleValue {...props}>
    {props.data.image && (
      <Image
        src={props.data.image}
        alt=""
        style={{
          height: "30px",
          width: "30px",
          borderRadius: "30px",
          marginRight: "10px",
          objectFit: "contain",
          verticalAlign: "middle",
        }}
      />
    )}
    {props.data.label}
  </SingleValue>
)

const IconMultiValue = (props: any) => (
	<>
		{console.log('props', props)}
		<MultiValue {...props}>
			{props.data.image && (
				<Image
					src={props.data.image}
					alt=""
					style={{
						height: '30px',
						width: '30px',
						borderRadius: '30px',
						marginRight: '10px',
						objectFit: 'contain',
						verticalAlign: 'middle',
					}}
				/>
			)}
			{props.data.label}
		</MultiValue>
	</>
)

const IconOption = (props: any) => (
	<Option {...props}>
		{props.data.image && (
			<Image
				src={props.data.image}
				alt=""
				style={{
					height: '30px',
					width: '30px',
					borderRadius: '30px',
					marginRight: '10px',
					objectFit: 'contain',
					verticalAlign: 'middle',
				}}
			/>
		)}
		{props.data.label}
	</Option>
)

// Step 3
const customStyles = {
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
}

interface TagsFieldProps {
  name: string
  creatable: boolean
}

const createOption = (label: string) => ({
  label,
  value: label,
})

const TagsField: React.FC<TagsFieldProps> = ({ name, creatable }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields ? form.fields[name] : null

  const [inputValue, setInputValue] = useState("")

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    console.log("keydown")
    if (!inputValue) return
    switch (event.key) {
      case "Tab":
        thisField.valueArr.map((option, index) => {
          setFieldValue({
            field: name,
            value: {
              value: option.value ? option.value : '',
              label: option.value,
              checked: true,
            },
            index,
          })
        })
        setFieldValue({
          field: name,
          value: {
            value: inputValue,
            label: inputValue,
            checked: true,
          },
          index: thisField.valueArr.length,
        })
        setInputValue("")
        event.preventDefault()
    }
  }

  const required = thisField.validations.required || false
  const dropdownType = thisField.dropdown || "default"

  return (
    <div
      className={classnames(
        "form-field",
        { hasValue: thisField.valueObj.label },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      {creatable && (
        <CreatableSelect
          value={thisField.valueArr}
          inputValue={inputValue}
          placeholder="Тэги не добавлены"
          isClearable
          isMulti
          menuIsOpen={false}
          className="multiselect"
          classNamePrefix="inner"
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
          }}
          onInputChange={(newValue) => setInputValue(newValue)}
          onKeyDown={handleKeyDown}
          onChange={(options) => {
            setFieldValue({ field: name }) // удаляем все теги
            if (options.length) {
              options.map((selValue, index) => {
                console.log("insert value " + selValue.value)
                setFieldValue({
                  field: name,
                  value: {
                    value: selValue.value ? selValue.value : '',
                    label: selValue.value,
                    checked: true,
                  },
                  index,
                })
              })
            }
          }}
        />
      )}
      {!creatable && dropdownType === "images" && (
        <Select
          value={thisField.valueArr}
          inputValue={inputValue}
          placeholder="Тэги не добавлены"
          isClearable
          isMulti
          closeMenuOnSelect={false}
          styles={colourStyles}
          className="multiselect"
          classNamePrefix="inner"
          components={{
            SingleValue: IconSingleValue,
            MultiValue: IconMultiValue,
            Option: IconOption,
            IndicatorSeparator: () => null,
          }}
          options={thisField.options}
          onInputChange={(newValue) => setInputValue(newValue)}
          onChange={(selectedOptions) => {
            console.log("selectedOptions", selectedOptions)
            setFieldValue({ field: name }) // удаляем все теги
            if (selectedOptions.length) {
              selectedOptions.map((selValue: NS, index) => {
                console.log("insert value " + selValue.value)
                setFieldValue({
                  field: name,
                  value: {
                    value: selValue.value,
                    label: selValue.label,
                    image: selValue.image,
                    color: selValue.color,
                    checked: true,
                  },
                  index,
                })
              })
            }
          }}
        />
      )}
      {!creatable && dropdownType !== "images" && (
        <Select
          value={thisField.valueArr}
          inputValue={inputValue}
          placeholder="Тэги не добавлены"
          isClearable
          isMulti
          className="multiselect"
          classNamePrefix="inner"
          components={{
            IndicatorSeparator: () => null,
          }}
          options={thisField.options}
          onInputChange={(newValue) => setInputValue(newValue)}
          onChange={(selectedOptions) => {
            setFieldValue({ field: name }) // удаляем все теги
            if (selectedOptions.length) {
              selectedOptions.map((selValue, index) => {
                console.log("insert value " + selValue.value)
                setFieldValue({
                  field: name,
                  value: {
                    value: selValue.value,
                    label: selValue.value,
                    checked: true,
                  },
                  index,
                })
              })
            }
          }}
        />
      )}
      <label>
        {thisField.label}
        {required && <span className="required">*</span>}
      </label>
      <small
        className={classnames("error-label", {
          opened: thisField.errorMessage,
        })}
      >
        {thisField.errorMessage}
      </small>
    </div>
  )
}

export default TagsField
