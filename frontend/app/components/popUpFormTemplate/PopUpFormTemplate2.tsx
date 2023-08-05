import React, { useState } from "react";
import { Dialog, MenuItem, Select, TextField } from "@mui/material";
import styles from "./styles/PopUpFormTemplate.module.scss";
import LoadingSVG from "../loadingPage/LoadingSVG";

interface IField {
    type: "textInput" | "select" | "multiline";
    name: string;
    placeholder: string;
    selectItems?: string[];
    password?: boolean;
    validation?: (value: string) => boolean; // Validation function that returns a boolean
}

interface IFieldState extends IField {
    value: string;
    error: boolean;
}

interface IPopUpFormProps {
    open: boolean;
    title: string;
    fields: IField[];
    submitButtonText: string;
    onSubmit: () => void;
    onCancel?: () => void;
    hideBackDrop?: boolean;
    hideCancelButton?: boolean;
    onCancelButtonText?: string;
    isLoading?: boolean;
}

const PopUpFormTemplate2: React.FC<IPopUpFormProps> = (props: IPopUpFormProps) => {
    const [formFields, setFormFields] = useState<IFieldState[]>(
        props.fields.map((field) => ({
            ...field,
            value: "",
            error: false,
        }))
    );

    const handleFieldChange = (index: number, value: string) => {
        const updatedFields = [...formFields];
        updatedFields[index].value = value;
        validateForm();
        setFormFields(updatedFields);
    };

    const validateForm = React.useCallback(() => {
        let formIsValid = true;
        const updatedFields = formFields.map((field) => {
            let error = false;
            if (field.validation) {
                error = !field.validation(field.value);
            }
            return { ...field, error };
        });

        setFormFields(updatedFields);
        formIsValid = updatedFields.every((field) => !field.error);
        return formIsValid;
    }, [formFields]);

    const resetForm = () => {
        const resetFields = formFields.map((field) => ({
            ...field,
            value: "",
            error: false,
        }));
        setFormFields(resetFields);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            props.onSubmit();
            resetForm();
        }
    };

    const renderFields = () => {
        return formFields.map((fieldData: IFieldState, index: number) => {
            let field = null;
            const { value, error } = formFields[index];
            if (fieldData.type === "textInput") {
                field = (
                    <TextField
                        id={fieldData.name}
                        label={fieldData.name}
                        variant="outlined"
                        value={value}
                        onChange={(event) => handleFieldChange(index, event.target.value)}
                        error={error}
                        helperText={error && "Validation error message"}
                        placeholder={fieldData.placeholder}
                        fullWidth
                        size="small"
                        type={fieldData.password ? "password" : "text"}
                    />
                );
            } else if (fieldData.type === "select" && fieldData.selectItems) {
                const selectItems = fieldData.selectItems.map((item: string, index: number) => (
                    <MenuItem value={item} key={index}>
                        {item}
                    </MenuItem>
                ));

                field = (
                    <Select
                        id={fieldData.name}
                        label={fieldData.name}
                        variant="outlined"
                        value={value}
                        onChange={(event) => handleFieldChange(index, event.target.value)}
                        labelId={fieldData.name}
                        error={error}
                        placeholder={fieldData.placeholder}
                        fullWidth
                        size="small"
                    >
                        {selectItems}
                    </Select>
                );
            } else if (fieldData.type === "multiline") {
                field = (
                    <TextField
                        id={fieldData.name}
                        label={fieldData.name}
                        variant="outlined"
                        value={value}
                        onChange={(event) => handleFieldChange(index, event.target.value)}
                        error={error}
                        helperText={error && "Validation error message"}
                        placeholder={fieldData.placeholder}
                        fullWidth
                        size="small"
                        type={fieldData.password ? "password" : "text"}
                        multiline={true}
                        rows={4}
                    />
                );
            }

            return (
                <div key={index} className={styles.content_fields_field}>
                    {field}
                </div>
            );
        });
    };

    const isFormValid = formFields.some((field) => field.error);

    return (
        <Dialog open={props.open} onClose={props.onCancel} className={styles.content} hideBackdrop={props.hideBackDrop}>
            <div className={styles.content_title}>
                <h1>{props.title}</h1>
            </div>
            <div className={styles.content_fields}>{renderFields()}</div>
            <div className={styles.content_buttons}>
                <button onClick={handleSubmit} className={styles.content_buttons_button} disabled={isFormValid}>
                    {props.isLoading ? <><LoadingSVG /> Loading... </> : props.submitButtonText}
                </button>
                {!props.hideCancelButton ? (
                    <button
                        onClick={() => {
                            resetForm();
                            if (props.onCancel !== undefined) props.onCancel();
                        }}
                        className={styles.content_buttons_button}
                    >
                        {props.onCancelButtonText}
                    </button>
                ) : null}
            </div>
        </Dialog>
    );
};

export default PopUpFormTemplate2;
