"use client";

import React from "react";
import { Controller, ControllerProps, FieldValues, FieldPath } from "react-hook-form";
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";
import { formatCnpj } from "@/utils/documents";

export type HookFormCnpjInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string;
} & Omit<AntInputProps, "value" | "onChange" | "onBlur" | "ref" | "name">;

function HookFormCnpjInputInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: HookFormCnpjInputProps<TFieldValues, TName>) {
  const { name, control, label, rules, defaultValue, shouldUnregister, ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { ref, onChange, ...fieldProps }, fieldState }) => (
        <div>
          {label != null && (
            <label htmlFor={name} style={{ display: "block", marginBottom: 4 }}>
              {label}
            </label>
          )}
          <AntInput
            {...fieldProps}
            {...rest}
            ref={ref}
            id={name}
            value={fieldProps.value ?? ""}
            onChange={(e) => onChange(formatCnpj(e.target.value))}
            status={fieldState.invalid ? "error" : undefined}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
          {fieldState.error?.message != null && (
            <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}

export const HookFormCnpjInput = HookFormCnpjInputInner;
