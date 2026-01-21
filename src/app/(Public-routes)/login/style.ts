import { Button, Input, Typography } from "antd";
import Link from "next/link";
import styled from "styled-components";

export const BoxLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 350px;
  border-radius: 15px;
  box-shadow: 0px 1px 20px 1px #ecebeb;
  background: #fff;

  .ant-form-item {
    margin-bottom: 8px;
  }
`;

export const Title = styled(Typography)`
    color: #525252;
    margin-bottom: 30px;
    font-weight: 500;
`;

export const InputLogin = styled(Input)`
  /* width: 100%; */
`;

export const ButtonLogin = styled(Button)`
  width: 100%;
  background: #5cb85c;
  border-radius: 15px;
  color: #fff;
  margin-top: 8px;

  &:hover {
    background: red;
  }
`;

export const LinkForgotPassword = styled(Link)`
  text-align: center;
  text-decoration: none;
  color: #337ab7;
  font-size: 14px;
`;

export const NameCompany = styled(Typography)`
  text-align: center;
  color: #cecece;
  margin-bottom: 20px;
`;

export const ContainerLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  background: #f2f2f2;
`;
