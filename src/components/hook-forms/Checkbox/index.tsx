"use client";

import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { Checkbox as AntCheckbox } from "antd";
import type { CheckboxProps as AntCheckboxProps } from "antd";

export type HookFormCheckboxProps = Omit<ControllerProps, "render"> & {
  label?: string;
} & Omit<AntCheckboxProps, "checked" | "onChange" | "onBlur" | "ref" | "name">;

const HookFormCheckboxInner = (props: HookFormCheckboxProps) => {
  const { name, control, label, rules, defaultValue, shouldUnregister, children, ...rest } = props;

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
            <AntCheckbox
              {...rest}
              ref={ref}
              id={name}
              name={fieldProps.name}
              checked={!!fieldProps.value}
              onChange={(e) => fieldProps.onChange(e.target.checked)}
              onBlur={fieldProps.onBlur}
            >
              {children}
            </AntCheckbox>
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

export const HookFormCheckbox = HookFormCheckboxInner;
