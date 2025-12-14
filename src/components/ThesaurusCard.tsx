// src/components/ThesaurusCard.tsx
import React from "react";
import { Card, Typography, Tag, Divider, Empty } from "antd";
import { MWThesaurusEntry } from "../types";

const { Title, Text } = Typography;

interface ThesaurusCardProps {
  entry: MWThesaurusEntry;
  onTermClick: (term: string) => void;
}

const ThesaurusCard: React.FC<ThesaurusCardProps> = ({
  entry,
  onTermClick,
}) => {
  // Flatten the arrays (API returns synonyms in groups based on nuance)
  const synonyms = entry.meta.syns ? entry.meta.syns.flat() : [];
  const antonyms = entry.meta.ants ? entry.meta.ants.flat() : [];

  // Clean the ID (remove :1, :2 etc)
  const cleanWord = entry.meta.id.split(":")[0];

  return (
    <Card
      bordered={false}
      style={{
        marginBottom: 20,
        borderRadius: 12,
        background: "#fff8f0", // Slightly warmer background for distinction
        boxShadow: "0 4px 12px rgba(139, 94, 60, 0.1)",
        border: "1px solid #eaddcf",
      }}
    >
      <div style={{ marginBottom: 15 }}>
        <Text
          strong
          style={{
            fontSize: "1.2rem",
            color: "#5d4037",
            fontFamily: "'Merriweather', serif",
          }}
        >
          Thesaurus Entry:
        </Text>
        <Text
          style={{
            fontSize: "1.2rem",
            marginLeft: 8,
            fontStyle: "italic",
            color: "#8B5E3C",
          }}
        >
          {cleanWord} ({entry.fl})
        </Text>
      </div>

      <Text type="secondary" style={{ display: "block", marginBottom: 15 }}>
        Definition: {entry.shortdef[0]}
      </Text>

      <Divider style={{ borderColor: "#d7ccc8", margin: "12px 0" }} />

      {/* Synonyms Section */}
      <div style={{ marginBottom: 20 }}>
        <Title
          level={5}
          style={{
            color: "#2e7d32",
            fontFamily: "'Merriweather', serif",
            marginTop: 0,
          }}
        >
          Synonyms (Similar)
        </Title>
        {synonyms.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {synonyms.map((syn) => (
              <Tag
                key={syn}
                color="#e8f5e9" // Light Green
                style={{
                  color: "#1b5e20",
                  border: "1px solid #c8e6c9",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "4px 10px",
                }}
                onClick={() => onTermClick(syn)}
              >
                {syn}
              </Tag>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No synonyms found"
          />
        )}
      </div>

      {/* Antonyms Section */}
      <div>
        <Title
          level={5}
          style={{ color: "#c62828", fontFamily: "'Merriweather', serif" }}
        >
          Antonyms (Opposite)
        </Title>
        {antonyms.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {antonyms.map((ant) => (
              <Tag
                key={ant}
                color="#ffebee" // Light Red
                style={{
                  color: "#b71c1c",
                  border: "1px solid #ffcdd2",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "4px 10px",
                }}
                onClick={() => onTermClick(ant)}
              >
                {ant}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">No antonyms listed.</Text>
        )}
      </div>
    </Card>
  );
};

export default ThesaurusCard;
