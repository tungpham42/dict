// components/WordCard.tsx
import React from "react";
import {
  Card,
  Typography,
  List,
  Divider,
  Button,
  Tooltip,
  Tag,
  Space,
} from "antd";
import { PlayCircleFilled, ClockCircleOutlined } from "@ant-design/icons";
import { MWEntry } from "../types";

const { Title, Text } = Typography;

interface WordCardProps {
  entry: MWEntry;
  onTermClick?: (term: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ entry }) => {
  // --- Helper: Construct M-W Audio URL ---
  const getAudioUrl = (filename?: string) => {
    if (!filename) return null;
    let subdir = "";
    if (filename.startsWith("bix")) subdir = "bix";
    else if (filename.startsWith("gg")) subdir = "gg";
    else if (!isNaN(parseInt(filename.charAt(0)))) subdir = "number";
    else subdir = filename.charAt(0);

    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${filename}.mp3`;
  };

  const pronunciation = entry.hwi.prs?.[0];
  const audioSrc = getAudioUrl(pronunciation?.sound?.audio);
  const writtenPronunciation = pronunciation?.mw;

  const playAudio = () => {
    if (audioSrc) {
      new Audio(audioSrc).play();
    }
  };

  // Clean up the ID (M-W adds numbers like 'run:1', 'run:2')
  const cleanWord = entry.meta.id.split(":")[0];

  return (
    <Card
      bordered={false}
      style={{
        marginBottom: 20,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            fontFamily: "'Merriweather', serif",
            color: "#2c3e50",
            fontSize: "3rem",
          }}
        >
          {cleanWord}
        </Title>

        {/* Written Pronunciation */}
        {writtenPronunciation && (
          <Text
            style={{
              fontSize: "1.2rem",
              color: "#8B5E3C",
              fontFamily: "'Inter', sans-serif",
              fontStyle: "italic",
            }}
          >
            /{writtenPronunciation}/
          </Text>
        )}

        {/* Part of Speech Tag */}
        {entry.fl && (
          <Tag color="#8B5E3C" style={{ marginLeft: 10, alignSelf: "center" }}>
            {entry.fl}
          </Tag>
        )}

        {/* Audio Button */}
        {audioSrc && (
          <Tooltip title="Listen to pronunciation">
            <Button
              type="text"
              shape="circle"
              icon={
                <PlayCircleFilled
                  style={{ fontSize: "32px", color: "#8B5E3C" }}
                />
              }
              onClick={playAudio}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
        )}
      </div>

      <Divider style={{ borderColor: "#eee", margin: "24px 0" }} />

      {/* Definitions */}
      <div style={{ marginBottom: "20px" }}>
        <List
          itemLayout="vertical"
          dataSource={entry.shortdef}
          split={false}
          renderItem={(def, index) => (
            <List.Item style={{ padding: "8px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Text
                  style={{
                    marginRight: 10,
                    color: "#ccc",
                    fontFamily: "serif",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={{
                    fontSize: "1.1rem",
                    color: "#444",
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {def}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Footer: Date & Attribution */}
      <div
        style={{
          marginTop: "30px",
          fontSize: "12px",
          color: "#aaa",
          borderTop: "1px solid #f0f0f0",
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {entry.date && (
          <Space>
            <ClockCircleOutlined />
            <span>First known use: {entry.date}</span>
          </Space>
        )}
        <span>Merriam-Webster API</span>
      </div>
    </Card>
  );
};

export default WordCard;
