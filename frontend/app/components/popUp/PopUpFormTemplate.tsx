import React from "react";
import { Dialog, DialogActions, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import styles from './styles/PopUpFormTemplate.module.scss';

interface IField {
  type: "textInput" | "select";
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: any, child?: React.ReactNode) => void;
  error?: boolean;
  errorMessage?: string;
  selectItems?: string[];
}

interface IPopUpFormProps {
  open: boolean;
  title: string;
  fields: IField[];
  submitButtonText: string;
  onSubmit: () => void;
  onCancel: () => void;
  onCancelButtonText: string;
}

const PopUpFormTemplate: React.FC<IPopUpFormProps> = (props: IPopUpFormProps) => {
  const renderFields = () => {
    return props.fields.map((fieldData: IField, index: number) => {
      let field = null;

      if (fieldData.type === "textInput") {
        field = (
          <TextField
            id={fieldData.name}
            label={fieldData.name}
            variant="outlined"
            value={fieldData.value}
            onChange={fieldData.onChange}
            error={fieldData.error}
            placeholder={fieldData.placeholder}
            fullWidth
            size="small"
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
            labelId={fieldData.name}
            variant="outlined"
            defaultValue="Tank"
            id={fieldData.name}
            value={fieldData.value}
            label={fieldData.name}
            onChange={fieldData.onChange}
          >
            {selectItems}
          </Select>
        );
      }

      return (
        <div key={index} className={styles.content_fields_field}>
          {field}
        </div>
      );
    });
  };

  return (
    <Dialog open={props.open} onClose={props.onCancel} className={styles.content}>
      <div className={styles.content_title}>
        <h1>{props.title}</h1>
      </div>
      <div className={styles.content_fields}>{renderFields()}</div>
      <div className={styles.content_buttons}>
        <DialogActions>
          <button onClick={props.onSubmit}>{props.submitButtonText}</button>
          <button onClick={props.onCancel}>{props.onCancelButtonText}</button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default PopUpFormTemplate;
