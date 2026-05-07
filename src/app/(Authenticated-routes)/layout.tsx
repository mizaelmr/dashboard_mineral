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
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { MenuProps } from "antd";
import { ActiveMandateProvider } from "@/contexts/active-mandate-context";
import { removeToken } from "@/lib/auth";

const { Sider, Content, Header } = Layout;

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [authUser, setAuthUser] = useState<{ name: string; tenant_name: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) setAuthUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Determinar a chave selecionada baseada no pathname
  const getSelectedKey = () => {
    if (pathname?.includes("/relatorios/clientes")) return "relatorio-clientes";
    if (pathname?.includes("/relatorios/processos")) return "relatorio-processos";
    if (pathname?.includes("/clientes")) return "clientes";
    if (pathname?.includes("/declarantes")) return "declarantes";
    if (pathname?.includes("/licencas")) return "licencas";
    if (pathname?.includes("/mineradoras")) return "mineradoras";
    if (pathname?.includes("/processos")) return "processos";
    if (pathname?.includes("/substancias")) return "substancias";
    if (pathname?.includes("/certificados")) return "certificados";
    if (pathname?.includes("/presidentes")) return "presidentes";
    if (pathname?.includes("/dados-empresa")) return "dados-empresa";
    if (pathname?.includes("/base-legal")) return "base-legal";
    if (pathname?.includes("/dashboard")) return "inicio";
    return "inicio";
  };

  const selectedKey = getSelectedKey();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "minha-conta",
      label: "Minha Conta",
    },
    {
      type: "divider",
    },
    {
      key: "sair",
      label: "Sair",
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "sair") {
      removeToken();
      localStorage.removeItem('auth_user');
      router.push("/login");
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "inicio",
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Início</Link>,
    },
    {
      key: "clientes",
      icon: <TeamOutlined />,
      label: <Link href="/clientes">Clientes</Link>,
    },
    {
      key: "declarantes",
      icon: <UserOutlined />,
      label: <Link href="/declarantes">Declarantes</Link>,
    },
    {
      key: "presidentes",
      icon: <UserOutlined />,
      label: <Link href="/presidentes">Presidentes</Link>,
    },
    {
      key: "licencas",
      icon: <EnvironmentOutlined />,
      label: <Link href="/licencas">Licenças</Link>,
    },
    {
      key: "mineradoras",
      icon: <ToolOutlined />,
      label: <Link href="/mineradoras">Mineradoras</Link>,
    },
    {
      key: "processos",
      icon: <UnorderedListOutlined />,
      label: <Link href="/processos">Processos</Link>,
    },
    {
      key: "substancias",
      icon: <ExperimentOutlined />,
      label: <Link href="/substancias">Substâncias</Link>,
    },
    {
      key: "certificados",
      icon: <FileTextOutlined />,
      label: <Link href="/certificados">Certificados</Link>,
    },
    {
      key: "relatorios",
      icon: <FileTextOutlined />,
      label: "Relatórios",
      children: [
        {
          key: "relatorio-clientes",
          label: <Link href="/relatorios/clientes">Clientes</Link>,
        },
        {
          key: "relatorio-processos",
          label: <Link href="/relatorios/processos">Processos</Link>,
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
          label: <Link href="/base-legal">Base Legal</Link>,
        },
        {
          key: "dados-empresa",
          icon: <BankOutlined />,
          label: <Link href="/dados-empresa">Dados Empresa</Link>,
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
    <ActiveMandateProvider>
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
                {authUser?.tenant_name?.toUpperCase() ?? ''}
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
          onClick={({ key }) => {
            if (key === "clientes") {
              router.push("/clientes");
            } else if (key === "declarantes") {
              router.push("/declarantes");
            } else if (key === "licencas") {
              router.push("/licencas");
            } else if (key === "mineradoras") {
              router.push("/mineradoras");
            } else if (key === "processos") {
              router.push("/processos");
            } else if (key === "substancias") {
              router.push("/substancias");
            } else if (key === "certificados") {
              router.push("/certificados");
            } else if (key === "presidentes") {
              router.push("/presidentes");
            } else if (key === "dados-empresa") {
              router.push("/dados-empresa");
            } else if (key === "base-legal") {
              router.push("/base-legal");
            } else if (key === "inicio") {
              router.push("/dashboard");
            }
          }}
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
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
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
                {authUser?.name ?? ''}
              </span>
              <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
      </Layout>
    </ActiveMandateProvider>
  );
}
