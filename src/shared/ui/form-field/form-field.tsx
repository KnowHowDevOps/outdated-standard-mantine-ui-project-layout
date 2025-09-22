import {
  TextInput,
  PasswordInput,
  Textarea,
  Select,
  MultiSelect,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface BaseFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  form: UseFormReturnType<any>;
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: "text" | "email" | "tel" | "url";
}

interface PasswordFormFieldProps extends BaseFormFieldProps {
  type: "password";
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: "textarea";
  rows?: number;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: "select";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
}

interface MultiSelectFormFieldProps extends BaseFormFieldProps {
  type: "multiselect";
  data: Array<{ value: string; label: string }>;
  searchable?: boolean;
  clearable?: boolean;
}

type FormFieldProps =
  | TextFormFieldProps
  | PasswordFormFieldProps
  | TextareaFormFieldProps
  | SelectFormFieldProps
  | MultiSelectFormFieldProps;

export function FormField(props: FormFieldProps) {
  const {
    name,
    label,
    placeholder,
    required,
    disabled,
    description,
    form,
    type,
  } = props;

  const baseProps = {
    label,
    placeholder,
    required,
    disabled,
    description,
    ...form.getInputProps(name),
  };

  switch (type) {
    case "text":
    case "email":
    case "tel":
    case "url":
      return <TextInput {...baseProps} type={type} />;

    case "password":
      return (
        <PasswordInput
          {...baseProps}
          visible={(props as PasswordFormFieldProps).visible}
          onVisibilityChange={
            (props as PasswordFormFieldProps).onVisibilityChange
          }
        />
      );

    case "textarea":
      { const textareaProps = props as TextareaFormFieldProps;
      return (
        <Textarea
          {...baseProps}
          rows={textareaProps.rows}
          autosize={textareaProps.autosize}
          minRows={textareaProps.minRows}
          maxRows={textareaProps.maxRows}
        />
      ); }

    case "select":
      { const selectProps = props as SelectFormFieldProps;
      return (
        <Select
          {...baseProps}
          data={selectProps.data}
          searchable={selectProps.searchable}
          clearable={selectProps.clearable}
        />
      ); }

    case "multiselect":
      { const multiSelectProps = props as MultiSelectFormFieldProps;
      return (
        <MultiSelect
          {...baseProps}
          data={multiSelectProps.data}
          searchable={multiSelectProps.searchable}
          clearable={multiSelectProps.clearable}
        />
      ); }

    default:
      return <TextInput {...baseProps} />;
  }
}
