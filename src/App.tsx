import React, { useState } from "react";
import axios from "axios";
import {
  Layout,
  Alert,
  Space,
  Empty,
  Spin,
  ConfigProvider,
  Tag,
  Tabs,
} from "antd";
import { MWEntry, MWThesaurusEntry } from "./types";
import AppHeader from "./components/AppHeader";
import SearchBar from "./components/SearchBar";
import WordCard from "./components/WordCard";
import ThesaurusCard from "./components/ThesaurusCard"; // Import new component

const { Content, Footer } = Layout;

// Theme Config (Same as before)
const academicTheme = {
  token: {
    colorPrimary: "#8B5E3C",
    colorInfo: "#8B5E3C",
    colorBgLayout: "#fdfbf7",
    colorTextHeading: "#2c3e50",
    fontFamily: "'Inter', sans-serif",
    borderRadius: 8,
  },
  components: {
    Layout: { headerBg: "#3E2723" },
    Card: { headerFontSize: 24 },
    Typography: { fontFamilyCode: "'Merriweather', serif" },
    Tabs: {
      inkBarColor: "#8B5E3C",
      itemActiveColor: "#8B5E3C",
      itemSelectedColor: "#8B5E3C",
      itemHoverColor: "#6D4C41",
      titleFontSize: 16,
    },
  },
};

const App: React.FC = () => {
  // --- STATE ---
  const [dictionaryData, setDictionaryData] = useState<MWEntry[] | null>(null);
  const [thesaurusData, setThesaurusData] = useState<MWThesaurusEntry[] | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Controls the active tab (Dictionary vs Thesaurus)
  const [activeTab, setActiveTab] = useState<string>("1");

  // --- API KEYS ---
  const DICT_KEY = process.env.REACT_APP_MW_DICT_API_KEY;
  const THESAURUS_KEY = process.env.REACT_APP_MW_THESAURUS_API_KEY;

  const fetchDefinition = async (word: string) => {
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    setDictionaryData(null);
    setThesaurusData(null);
    setSuggestions([]);
    setActiveTab("1");

    try {
      // 1. Fetch BOTH APIs in parallel
      const [dictResponse, thesResponse] = await Promise.all([
        axios.get(
          `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${DICT_KEY}`
        ),
        axios.get(
          `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${THESAURUS_KEY}`
        ),
      ]);

      const dictResult = dictResponse.data;
      const thesResult = thesResponse.data;

      // 2. Handle Dictionary Logic
      if (dictResult.length === 0) {
        setError("No definitions found.");
      } else if (typeof dictResult[0] === "string") {
        setSuggestions(dictResult as string[]);
        setError("Word not found. Did you mean one of these?");
      } else {
        setDictionaryData(dictResult);
      }

      // 3. Handle Thesaurus Logic (Only if dictionary found something or if thesaurus has valid objects)
      if (thesResult.length > 0 && typeof thesResult[0] !== "string") {
        setThesaurusData(thesResult);
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- TAB CONTENT RENDERER ---
  const renderContent = () => {
    const items = [
      {
        key: "1",
        label: `Dictionary`,
        children: dictionaryData ? (
          <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            {dictionaryData.map((entry, index) =>
              entry.shortdef ? (
                <WordCard key={entry.meta.uuid || index} entry={entry} />
              ) : null
            )}
          </Space>
        ) : (
          <Empty description="No dictionary entries" />
        ),
      },
      {
        key: "2",
        label: `Thesaurus`,
        children: thesaurusData ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {thesaurusData.map((entry, index) => (
              <ThesaurusCard
                key={entry.meta.uuid || index}
                entry={entry}
                onTermClick={fetchDefinition}
              />
            ))}
          </Space>
        ) : (
          <Empty description="No thesaurus entries found for this word" />
        ),
      },
    ];

    return (
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ marginTop: 20 }}
      />
    );
  };

  return (
    <ConfigProvider theme={academicTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />

        <Content
          style={{
            padding: "40px 20px",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <SearchBar onSearch={fetchDefinition} loading={loading} />

          {/* Suggestions & Errors */}
          {error && (
            <div style={{ marginBottom: 20 }}>
              <Alert
                message={error}
                type="warning"
                showIcon
                style={{ marginBottom: 15 }}
              />
              {suggestions.length > 0 && (
                <div style={{ padding: "0 10px" }}>
                  <div
                    style={{
                      marginBottom: 8,
                      fontStyle: "italic",
                      color: "#8d6e63",
                    }}
                  >
                    Suggested spellings:
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {suggestions.map((s, index) => (
                      <Tag
                        key={`${s}-${index}`}
                        color="orange"
                        style={{ cursor: "pointer", padding: "5px 12px" }}
                        onClick={() => fetchDefinition(s)}
                      >
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Loading or Data */}
          {loading && !dictionaryData ? (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Spin size="large" tip="Consulting the archives..." />
            </div>
          ) : (
            // Only show tabs if we have data or if not loading
            (dictionaryData || thesaurusData) && renderContent()
          )}

          {!dictionaryData && !loading && !error && (
            <div style={{ marginTop: 60 }}>
              <Empty
                description={
                  <span
                    style={{ fontFamily: "Merriweather", color: "#8d6e63" }}
                  >
                    Enter a word to consult the full library...
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "transparent",
            color: "#8d6e63",
          }}
        >
          &copy; {new Date().getFullYear()} proudly based on Merriam-Webster
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
