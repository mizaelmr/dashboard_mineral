"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/Table";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Tag,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StarFilled,
  StopOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import {
  activateMandate,
  deactivateActiveMandate,
  deletePresident,
  getAllPresidents,
} from "./actions";
import { mapPresidentToTableRow, PresidentTableRow } from "@/types/president";
import { useActiveMandate } from "@/contexts/active-mandate-context";
import { capitalizeWords } from "@/utils/capitalize";

const PresidentsPage: React.FC = () => {
  const router = useRouter();
  const { activeMandate, loading: activeMandateLoading, refreshActiveMandate } =
    useActiveMandate();

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<PresidentTableRow[]>([]);
  const [activatingPresidentId, setActivatingPresidentId] = useState<number | null>(
    null
  );
  const [activationStartDate, setActivationStartDate] = useState<Dayjs | null>(dayjs());
  const [activationEndDate, setActivationEndDate] = useState<Dayjs | null>(null);
  const [activationPassword, setActivationPassword] = useState("");
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [actionMode, setActionMode] = useState<"activate" | "deactivate">("activate");

  const loadPresidents = useCallback(async () => {
    setLoading(true);
    try {
      const presidents = await getAllPresidents();
      setDataSource(presidents.map(mapPresidentToTableRow));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao carregar presidentes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPresidents();
  }, [loadPresidents]);

  const filteredData = useMemo(
    () =>
      dataSource.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      ),
    [dataSource, searchText]
  );

  const onConfirmActivate = async () => {
    if (!activatingPresidentId) {
      message.error("Selecione um presidente.");
      return;
    }
    if (actionMode === "activate" && !activationStartDate) {
      message.error("Selecione a data de início.");
      return;
    }
    if (!activationPassword.trim()) {
      message.error("Informe sua senha para confirmar.");
      return;
    }
    if (!activationEndDate) {
      message.error("Selecione a data de fim do mandato.");
      return;
    }
    if (
      actionMode === "activate" &&
      activationStartDate &&
      activationEndDate.isBefore(activationStartDate, "day")
    ) {
      message.error("A data de fim deve ser igual ou maior que a data de início.");
      return;
    }

    setActivating(true);
    try {
      if (actionMode === "deactivate") {
        await deactivateActiveMandate({
          endedAt: activationEndDate.format("YYYY-MM-DD"),
          password: activationPassword,
        });
      } else {
        const startedAtValue = activationStartDate?.format("YYYY-MM-DD");
        if (!startedAtValue) {
          message.error("Selecione a data de início.");
          return;
        }
        const activatePayload = {
          presidentId: activatingPresidentId,
          startedAt: startedAtValue,
          endedAt: activationEndDate.format("YYYY-MM-DD"),
          password: activationPassword,
        };
        try {
          await activateMandate(activatePayload);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes("MANDATE_REPLACEMENT_CONFIRMATION_REQUIRED")
          ) {
            Modal.confirm({
              title: "Mandato em sobreposição",
              content:
                "Já existe mandato ativo neste período. Deseja confirmar a substituição imediata?",
              onOk: async () => {
                await activateMandate({
                  ...activatePayload,
                  forceReplace: true,
                });
                await refreshActiveMandate();
                message.success("Substituição de mandato confirmada com sucesso.");
                setActivateModalOpen(false);
                setActivatingPresidentId(null);
                setActivationEndDate(null);
                setActivationPassword("");
                await loadPresidents();
              },
            });
            return;
          }
          throw error;
        }
      }
      await refreshActiveMandate();
      message.success(
        actionMode === "deactivate"
          ? "Mandato encerrado com sucesso."
          : "Presidente ativo atualizado com sucesso."
      );
      setActivateModalOpen(false);
      setActivatingPresidentId(null);
      setActivationEndDate(null);
      setActivationPassword("");
      await loadPresidents();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Falha ao definir presidente ativo."
      );
    } finally {
      setActivating(false);
    }
  };

  const columns: TableColumn<PresidentTableRow>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        const isActive = activeMandate?.presidentId === Number(record.id);
        return (
          <Space>
            {isActive && <StarFilled style={{ color: "#faad14" }} />}
            <strong>{capitalizeWords(String(value))}</strong>
            {isActive && <Tag color="green">Ativo</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        const presidentId = Number(record.id);
        const isActive = activeMandate?.presidentId === presidentId;
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/presidentes/view/${record.id}`)}
            />
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => router.push(`/presidentes/edit/${record.id}`)}
            />
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              disabled={activeMandateLoading}
              onClick={() => {
                setActionMode("activate");
                setActivatingPresidentId(presidentId);
                setActivationStartDate(dayjs());
                setActivationEndDate(null);
                setActivationPassword("");
                setActivateModalOpen(true);
              }}
            />
            {isActive && (
              <Button
                type="link"
                danger
                icon={<StopOutlined />}
                onClick={() => {
                  setActionMode("deactivate");
                  setActivatingPresidentId(presidentId);
                  setActivationStartDate(dayjs());
                  setActivationEndDate(
                    activeMandate?.endedAt
                      ? dayjs(activeMandate.endedAt)
                      : dayjs()
                  );
                  setActivationPassword("");
                  setActivateModalOpen(true);
                }}
              />
            )}
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={isActive}
              title={isActive ? "Não é possível excluir o presidente ativo. Encerre o mandato antes." : undefined}
              onClick={async () => {
                try {
                  await deletePresident(presidentId);
                  message.success("Presidente excluído com sucesso.");
                  await loadPresidents();
                } catch (error) {
                  message.error(
                    error instanceof Error
                      ? error.message
                      : "Falha ao excluir presidente."
                  );
                }
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>Presidentes</h1>
        <Space>
          <Input
            placeholder="Buscar presidentes..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/presidentes/addpresidentes")}
          >
            Novo Presidente
          </Button>
        </Space>
      </div>

      <Table<PresidentTableRow>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} presidentes`,
        }}
        bordered
      />

      <Modal
        title={
          actionMode === "deactivate"
            ? "Encerrar mandato ativo"
            : "Definir presidente ativo"
        }
        open={activateModalOpen}
        onCancel={() => setActivateModalOpen(false)}
        onOk={onConfirmActivate}
        confirmLoading={activating}
      >
        {actionMode === "deactivate" && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: 6,
              fontSize: 13,
              color: "#ad8b00",
            }}
          >
            <strong>Atenção:</strong> Ao encerrar este mandato, não será possível emitir novos certificados até que outro presidente seja definido como ativo. Os certificados já emitidos permanecem válidos.
          </div>
        )}
        {actionMode === "activate" && (
          <>
            <div style={{ marginBottom: 8 }}>Data de início do mandato</div>
            <DatePicker
              value={activationStartDate}
              onChange={(value) => setActivationStartDate(value)}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </>
        )}
        <div style={{ marginTop: 16, marginBottom: 8 }}>Data de fim do mandato</div>
        <DatePicker
          value={activationEndDate}
          onChange={(value) => setActivationEndDate(value)}
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          disabled={actionMode === "deactivate"}
        />
        <div style={{ marginTop: 16, marginBottom: 8 }}>Senha de confirmação</div>
        <Input.Password
          value={activationPassword}
          onChange={(event) => setActivationPassword(event.target.value)}
          placeholder="Digite sua senha de login"
        />
      </Modal>
    </div>
  );
};

export default PresidentsPage;
