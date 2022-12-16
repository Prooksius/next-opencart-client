import React, { useContext } from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import Image from 'next/image'
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import Select, { components } from "react-select"

const { SingleValue, Option } = components

const IconSingleValue = (props) => (
	<SingleValue {...props}>
		<Image
			src={props.data.image}
			alt=""
			height="30px"
			width="30px"
			objectFit="contain"
			style={{
				borderRadius: '2px',
				marginRight: '10px',
			}}
		/>
		{props.data.label}
	</SingleValue>
)

const IconOption = (props) => (
	<Option {...props}>
		<Image
			src={props.data.image}
			alt=""
      height='30px'
      width='30px'
      objectFit='contain'
			style={{
				borderRadius: '2px',
				marginRight: '10px',
			}}
		/>
		{props.data.label}
	</Option>
)

const customStyles = {
  option: (provided) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
}

const SelectField = ({ name }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields[name]
  const required = thisField.validations.required || false
  const dropdownType = thisField.dropdown || "default"

  return (
    <div
      className={classnames(
        "form-field",
        { hasValue: thisField.value },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      {dropdownType === "images" && (
        <Select
          styles={customStyles}
          value={thisField.value}
          placeholder={null}
          className="multiselect"
          classNamePrefix="inner"
          components={{ SingleValue: IconSingleValue, Option: IconOption }}
          onChange={(selectedOption) =>
            setFieldValue({ field: name, value: selectedOption })
          }
          options={thisField.options}
        />
      )}
      {dropdownType !== "images" && (
        <Select
          value={thisField.value}
          placeholder={null}
          className="multiselect"
          classNamePrefix="inner"
          onChange={(selectedOption) =>
            setFieldValue({ field: name, value: selectedOption })
          }
          options={thisField.options}
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

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
}

export default SelectField
