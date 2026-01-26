"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Form, message, Input } from "antd";
import Image from "next/image";
import {
  BoxLogin,
  ButtonLogin,
  ContainerLogin,
  InputLogin,
  LinkForgotPassword,
  NameCompany,
  Title,
} from "./style";
import { login } from "./actions";
import { setToken } from "@/lib/auth";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const FormLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });
      
      setToken(response.accessToken);
      message.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxLogin>
      <Image src="/logo_login.png" alt="Logo Mineral" width={193} height={81} />
      <Title>COOPERATIVA MINERAL DA BAHIA</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 800, width: "100%" }}
        labelCol={{ style: { fontWeight: "bold" } }}
        onFinish={onFinish}
      >
        <Form.Item 
          label="E-mail" 
          name="email" 
          rules={[
            { required: true, message: "Por favor, coloque seu e-mail!" },
            { type: "email", message: "E-mail inválido!" }
          ]}
        >
          <InputLogin type="email" />
        </Form.Item>
        <Form.Item 
          label="Senha" 
          name="password" 
          rules={[{ required: true, message: "Por favor, coloque sua senha!" }]}
        >
          <Input.Password style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <ButtonLogin type="primary" htmlType="submit" loading={loading}>
            Entra
          </ButtonLogin>
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Checkbox>Lembrar-me</Checkbox>
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkForgotPassword href="/forgot-password">
            Esqueceu sua senha?
          </LinkForgotPassword>
        </Form.Item>
      </Form>
      <NameCompany>Tecvalle - Soluções em Sistemas</NameCompany>
    </BoxLogin>
  );
};

export default function Login() {
  return (
    <ContainerLogin>
      <FormLogin />
    </ContainerLogin>
  );
}
