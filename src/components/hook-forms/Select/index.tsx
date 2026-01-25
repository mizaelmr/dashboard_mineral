"use client";

import React from "react";
import { Controller, ControllerProps, FieldValues, FieldPath } from "react-hook-form";
import { Select as AntSelect } from "antd";
import type { SelectProps as AntSelectProps } from "antd";

export interface SelectOption {
  value: string;
  label: string;
}

export type HookFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string;
  options: SelectOption[];
} & Omit<AntSelectProps, "value" | "onChange" | "onBlur" | "ref" | "name" | "options">;

function HookFormSelectInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: HookFormSelectProps<TFieldValues, TName>) {
  const { name, control, label, options, rules, defaultValue, shouldUnregister, ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { ref, ...fieldProps }, fieldState }) => {
        return (
          <div>
            {label != null && (
              <label htmlFor={name} style={{ display: "block", marginBottom: 4 }}>
                {label}
              </label>
            )}
            <AntSelect
              {...rest}
              {...fieldProps}
              options={options}
              ref={ref}
              id={name}
              value={fieldProps.value}
              onChange={fieldProps.onChange}
              onBlur={fieldProps.onBlur}
              status={fieldState.invalid ? "error" : undefined}
            />
            {fieldState.error?.message != null && (
              <span style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4, display: "block" }}>
                {fieldState.error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export const HookFormSelect = HookFormSelectInner;
