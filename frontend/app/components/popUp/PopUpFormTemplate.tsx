import React, { useState } from "react";
import { Dialog, MenuItem, Select, TextField } from "@mui/material";
import styles from "./styles/PopUpFormTemplate.module.scss";
import LoadingSVG from "../loadingPage/LoadingSVG";

interface IField {
    type: "textInput" | "select";
    name: string;
    placeholder: string;
    value: string;
    onChange: (event: any, child?: any) => void;
    error?: boolean;
    errorMessage?: string;
    selectItems?: string[];
    password?: boolean;
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
    };
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

const PopUpFormTemplate: React.FC<IPopUpFormProps> = (props: IPopUpFormProps) => {
    // const [loading, setFormFields] = useState<IField[]>(props.fields);

    // const handleFieldChange = (event: any, index: number) => {
    //     const updatedFields = [...formFields];
    //     updatedFields[index].value = event.target.value;
    //     setFormFields(updatedFields);
    // };

    // const validateForm = () => {
    //     const updatedFields = [...formFields];
    //     let formIsValid = false;

    //     updatedFields.forEach((field) => {
    //         field.error = false;
    //         field.errorMessage = "";

    //         if (field.validation?.required && field.value.trim() === "") {
    //             field.error = true;
    //             field.errorMessage = "This field is required.";
    //             formIsValid = false;
    //         }

    //         if (field.validation?.minLength && field.value.length < field.validation.minLength) {
    //             field.error = true;
    //             field.errorMessage = `Minimum length should be ${field.validation.minLength}.`;
    //             formIsValid = false;
    //         }

    //         if (field.validation?.maxLength && field.value.length > field.validation.maxLength) {
    //             field.error = true;
    //             field.errorMessage = `Maximum length should be ${field.validation.maxLength}.`;
    //             formIsValid = false;
    //         }
    //     });

    //     setFormFields(updatedFields);
    //     return formIsValid;
    // };

    const resetForm = () => {
        const resetFields = props.fields.map((field) => {
            field.onChange("");
            return ({
                ...field,
                value: "",
                error: false,
            })
        });
        // setFormFields(resetFields);
    };

    const handleSubmit = () => {
        props.onSubmit();
        // if (validateForm()) {
        //     resetForm();
        // }
    };

    const renderFields = () => {
        return props.fields.map((fieldData: IField, index: number) => {
            let field = null;
            const { error, errorMessage } = fieldData;
            if (fieldData.type === "textInput") {
                field = (
                    <TextField
                        id={fieldData.name}
                        label={fieldData.name}
                        variant="outlined"
                        value={fieldData.value}
                        onChange={(event) => {
                            fieldData.onChange(event);
                            // handleFieldChange(event, index); // local state
                            // validateForm()
                        }}
                        error={props.fields[index].error}
                        helperText={props.fields[index].error && props.fields[index].errorMessage}
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
                        value={fieldData.value}
                        onChange={(event) => fieldData.onChange(event)}
                        labelId={fieldData.name}
                        error={error}
                        defaultValue="Storage"
                        placeholder={fieldData.placeholder}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="">None</MenuItem>
                        {selectItems}
                    </Select>
                );
            }

            return (
                <div key={index} className={`${styles.content_fields_field} ${error ? styles.error : ""}`}>
                    {field}
                </div>
            );
        });
    };

    const isFormValid = props.fields.some((field) => field.error);

    return (
        <Dialog open={props.open} onClose={props.onCancel} className={styles.content} hideBackdrop={props.hideBackDrop} >
            <div className={styles.content_title}>
                <h1>{props.title}</h1>
            </div>
            <div className={styles.content_fields}>{renderFields()}</div>
            <div className={styles.content_buttons}>
                <button
                    onClick={handleSubmit}
                    className={styles.content_buttons_button}
                    disabled={isFormValid}
                >
                    {props.isLoading ? (<><LoadingSVG /> Loading... </>) : (props.submitButtonText)}
                </button>
                {!props.hideCancelButton ? <button
                    onClick={() => {
                        resetForm();
                        if (props.onCancel !== undefined)
                            props.onCancel();
                    }}
                    className={styles.content_buttons_button}
                >
                    {props.onCancelButtonText}
                </button> : null}
            </div>
        </Dialog >
    );
};

export default PopUpFormTemplate;