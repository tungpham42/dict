// components/SearchBar.tsx
import React from "react";
import { Input, Button, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

interface SearchBarProps {
  onSearch: (value: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  return (
    <div style={{ marginBottom: "40px", textAlign: "center" }}>
      <Title
        level={2}
        style={{
          fontFamily: "'Merriweather', serif",
          color: "#3E2723",
          marginBottom: 8,
        }}
      >
        Word Lookup
      </Title>
      <Text
        type="secondary"
        style={{ display: "block", marginBottom: 24, fontSize: "16px" }}
      >
        Discover meanings, synonyms, and pronunciations.
      </Text>

      <div
        style={{
          boxShadow: "0 4px 20px rgba(139, 94, 60, 0.15)",
          borderRadius: "8px",
        }}
      >
        <Search
          placeholder="e.g. 'Serendipity'"
          allowClear
          enterButton={
            <Button
              type="primary"
              style={{ height: "50px", padding: "0 30px" }}
            >
              <SearchOutlined /> Search
            </Button>
          }
          size="large"
          onSearch={onSearch}
          loading={loading}
          style={{ height: "50px" }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
