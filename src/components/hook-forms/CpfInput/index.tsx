"use client";

import React from "react";
import { Controller, ControllerProps, FieldValues, FieldPath } from "react-hook-form";
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";
import { formatCpf } from "@/utils/documents";

export type HookFormCpfInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string;
} & Omit<AntInputProps, "value" | "onChange" | "onBlur" | "ref" | "name">;

function HookFormCpfInputInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: HookFormCpfInputProps<TFieldValues, TName>) {
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
            onChange={(e) => onChange(formatCpf(e.target.value))}
            status={fieldState.invalid ? "error" : undefined}
            placeholder="000.000.000-00"
            maxLength={14}
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

export const HookFormCpfInput = HookFormCpfInputInner;
