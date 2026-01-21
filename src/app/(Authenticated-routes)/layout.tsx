"use client";

import { Layout, Button, Menu, Avatar, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  UnorderedListOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  SafetyOutlined,
  BankOutlined,
  CustomerServiceOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { MenuProps } from "antd";

const { Sider, Content, Header } = Layout;

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("inicio");

  const userMenuItems: MenuProps["items"] = [
    {
      key: "minha-conta",
      label: <a href="#">Minha Conta</a>,
    },
    {
      type: "divider",
    },
    {
      key: "sair",
      label: <a href="#">Sair</a>,
    },
  ];

  const menuItems: MenuProps["items"] = [
    {
      key: "inicio",
      icon: <HomeOutlined />,
      label: <a href="#">Início</a>,
    },
    {
      key: "clientes",
      icon: <TeamOutlined />,
      label: <a href="#">Clientes</a>,
    },
    {
      key: "declarantes",
      icon: <UserOutlined />,
      label: <a href="#">Declarantes</a>,
    },
    {
      key: "licencas",
      icon: <EnvironmentOutlined />,
      label: <a href="#">Licenças</a>,
    },
    {
      key: "mineradoras",
      icon: <ToolOutlined />,
      label: <a href="#">Mineradoras</a>,
    },
    {
      key: "processos",
      icon: <UnorderedListOutlined />,
      label: <a href="#">Processos</a>,
    },
    {
      key: "substancias",
      icon: <ExperimentOutlined />,
      label: <a href="#">Substâncias</a>,
    },
    {
      key: "certificados",
      icon: <FileTextOutlined />,
      label: <a href="#">Certificados</a>,
    },
    {
      key: "relatorios",
      icon: <FileTextOutlined />,
      label: "Relatórios",
      children: [
        {
          key: "relatorio-1",
          label: <a href="#">Relatório 1</a>,
        },
      ],
    },
    {
      type: "group",
      label: "Dados",
      children: [
        {
          key: "base-legal",
          icon: <SafetyOutlined />,
          label: <a href="#">Base Legal</a>,
        },
        {
          key: "dados-empresa",
          icon: <BankOutlined />,
          label: <a href="#">Dados Empresa</a>,
        },
        {
          key: "suporte",
          icon: <CustomerServiceOutlined />,
          label: <a href="#">Suporte</a>,
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={200}
        theme="dark"
      >
        {/* Logo/Marca */}
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            minHeight: collapsed ? "64px" : "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!collapsed && (
            <>
              {/* Espaço para logo */}
              <div
                style={{
                  width: "80px",
                  height: "60px",
                  marginBottom: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                CMB
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
              >
                COOPERATIVA MINERAL DA BAHIA
              </div>
            </>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key as string)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 16px",
                cursor: "pointer",
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <span style={{ color: "#595959", fontSize: "14px" }}>
                Mizael Rodrigo Barreto Duarte
              </span>
              <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
