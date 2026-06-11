// Components
import Input from "./Input";
import InputPwd from "./InputPwd";
import InputOtp from "./InputOtp";
import InputTel from "./InputTel";
import InputSearch from "./InputSearch";
import InputPrice from "./InputPrice";
import InputFile from "./InputFile";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/shadcn/field";

const InputComponent = ({ ...props }) => {
  if (props.type === "password") return <InputPwd {...props} />;
  if (props.type === "otp") return <InputOtp {...props} />;
  if (props.type === "tel") return <InputTel {...props} />;
  if (props.type === "search") return <InputSearch {...props} />;
  if (props.type === "price") return <InputPrice {...props} />;
  if (props.type === "file") return <InputFile {...props} />;
  return <Input {...props} />;
};

const InputField = ({
  id = "",
  name = "",
  label = "",
  className = "",
  description = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <Field data-disabled={props.disabled} className={className}>
      {label && (
        <FieldLabel htmlFor={id || name} className="max-w-max">
          {label}
          {props.required && <span className="text-primary">*</span>}
        </FieldLabel>
      )}
      <InputComponent
        name={name}
        id={id || name}
        className={inputClassName}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
};

export default InputField;
