'use client'
import React from 'react';
import { Form, Input, Modal, Select, Switch } from 'antd';
//@ts-ignore
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface BaseFormField<T> {
    key: keyof T;
    label?: string;
    required?: boolean;
    defaultValue?: T[keyof T];
}

interface TextFormField<T> extends BaseFormField<T> {
    type: 'text';
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

interface NumberFormField<T> extends BaseFormField<T> {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
}

interface BooleanFormField<T> extends BaseFormField<T> {
    type: 'boolean';
}

interface EmailFormField<T> extends BaseFormField<T> {
    type: 'email';
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

interface PasswordFormField<T> extends BaseFormField<T> {
    type: 'password';
}

interface MultitextFormField<T> extends BaseFormField<T> {
    type: 'multitext';
    rows?: number;
    autosize?: boolean;
}

interface SelectFormField<T> extends BaseFormField<T> {
    type: 'select';
    selectItems?: { label: string; value: string | number }[];
}

type IFormField<T> =
    | TextFormField<T>
    | NumberFormField<T>
    | BooleanFormField<T>
    | EmailFormField<T>
    | PasswordFormField<T>
    | MultitextFormField<T>
    | SelectFormField<T>;

interface CustomFormProps<T> {
    open: boolean;
    title: string | React.ReactNode;
    fields: IFormField<T>[];
    onAccept: (fields: T) => void;
    acceptText: string;
    onCancel: () => void;
    cancelText: string;

    closable?: boolean;
    headerClassName?: string;
    bodyClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
}

const CustomForm = <T extends Record<string, any>>(props: CustomFormProps<T>) => {
    const [form] = Form.useForm();
    const { title, fields, onAccept: onSubmit, onCancel } = props;

    const accept = async () => {
        try {
            await form.validateFields();
            const values = await form.getFieldsValue(fields.flatMap(f => [f.key]));
            onSubmit(values as T);
        } catch (err) {
            console.error('Validation Error:', err);
        }
    };

    const cancel = () => {
        onCancel && onCancel();
    };

    return (
        <>
            <Modal
                title={title}
                classNames={{
                    wrapper: "custom-form-default",
                    mask: "mask-default",
                    content: `content-default ${props.contentClassName ?? ""}`,
                    header: `header-default ${props.headerClassName ?? ""}`,
                    body: `body-default ${props.bodyClassName ?? ""}`,
                    footer: `footer-default ${props.footerClassName ?? ""}`,
                }}
                open={props.open}
                onOk={accept}
                okText={props.acceptText}
                onCancel={cancel}
                cancelText={props.cancelText}
                mask={props.closable}
                maskClosable={props.closable}
                closable={props.closable}
                closeIcon={props.closable}
            >
                <Form form={form} layout="horizontal" variant="outlined">
                    {fields.map((field) => {
                        switch (field.type) {
                            case 'text':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[{ required: field.required, message: `${field.label} is required` }]}
                                    >
                                        <Input
                                            placeholder={field.label}
                                            prefix={field.prefix}
                                            suffix={field.suffix}
                                            defaultValue={field.defaultValue}
                                        />
                                    </Form.Item>
                                );
                            case 'number':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[
                                            { required: field.required, message: `${field.label} is required` },
                                            { type: 'number', min: field.min, max: field.max },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder={field.label}
                                            step={field.step}
                                            defaultValue={field.defaultValue}
                                        />
                                    </Form.Item>
                                );
                            case 'boolean':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        label={field.label}
                                        valuePropName="checked"
                                        rules={[{ required: field.required, message: `${field.label} is required` }]}
                                    >
                                        <Switch defaultValue={field.defaultValue} />
                                    </Form.Item>
                                );
                            case 'email':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[
                                            { required: true, message: `${field.label} is required` },
                                            { type: 'email', message: 'Invalid email address' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder={field.label}
                                            suffix={field.suffix}
                                            defaultValue={field.defaultValue}
                                        />
                                    </Form.Item>
                                );
                            case 'password':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[{ required: true, message: `${field.label} is required` }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            placeholder={field.label}
                                            defaultValue={field.defaultValue}
                                        />
                                    </Form.Item>
                                );
                            case 'multitext':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[{ required: field.required, message: `${field.label} is required` }]}
                                    >
                                        <TextArea
                                            placeholder={field.label}
                                            rows={field.rows}
                                            autoSize={field.autosize}
                                            defaultValue={field.defaultValue}
                                        />
                                    </Form.Item>
                                );
                            case 'select':
                                return (
                                    <Form.Item
                                        key={field.key as string}
                                        name={field.key as string}
                                        rules={[{ required: field.required, message: `${field.label} is required` }]}
                                    >
                                        <Select placeholder={field.label} defaultValue={field.defaultValue}>
                                            {field.selectItems?.map((option, index) => (
                                                <Select.Option key={index} value={option.value}>
                                                    {option.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            default:
                                return null;
                        }
                    })}
                </Form>
            </Modal>
        </>
    );
};

export default CustomForm;

interface ITextFieldProps {
    key: string;
    label: string;
    type: "text" | "number" | "email" | "password";
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    rules?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
    };
}

const TextField: React.FC<ITextFieldProps> = (props: ITextFieldProps) => {
    return (
        <Form.Item key={props.key} name={props.key} label={props.label} rules={[props.rules]}>
            <Input
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.onChange?.(e.target.value)}
            />
        </Form.Item>
    );
};

interface IBooleanFieldProps {
    key: string;
    label: string;
    value: boolean;
}

const BooleanField: React.FunctionComponent<IBooleanFieldProps> = React.memo((props: IBooleanFieldProps) => {
    const { key, label, value } = props;

    return (
        <Form.Item
            key={key}
            name={key}
            label={label}
        >
            <Switch
                checked={value}
            // onChange={(checked) => onChange(checked.toString())}
            />
        </Form.Item >
    );
});

interface IMultitextFieldProps {
    key: string;
    label: string;
    placeholder?: string;
    rows: number;
}

const MultitextField: React.FC<IMultitextFieldProps> = ({ key, label, placeholder, rows }) => {
    return (
        <Form.Item key={key} name={key} label={label}>
            <TextArea placeholder={placeholder} rows={rows} variant={"outlined"} />
        </Form.Item>
    );
};

interface ISelectFieldProps {
    key: string;
    label: string;
    placeholder?: string;
    selectItems?: { label: string; value: string | number }[];
}

const SelectField: React.FC<ISelectFieldProps> = ({ key, label, placeholder, selectItems }) => {
    return (
        <Form.Item key={key} name={key} label={label}>
            <Select placeholder={placeholder} variant={"outlined"}>
                {selectItems?.map((option, index) => (
                    <Select.Option key={index} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
};

const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 24 },
    },
};