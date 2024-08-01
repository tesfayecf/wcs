'use client'
import React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { produce } from "immer";
// TODO: add input adorments
// TODO: check text types https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types

type TTextType = "text" | "password" | "email" | "number" | "tel" | "url" | "date";
type OnAcceptFunction<T> = (fields: T) => any;

type IField<T> = {
    key: keyof T;
    name: string;
    placeholder: string;
    defaultValue?: string;
    helperText?: string
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
    };
    button?: React.JSX.Element
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
    title: string | React.JSX.Element;

    acceptButton: string | React.JSX.Element;
    onAccept: OnAcceptFunction<T>;

    showCancelButton?: boolean;
    cancelButton: string | React.JSX.Element;
    onCancel?: (ev: any) => void;

    additionalButtons?: React.JSX.Element;

    isLoading?: boolean;
    disableSubmit?: boolean;
    externalError: boolean;
    externalErrorText: string;

    titleStyle?: React.CSSProperties;
    fieldStyle?: React.CSSProperties;
    acceptButtonStyle?: React.CSSProperties;
    cancelButtonStyle?: React.CSSProperties;
    formStyle?: React.CSSProperties;

    fields: IField<T>[];
}

interface IInternalField<T> {
    key: keyof T;
    name: string;
    value: string;
    initValue: string;
    error: boolean;
    errorText: string;
}

const Form = <T extends Record<string, any>>(props: IFormProps<T>) => {
    const { onCancel, onAccept, isLoading } = props;
    const [formErrors, setFormErrors] = React.useState<boolean>(false);
    const [internalFields, setInternalFields] = React.useState<IInternalField<T>[]>(
        props.fields.map((field) => {
            const value = field.type === "select" && field.selectItems && field.selectItems.length > 0
                ? field.selectItems[0]
                : field.defaultValue ?? "";
            return {
                key: field.key as keyof T,
                name: field.name,
                value: value,
                initValue: value,
                error: false,
                errorText: "",
            }
        })
    );

    const handleFieldChange = React.useCallback((key: string, newValue: string) => {
        const foundIndex = props.fields.findIndex((field) => field.key === key);
        if (foundIndex === -1) return;
        const externalField = props.fields[foundIndex];

        setInternalFields((prevFields) => {
            return produce(prevFields, (draft) => {
                const fieldIndex = draft.findIndex((field) => field.key === key);
                if (fieldIndex === -1) return;
                let valueError;
                if (externalField.type === "text") valueError = validateField(newValue, externalField.validation, externalField.textType);
                else if (externalField.type === "multitext") valueError = validateField(newValue, externalField.validation);
                else if (externalField.type === "select") valueError = validateField(newValue, externalField.validation);
                const { error, errorText } = valueError;
                draft[fieldIndex].value = newValue;
                draft[fieldIndex].error = error;
                draft[fieldIndex].errorText = errorText;
            });
        });

        // Check if the new value is different from the initial value
        const internalIndex = internalFields.findIndex((field) => field.key === key);
        if (internalIndex === -1) return;
        if (newValue !== internalFields[internalIndex].initValue) {
            setFormErrors(internalFields.some((field) => field.error));
        }
    }, [props.fields, internalFields]);

    const handleCancelClick = React.useCallback(() => {
        if (onCancel) onCancel(null);
    }, [onCancel]);

    const handleAcceptClick = React.useCallback(() => {
        const hasErrors = internalFields.some((field) => field.error);
        if (hasErrors) return
        const fieldValues: Record<string, any> = {};
        internalFields.map((field) => {
            fieldValues[field.key as string] = field.value;
        });
        onAccept(fieldValues as T);
    }, [internalFields, onAccept]);

    const renderTitle = () => {
        return (
            <div className={"title"} style={props.titleStyle}>
                {typeof props.title === "string" ? <h1>{props.title}</h1> : props.title}
            </div>
        );
    }

    const renderFields = React.useCallback(() => {
        const fields = props.fields.map((fieldData: IField<T>, index: number) => {
            let field: null | React.JSX.Element = null;
            const foundIndex = internalFields.findIndex((field) => field.key === fieldData.key);
            if (foundIndex === -1) return;
            const internalField = internalFields[foundIndex];

            if (fieldData.type === "text") {
                field = (
                    <TextFieldComponent
                        key={fieldData.key as string}
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(value: string) => { handleFieldChange(fieldData.key as string, value) }}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        disabled={isLoading}
                        button={fieldData.button}
                        focus={index == 0}

                        textType={fieldData.textType}
                    />
                );
            } else if (fieldData.type === "multitext") {
                field = (
                    <TextMultiFieldComponent
                        key={fieldData.key as string}
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(value: string) => { handleFieldChange(fieldData.key as string, value) }}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        disabled={isLoading}
                        button={fieldData.button}
                        focus={index == 0}

                        rows={fieldData.rows}
                    />
                );
            } else if (fieldData.type === "select") {
                field = (
                    <SelectFieldComponent
                        key={fieldData.key as string}
                        name={fieldData.name}
                        placeholder={fieldData.placeholder}
                        onChange={(value: string) => { handleFieldChange(fieldData.key as string, value) }}
                        value={internalField.value}
                        error={internalField.error}
                        helperText={internalField.errorText}
                        disabled={isLoading}
                        button={fieldData.button}
                        focus={index == 0}

                        selectItems={fieldData.selectItems}
                    />
                );
            }

            return (
                <div key={fieldData.key as string} className={"field"} style={props.fieldStyle}>
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
            <div className={"buttons"} >
                {props.showCancelButton ?
                    <button disabled={isLoading}
                        className={`${"button"} ${"cancel"}`}
                        onClick={handleCancelClick}
                        style={props.cancelButtonStyle}>
                        {props.cancelButton}
                    </button>
                    : null}
                <button
                    className={`${"button"} ${"accept"}`}
                    onClick={handleAcceptClick}
                    style={props.acceptButtonStyle}
                // style={props.showCancelButton ? { ...props.acceptButtonStyle, marginLeft: 'auto' } : props.acceptButtonStyle}
                >
                    {props.isLoading ? loadingSpinner() : null}
                    {props.acceptButton}
                </button>
            </div >
        )
    }, [isLoading, props.acceptButton, props.showCancelButton, handleAcceptClick, handleCancelClick])

    return (
        <div className={"content"} style={props.formStyle}>
            {renderTitle()}
            {renderFields()}
            {props.additionalButtons ? props.additionalButtons : null}
            {renderButtons()}
        </div >
    );
};

export default Form;

interface IBaseField {
    key: string;
    name: string;
    placeholder: string;
    helperText?: string;
    error?: boolean;
    errorText?: string;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    button?: React.JSX.Element
    focus?: boolean;
}


interface ITextFieldProps extends IBaseField {
    textType?: TTextType;
}

const TextFieldComponent: React.FunctionComponent<ITextFieldProps> = React.memo((props: ITextFieldProps) => {
    return (
        <>
            <TextField
                id={props.key}
                label={props.name}
                value={props.value}
                onChange={(event) => { props.onChange(event.target.value); }}
                placeholder={props.placeholder}
                variant="outlined"
                error={props.error}
                helperText={props.helperText} // TODO: replace with errorText
                fullWidth
                size="small"
                type={props.textType ?? "text"}
                disabled={props.disabled}
                autoFocus={props.focus}
                color={"secondary"}
            />
            {props.button ? props.button : null}
        </>
    )
})

interface IMultiTextFieldProps extends IBaseField {
    rows: number;
}

const TextMultiFieldComponent: React.FunctionComponent<IMultiTextFieldProps> = React.memo((props: IMultiTextFieldProps) => {
    return (
        <>
            <TextField
                id={props.key}
                label={props.name}
                variant="outlined"
                value={props.value}
                onChange={(event) => { props.onChange(event.target.value); }}
                error={props.error}
                helperText={props.helperText}
                placeholder={props.placeholder}
                fullWidth
                size="small"
                multiline={true}
                rows={4}
                disabled={props.disabled}
                autoFocus={props.focus}
            />
            {props.button ? props.button : null}
        </>
    )
})

interface ISelectFieldProps extends IBaseField {
    selectItems?: string[];
}

const SelectFieldComponent: React.FunctionComponent<ISelectFieldProps> = React.memo((props: ISelectFieldProps) => {
    return (
        <>
            <FormControl style={{ width: "100%" }}>
                <InputLabel id={props.name}>{props.name}</InputLabel>
                <Select
                    id={props.key}
                    label={props.name}
                    variant="outlined"
                    labelId={props.name}
                    value={props.value}
                    onChange={(event) => { props.onChange(event.target.value); }}
                    error={props.error}
                    defaultValue="Storage"
                    placeholder={props.placeholder}
                    fullWidth
                    size="small"
                    disabled={props.disabled}
                    autoFocus={props.focus}
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
            {props.button ? props.button : null}
        </>
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