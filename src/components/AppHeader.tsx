// components/AppHeader.tsx
import React from "react";
import { Layout, Typography, Space } from "antd";
import { ReadOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#3E2723", // Dark Oak
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        height: "64px",
      }}
    >
      <Space size="middle">
        <ReadOutlined style={{ color: "#EFEBE9", fontSize: "24px" }} />
        <Title
          level={3}
          style={{
            color: "#EFEBE9", // Soft Grey/White
            margin: 0,
            fontFamily: "'Merriweather', serif",
            fontWeight: 300,
            letterSpacing: "1px",
          }}
        >
          English Dictionary
        </Title>
      </Space>
    </Header>
  );
};

export default AppHeader;
