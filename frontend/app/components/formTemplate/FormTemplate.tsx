import React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import styles from "./styles/FormTemplate.module.scss"
import produce from "immer";
import debounce from "lodash/debounce";

// TODO: add input adorments
// TODO: check text types https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types

type TTextType = "text" | "password" | "email" | "number" | "tel" | "url" | "date";

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

interface IFormProps {
    title: string;
    fields: IField[];
    acceptButtonText: string;
    onAccept: (fields: Record<string, any>) => void;
    hideCancelButton?: boolean;
    cancelButtonText: string;
    onCancel?: () => void;
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

const FormTemplate: React.FunctionComponent<IFormProps> = React.memo((props: IFormProps) => {
    const { fields, onCancel, onAccept, isLoading } = props;
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


    const handleFieldChange = React.useCallback((name: string, newValue: string) => {
        const foundIndex = props.fields.findIndex((field) => field.name === name);
        const externalField = props.fields[foundIndex];
        setInternalFields((prevFields) =>
            prevFields.map((field) => {
                if (field.name === name) {
                    const { error, errorText } = validateField(newValue, externalField.validation);
                    return { ...field, value: newValue, error, errorText };
                }
                return field;
            })
        );
        // Check if there are any errors in the form
        setFormErrors(internalFields.some((field) => field.error));
    }, [props.fields]);

    // const debouncedValidateField = React.useCallback(
    //     debounce((name: string, newValue: string) => {
    //         const foundIndex = props.fields.findIndex((field) => name === field.name);
    //         const externalField = props.fields[foundIndex];
    //         const { error, errorText } = validateField(
    //             newValue,
    //             externalField.validation,
    //             externalField.type === "text" ? externalField.textType : undefined
    //         );

    //         // Update the formFields state with the validation results
    //         setInternalFields((prevFields) =>
    //             produce(prevFields, (draftFields) => {
    //                 const updatedField = draftFields.find((field) => field.name === name);
    //                 if (updatedField) {
    //                     updatedField.error = error;
    //                     updatedField.errorText = errorText;
    //                 }
    //             })
    //         );
    //     }, 300), // Debounce for 300 milliseconds
    //     []
    // );

    // const handleFieldChange = React.useCallback(
    //     (name: string, newValue: string) => {
    //         // Use Immer to update formFields immutably
    //         setInternalFields((prevFields) =>
    //             produce(prevFields, (draftFields) => {
    //                 const fieldToUpdate = draftFields.find((field) => field.name === name);
    //                 if (fieldToUpdate) {
    //                     fieldToUpdate.value = newValue;
    //                     // Debounce the field validation to reduce validation calls
    //                     debouncedValidateField(name, newValue);
    //                 }
    //             })
    //         );
    //         setFormErrors(internalFields.some((field) => field.error));

    //     }, [debouncedValidateField]
    // );


    const handleCancelClick = React.useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    const handleAcceptClick = React.useCallback(() => {
        const hasErrors = internalFields.some((field) => field.error);

        if (!hasErrors) {
            const fieldValues = internalFields.reduce((values, field) => {
                values[field.name] = field.value;
                return values;
            }, {});

            onAccept(fieldValues);
        }
    }, [internalFields, onAccept]);

    const renderTitle = () => {
        return (
            <div className={styles.title}>
                <h1>{props.title}</h1>
            </div>
        );

    }

    const renderFields = React.useCallback(() => {
        return props.fields.map((fieldData: IField, index: number) => {
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
                    />
                );
            }

            return (
                <div className={styles.fields}>
                    <div key={index} className={styles.field}>
                        {field}
                    </div>
                </div>
            );
        });
    }, [props.fields]);

    const renderButtons = React.useCallback(() => {

        const loadingSpinner = React.useCallback(() => {
            return (
                <div className={styles.laodingSpinner}>
                    <div></div> <div></div>
                    <div></div> <div></div>
                </div>
            )
        }, [])

        return (
            <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.cancel}`} onClick={handleCancelClick}>
                    {props.cancelButtonText}
                </button>
                <button className={`${styles.button} ${styles.accept}`} onClick={handleAcceptClick}>
                    {isLoading ? loadingSpinner() : null}
                    {props.acceptButtonText}
                </button>
            </div >
        )
    }, [isLoading, props.acceptButtonText, props.cancelButtonText, handleAcceptClick, handleCancelClick])

    return (
        <div className={styles.content}>
            {renderTitle()}
            {renderFields()}
            {renderButtons()}
        </div >
    );
});

export default FormTemplate;

interface IBaseField {
    name: string;
    placeholder: string;
    helperText?: string;
    error?: boolean;
    errorText?: string;
    value: string;
    onChange: (ev: any) => void;
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
        customValidator?: (value: string) => { error: boolean, errorText: string }; // Custom validation function
    } = {},
    textType?: TTextType
): { error: boolean; errorText: string } => {
    let error = false;
    let errorText = "";

    if (validation.required && value.trim() === "") {
        error = true;
        errorText = "This field is required.";
    }

    if (validation.minLength && value.length < validation.minLength) {
        error = true;
        errorText = `Minimum length is ${validation.minLength} characters.`;
    }

    if (validation.maxLength && value.length > validation.maxLength) {
        error = true;
        errorText = `Maximum length is ${validation.maxLength} characters.`;
    }

    if (textType) {
        if (textType === "email") {
            // Basic email pattern (you can use a more comprehensive regex for email validation)
            const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!emailPattern.test(value)) {
                error = true;
                errorText = "Invalid email address.";
            }
        } else if (textType === "number") {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
                error = true;
                errorText = "Invalid number.";
            }
        } else if (textType === "tel") {
            // Regex pattern for a common North American phone number format (e.g., (123) 456-7890)
            const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phonePattern.test(value)) {
                error = true;
                errorText = "Invalid phone number.";
            }
        } else if (textType === "url") {
            // Basic URL pattern (you can use a more comprehensive regex for URL validation)
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
            if (!urlPattern.test(value)) {
                error = true;
                errorText = "Invalid URL.";
            }
        } else if (textType === "date") {
            // Basic date pattern (you can use a more comprehensive regex for date validation)
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(value)) {
                error = true;
                errorText = "Invalid date.";
            }
        }
    }

    if (validation.customValidator && !validation.customValidator(value)) {
        const newState = validation.customValidator(value);
        error = newState.error;
        errorText = newState.errorText;
    }

    return { error, errorText };
};

