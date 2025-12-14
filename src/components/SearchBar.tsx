import React, { useEffect, useRef, useState } from "react";
import { AutoComplete, Input, Button, Typography, type InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

interface SearchBarProps {
  onSearch: (value: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  // 1. State for autocomplete options
  const [options, setOptions] = useState<
    { value: string; label: React.ReactNode }[]
  >([]);

  // 2. Refs for input and debounce timer
  const searchInputRef = useRef<InputRef>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Focus on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // 3. Fetch suggestions from Datamuse API
  const fetchSuggestions = async (value: string) => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    try {
      // 's' parameter stands for 'suggestion'
      const response = await axios.get(
        `https://api.datamuse.com/sug?s=${value}`
      );

      const suggestions = response.data
        .slice(0, 5)
        .map((item: { word: string }) => ({
          value: item.word,
          label: (
            <span
              style={{ fontFamily: "'Inter', sans-serif", color: "#5d4037" }}
            >
              {item.word}
            </span>
          ),
        }));

      setOptions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // 4. Handle typing with Debounce (wait 300ms before fetching)
  const handleType = (value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // 5. Handle selection from dropdown
  const onSelect = (value: string) => {
    onSearch(value);
  };

  return (
    <div style={{ marginBottom: "40px", textAlign: "center" }}>
      <Title
        level={2}
        style={{
          fontFamily: "'Merriweather', serif",
          color: "#3E2723",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/MW.png"
          alt="Merriam-Webster logo"
          style={{ marginRight: 8 }}
        />
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
        <AutoComplete
          style={{ width: "100%" }}
          options={options}
          onSelect={onSelect}
          onSearch={handleType} // Triggers when user types
          backfill
        >
          <Input.Search
            ref={searchInputRef}
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
            onSearch={onSearch} // Triggers on Enter key or Button click
            loading={loading}
            style={{ height: "50px" }}
          />
        </AutoComplete>
      </div>
    </div>
  );
};

export default SearchBar;
