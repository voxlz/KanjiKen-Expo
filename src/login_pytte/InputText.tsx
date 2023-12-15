import React, { useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { capitalize } from "../../views/UserRegisterView";
import { BorderBox } from "../LoginHelperComponents";
import SelectList from "./SelectList";

interface Props<Form extends FieldValues> {
  register: UseFormRegister<Form>;
  setValue?: UseFormSetValue<Form>;
  errors: { [Property in keyof Form as string]: FieldError | undefined };
  field: Path<Form>;
  label?: string;
  number?: boolean;
  subject?: string;
  onBlur?: () => void;
  className?: string;
  predictions?: string[];
  focus?: () => void;
}

// Redeclare forwardRef to fix typing issue
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const InputText = <Form extends FieldValues>({
  register,
  field,
  errors,
  className,
  label,
  subject,
  number,
  predictions,
  onBlur,
  setValue,
}: Props<Form>) => {
  const error = errors[field as Path<Form>];
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectIndex, setSelectIndex] = useState(predictions ? 0 : -1);

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Tab" || e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (
        predictions &&
        predictions.length !== 0 &&
        showAutocomplete &&
        selectIndex < predictions.length &&
        selectIndex >= -1
      ) {
        const minus = Math.max(selectIndex - 1, -1);
        if (e.shiftKey || e.key === "ArrowUp") {
          if (minus !== -1) {
            setSelectIndex(minus);
            e.preventDefault();
          } else {
            setShowAutocomplete(false);
            setSelectIndex(-1);
          }
        } else {
          if (selectIndex + 1 !== predictions.length) {
            setSelectIndex(selectIndex + 1);
            e.preventDefault();
          } else {
            setSelectIndex(-1);
          }
        }
      } else {
        setShowAutocomplete(false);
        setSelectIndex(-1);
      }
    } else if (e.key === "Enter") {
      if (selectIndex !== -1) {
        console.log(
          "selectIndex",
          selectIndex,
          field,
          predictions?.[selectIndex] ?? ""
        );
        e.preventDefault();

        // Only set value if there is prediction, don't clear field.
        if (predictions?.[selectIndex])
          setValue?.(field, predictions[selectIndex] as any);

        setShowAutocomplete(false);
        setSelectIndex(-1);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowAutocomplete(false);
      setSelectIndex(-1);
    }
  };
  /** messes up pressing enter atm */
  // useEffect(() => {
  //   if (predictions) {
  //     console.log("set select index if predictions change", predictions)
  //     setSelectIndex(0)
  //   }
  // }, [predictions])

  return (
    <div className="flex w-full flex-col ">
      <BorderBox error={!!error} className="group w-full select-none ">
        <input
          pattern={number ? "[0-9.]+" : undefined}
          onKeyDown={handleInput}
          onFocus={() => setShowAutocomplete(true)}
          autoComplete="off"
          autoCapitalize="off"
          className={
            "focus:outline-none w-full border-0 bg-background ring-0  dark:bg-black dark:text-white " +
            className
          }
          placeholder={label ?? capitalize(field)}
          type={field}
          {...register(field as Path<Form>, {
            required: (label ?? capitalize(field)) + " is required",
            validate: number ? (value) => !Number.isNaN(value) : undefined,
            valueAsNumber: number,
            onBlur: () => {
              setShowAutocomplete(false);
              onBlur?.();
            },
          })}
        />
      </BorderBox>
      {predictions && predictions.length !== 0 && showAutocomplete && (
        <div className="relative z-20 ">
          <SelectList
            list={predictions}
            selected={selectIndex}
            onSelect={(selected) => setValue?.(field, selected as any)}
          />
        </div>
      )}
      {error && error.type !== "validate" && (
        <p className="mt-2 text-sm font-bold text-red-800">{error?.message}</p>
      )}
      {error && error.type === "validate" && (
        <p className="mt-2 text-sm font-bold text-red-800">Not a number</p>
      )}
    </div>
  );
};

export default InputText;
