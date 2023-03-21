import TextField from '@/components/app/forms/formFields/TextField'
import TextareaField from '@/components/app/forms/formFields/TextareaField'
import SelectField from '@/components/app/forms/formFields/SelectField'

export const _fieldsList: Record<string, any> = {
	text: TextField,
	textarea: TextareaField,
	select: SelectField,
}
