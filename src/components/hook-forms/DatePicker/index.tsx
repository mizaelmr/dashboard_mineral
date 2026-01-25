"use client";

import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { DatePicker as AntDatePicker } from "antd";
import type { DatePickerProps as AntDatePickerProps } from "antd";

export type HookFormDatePickerProps = Omit<ControllerProps, "render"> & {
  label?: string;
} & Omit<AntDatePickerProps, "value" | "onChange" | "onBlur" | "ref" | "name">;

const HookFormDatePickerInner = (props: HookFormDatePickerProps) => {
  const { name, control, label, rules, defaultValue, shouldUnregister, ...rest } = props;

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
            <AntDatePicker
              {...rest}
              {...fieldProps}
              ref={ref}
              id={name}
              value={fieldProps.value}
              onChange={(date, dateString) => fieldProps.onChange(date)}
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

export const HookFormDatePicker = HookFormDatePickerInner;
