"use client"

import { RTVIClient } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";
import { DailyTransport } from "realtime-ai-daily";
import { useState } from "react";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const voiceClient = new RTVIClient({
    params: {
      baseUrl: `http://localhost:3000/api`,
      endpoints: {
        connect: "/connect",
        action: "/actions"
      },
      config: [
        {
          service: "tts",
          options: [
            {
              name: "voice", 
              value: "79a125e8-cd45-4c13-8a67-188112f4dd22"
            }
          ]
        },
        {
          service: "llm",
          options: [
            {
              name: "model",
              value: selectedModel
            },
            {
              name: "initial_messages",
              value: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "Hello"
                    },
                  ],
                },
              ],
            },
            {
              name: "run_on_config",
              value: true
            },
          ],
        },
      ],
      requestData: {
        services: {
          tts: "cartesia",
          llm: "openai"
        },
      },
    },
    transport: new DailyTransport(),
    enableMic: true,
    enableCam: false,
    callbacks: {
      onBotReady: () => {
        console.log("Bot is ready!");
      },
    },
  });

  const connectVoiceClient = async () => {
    try {
      await voiceClient.connect();
    } catch (error: unknown) {
      console.error("Connection error:", error);
      voiceClient.disconnect();
    }
  };

  return (
    <RTVIClientProvider client={voiceClient}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Voice Assistant
            </h1>
            <p className="text-gray-400">Talk with your personal pirate AI assistant</p>
          </div>

          {/* Model Selection */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700 shadow-xl">
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-300 mb-3">
              Select AI Model
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
            <button 
              onClick={connectVoiceClient}
              className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md px-6 py-3 font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Start Conversation
            </button>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <RTVIClientAudio />
            </div>
          </div>
        </div>
      </div>
    </RTVIClientProvider>
  );
}
