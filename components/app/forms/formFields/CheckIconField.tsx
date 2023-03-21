import { useContext } from "react"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import type { SwitchIconProps } from "@/components/app/icons/SwitchIcon"

interface CheckIconFieldProps {
  name: string
  Icon: React.FC<SwitchIconProps>
}

const CheckIconField = ({ name, Icon }: CheckIconFieldProps) => {
	const { form, setFieldValue } = useContext(FormWrapperContext)

	const thisField = form.fields ? form.fields[name] : null

	if (!thisField) {
		return (
			<div className="form-field">
				{name} - Поле не найдено в списке полей формы
			</div>
		)
	}

	return (
		<div data-tip={thisField.label} data-for="for-top">
			<Icon
				active={thisField.value === '1'}
				doSwitch={(condition: boolean) =>
					setFieldValue({
						field: name,
						value: thisField.value === '1' ? '0' : '1',
					})
				}
			/>
		</div>
	)
}

export default CheckIconField
