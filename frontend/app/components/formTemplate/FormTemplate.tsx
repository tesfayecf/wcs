import React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { produce } from "immer";
// TODO: add input adorments
// TODO: check text types https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types

type TTextType = "text" | "password" | "email" | "number" | "tel" | "url" | "date";
type OnAcceptFunction<T> = (fields: T) => any;

type IField = {
    name: string;
    placeholder: string;
    defaultValue?: string;
    helperText?: string
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
    };
} & ({
    type: "text";
    password?: boolean;
    textType?: TTextType;
} | {
    type: "multitext";
    rows: number;
} | {
    type: "select";
    selectItems?: string[];
})

interface IFormProps<T> {
    title: string;
    fields: IField[];
    acceptButtonText: string;
    onAccept: OnAcceptFunction<T>;
    hideCancelButton?: boolean;
    cancelButtonText: string;
    onCancel?: (ev: any) => void;
    disableSubmit?: boolean | undefined;
    isLoading?: boolean;
    externalError: boolean;
    externalErrorText: string;
}

interface IInternalField {
    name: string;
    value: string;
    error: boolean;
    errorText: string;
}

const FormTemplate = <T extends Record<string, any>>(props: IFormProps<T>) => {
    const { onCancel, onAccept, isLoading } = props;
    const [formErrors, setFormErrors] = React.useState<boolean>(false);
    const [internalFields, setInternalFields] = React.useState<IInternalField[]>(
        props.fields.map((field) => ({
            name: field.name,
            value: field.type === "select" && field.selectItems && field.selectItems.length > 0
                ? field.selectItems[0]
                : field.defaultValue ?? "",
            error: false,
            errorText: "",
        }))
    );


    // Initialize initial field values
    const [initialFieldValues, setInitialFieldValues] = React.useState<Record<string, string>>(
        props.fields.reduce((acc, field) => {
            acc[field.name] = field.type === "select" && field.selectItems && field.selectItems.length > 0
                ? field.selectItems[0]
                : field.defaultValue ?? "";
            return acc;
        }, {})
    );

    const handleFieldChange = React.useCallback((name: string, newValue: string) => {
        const foundIndex = props.fields.findIndex((field) => field.name === name);
        const externalField = props.fields[foundIndex];

        setInternalFields((prevFields) => {
            return produce(prevFields, (draft) => {
                const fieldIndex = draft.findIndex((field) => field.name === name);
                if (fieldIndex !== -1) {
                    let val;
                    if (externalField.type === "text") val = validateField(newValue, externalField.validation, externalField.textType);
                    else if (externalField.type === "multitext") val = validateField(newValue, externalField.validation);
                    else if (externalField.type === "select") val = validateField(newValue, externalField.validation);
                    const { error, errorText } = val;
                    console.log(error, errorText)
                    draft[fieldIndex].value = newValue;
                    draft[fieldIndex].error = error;
                    draft[fieldIndex].errorText = errorText;
                }
            });
        });

        // Check if the new value is different from the initial value
        if (newValue !== initialFieldValues[name]) {
            setFormErrors(internalFields.some((field) => field.error));
        }
    }, [props.fields, internalFields, initialFieldValues]);
    const handleCancelClick = React.useCallback(() => {
        if (onCancel) onCancel(null);
    }, [onCancel]);

    const handleAcceptClick = React.useCallback(() => {
        const hasErrors = internalFields.some((field) => field.error);
        if (!hasErrors) {
            const fieldValues: Record<string, any> = {};
            internalFields.map((field) => {
                fieldValues[field.name] = field.value;
            });
            onAccept(fieldValues as T);
        }
    }, [internalFields, onAccept]);

    const renderTitle = () => {
        return (
            <div className={"title"}>
                <h1>{props.title}</h1>
            </div>
        );
    }

    const renderFields = React.useCallback(() => {
        const fields = props.fields.map((fieldData: IField, index: number) => {
            let field = null;
            const foundIndex = internalFields.findIndex((field) => field.name === fieldData.name);
            const internalField = internalFields[foundIndex];

            if (fieldData.type === "text") {
                field = (
                    <TextFieldComponent
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(event) => handleFieldChange(fieldData.name, event.target.value)}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        textType={fieldData.textType}
                        disabled={isLoading}
                    />
                );
            } else if (fieldData.type === "multitext") {
                field = (
                    <TextMultiFieldComponent
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(event) => handleFieldChange(fieldData.name, event.target.value)}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        rows={fieldData.rows}
                        disabled={isLoading}
                    />
                );
            } else if (fieldData.type === "select") {
                field = (
                    <SelectFieldComponent
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(event) => handleFieldChange(fieldData.name, event.target.value as string)}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        selectItems={fieldData.selectItems}
                        disabled={isLoading}
                    />
                );
            }

            return (
                <div key={index} className={"field"}>
                    {field}
                </div>
            );
        });

        return (
            <div className={"fields"}>
                {fields}
            </div >

        )
    }, [internalFields, handleFieldChange]);

    const renderButtons = React.useCallback(() => {

        const loadingSpinner = React.useCallback(() => {
            return (
                <div className={"laodingSpinner"}>
                    <div></div> <div></div>
                    <div></div> <div></div>
                </div>
            )
        }, [])

        return (
            <div className={"buttons"}>
                {props.hideCancelButton ?
                    null :
                    <button disabled={isLoading} className={`${"button"} ${"cancel"}`} onClick={handleCancelClick}>
                        {props.cancelButtonText}
                    </button>}
                <button
                    className={`${"button"} ${"accept"}`}
                    onClick={handleAcceptClick}
                    style={!props.hideCancelButton ? { marginLeft: 'auto' } : undefined}
                >
                    {props.isLoading ? loadingSpinner() : null}
                    {props.acceptButtonText}
                </button>
            </div >
        )
    }, [isLoading, props.acceptButtonText, props.cancelButtonText, handleAcceptClick, handleCancelClick])

    return (
        <div className={"content"}>
            {renderTitle()}
            {renderFields()}
            {renderButtons()}
        </div >
    );
};

export default FormTemplate;

interface IBaseField {
    name: string;
    placeholder: string;
    helperText?: string;
    error?: boolean;
    errorText?: string;
    value: string;
    onChange: (ev: any) => void;
    disabled: boolean;
}


interface ITextFieldProps extends IBaseField {
    textType?: TTextType;
}

const TextFieldComponent: React.FunctionComponent<ITextFieldProps> = React.memo((props: ITextFieldProps) => {
    return (
        <TextField
            id={props.name}
            label={props.name}
            value={props.value}
            onChange={(event) => { props.onChange(event); }}
            placeholder={props.placeholder}
            variant="outlined"
            error={props.error}
            helperText={props.helperText} // TODO: replace with errorText
            fullWidth
            size="small"
            type={props.textType ?? "text"}
            disabled={props.disabled}
        />
    )
})

interface IMultiTextFieldProps extends IBaseField {
    rows: number;
}

const TextMultiFieldComponent: React.FunctionComponent<IMultiTextFieldProps> = React.memo((props: IMultiTextFieldProps) => {

    return (
        <TextField
            id={props.name}
            label={props.name}
            variant="outlined"
            value={props.value}
            onChange={(event) => { props.onChange(event); }}
            error={props.error}
            helperText={props.helperText}
            placeholder={props.placeholder}
            fullWidth
            size="small"
            multiline={true}
            rows={4}
            disabled={props.disabled}
        />
    )
})

interface ISelectFieldProps extends IBaseField {
    selectItems?: string[];
}

const SelectFieldComponent: React.FunctionComponent<ISelectFieldProps> = React.memo((props: ISelectFieldProps) => {

    return (
        <FormControl style={{ width: "100%" }}>
            <InputLabel id={props.name}>{props.name}</InputLabel>
            <Select
                id={props.name}
                label={props.name}
                variant="outlined"
                labelId={props.name}
                value={props.value}
                onChange={props.onChange}
                error={props.error}
                defaultValue="Storage"
                placeholder={props.placeholder}
                fullWidth
                size="small"
                disabled={props.disabled}
            >
                {props.selectItems.map((item: string, index: number) => {
                    return (
                        <MenuItem key={index} value={item}>
                            {item}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
})


const validateField = (
    value: string,
    validation: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        customValidator?: (value: string) => { error: boolean; errorText: string }; // Corrected return type
    } = {},
    textType?: TTextType
): { error: boolean; errorText: string } => {
    let error = false;
    let errorText = "";

    if (value.trim() === "") {
        error = false;
        errorText = "";
        return { error, errorText };
    }

    // if (validation.required && value.trim() === "") {
    //     error = true;
    //     errorText = "This field is required.";
    //     return { error, errorText };
    // }

    if (validation.minLength && value.length < validation.minLength) {
        error = true;
        errorText = `Minimum length is ${validation.minLength} characters.`;
        return { error, errorText };
    }

    if (validation.maxLength && value.length > validation.maxLength) {
        error = true;
        errorText = `Maximum length is ${validation.maxLength} characters.`;
        return { error, errorText };
    }

    if (textType) {
        if (textType === "email") {
            console.log("validating email")
            // Basic email pattern (you can use a more comprehensive regex for email validation)
            const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!emailPattern.test(value)) {
                error = true;
                errorText = "Invalid email address.";
                return { error, errorText };
            }
        } else if (textType === "number") {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
                error = true;
                errorText = "Invalid number.";
                return { error, errorText };
            }
        } else if (textType === "tel") {
            // Regex pattern for a common North American phone number format (e.g., (123) 456-7890)
            const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phonePattern.test(value)) {
                error = true;
                errorText = "Invalid phone number.";
                return { error, errorText };
            }
        } else if (textType === "url") {
            // Basic URL pattern (you can use a more comprehensive regex for URL validation)
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
            if (!urlPattern.test(value)) {
                error = true;
                errorText = "Invalid URL.";
                return { error, errorText };
            }
        } else if (textType === "date") {
            // Basic date pattern (you can use a more comprehensive regex for date validation)
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(value)) {
                error = true;
                errorText = "Invalid date.";
                return { error, errorText };
            }
        }
    }

    if (validation.customValidator) {
        const customValidationResult = validation.customValidator(value);
        // Check the 'error' property in the custom validation result
        if (customValidationResult.error) {
            error = true;
            errorText = customValidationResult.errorText;
            return { error, errorText };
        }
    }

    return { error, errorText };
};