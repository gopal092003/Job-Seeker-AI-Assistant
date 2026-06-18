// src/components/profile/agent-button.tsx

"use client";

import { Button } from "@/components/ui/button";

import { useAgentStatus } from "@/hooks/use-agent-status";

export function AgentButton() {
  const {
    agentStatus,
    loading,

    startAgent,
    stopAgent,
  } = useAgentStatus();

  const handleStartClick =
    async () => {
      await startAgent();
    };

  const handleStopClick =
    async () => {
      await stopAgent();
    };

  if (agentStatus) {
    return (
      <Button
        variant="destructive"
        disabled={loading}
        onClick={
          handleStopClick
        }
      >
        {loading
          ? "Stopping..."
          : "Stop Agent"}
      </Button>
    );
  }

  return (
    <Button
      disabled={loading}
      onClick={
        handleStartClick
      }
    >
      {loading
        ? "Starting..."
        : "Start Agent"}
    </Button>
  );
}