"use client";

import { Checkbox, Form, } from "antd";
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

const FormLogin = () => {
  return (
    <BoxLogin>
        <Image src="/logo_login.png" alt="Logo Mineral" width={193} height={81} />
      <Title>COOPERATIVA MINERAL DA BAHIA</Title>
      <Form
        layout="vertical"
        style={{ maxWidth: 800, width: "100%" }}
        labelCol={{ style: { fontWeight: "bold" } }}
      >
        <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Por favor, coloque seu e-mail!"}]}>
          <InputLogin />
        </Form.Item>
        <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Por favor, coloque sua senha!"}]}>
          <InputLogin />
        </Form.Item>
        <Form.Item>
          <ButtonLogin type="primary" htmlType="submit">Entra</ButtonLogin>
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
