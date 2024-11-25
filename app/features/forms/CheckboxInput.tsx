import { FormScope, useField } from "@rvf/remix";

export const CheckboxInput = ({
  scope,
  name,
  label,
  placeholder,
}: {
  scope: FormScope<boolean>;
  name: string;
  label: string;
  placeholder: string;
}) => {
  const { error, getInputProps } = useField(scope);

  return (
    <>
      <label htmlFor={name} className="mb-1 block text-xs font-bold">
        {label}
      </label>
      <input
        {...getInputProps({ id: name, placeholder, type: "checkbox" })}
        className="w-1/2"
      />
      {error ? (
        <span className="text-md mt-1 block text-red-300">{error()}</span>
      ) : null}
    </>
  );
};
