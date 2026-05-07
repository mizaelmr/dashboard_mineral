"use client";

import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { Radio } from "antd";
import type { RadioGroupProps as AntRadioGroupProps } from "antd";

export interface RadioGroupOption {
  value: string;
  label: string;
}

export type HookFormRadioGroupProps = Omit<ControllerProps, "render"> & {
  label?: string;
  options: RadioGroupOption[];
} & Omit<AntRadioGroupProps, "value" | "onChange" | "onBlur" | "name">;

const HookFormRadioGroupInner = (props: HookFormRadioGroupProps) => {
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
            <Radio.Group
              {...rest}
              options={options}
              name={fieldProps.name}
              value={fieldProps.value}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
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

export const HookFormRadioGroup = HookFormRadioGroupInner;
