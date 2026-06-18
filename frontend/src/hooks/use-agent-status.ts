// src/hooks/use-agent-status.ts

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  errorToast,
  successToast,
} from "@/hooks/use-toast";

interface AgentStatusResponse {
  agent_status: boolean;

  keyword_count: number;

  last_run_at: string | null;

  next_run_at: string | null;
}

export function useAgentStatus() {
  const [agentStatus, setAgentStatus] =
    useState(false);

  const [isRunning, setIsRunning] =
    useState(false);

  const [lastRun, setLastRun] =
    useState<string | null>(
      null,
    );

  const [nextRun, setNextRun] =
    useState<string | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const pollRef =
    useRef<NodeJS.Timeout | null>(
      null,
    );

  const fetchStatus =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await fetch(
            "/api/agent/status",
          );

        const data: AgentStatusResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data as unknown as string,
          );
        }

        setAgentStatus(
          data.agent_status,
        );

        setIsRunning(
          data.agent_status,
        );

        setLastRun(
          data.last_run_at,
        );

        setNextRun(
          data.next_run_at,
        );

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to retrieve agent status";

        setError(message);

        errorToast(message);

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const startAgent =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/agent/start",
            {
              method: "POST",
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to start agent",
          );
        }

        successToast(
          "Job search agent started",
        );

        await fetchStatus();

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to start agent";

        setError(message);

        errorToast(message);

        return false;
      } finally {
        setLoading(false);
      }
    }, [fetchStatus]);

  const stopAgent =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/agent/stop",
            {
              method: "POST",
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to stop agent",
          );
        }

        successToast(
          "Job search agent stopped",
        );

        await fetchStatus();

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to stop agent";

        setError(message);

        errorToast(message);

        return false;
      } finally {
        setLoading(false);
      }
    }, [fetchStatus]);

  const pollStatus =
    useCallback(() => {
      if (pollRef.current) {
        clearInterval(
          pollRef.current,
        );
      }

      pollRef.current =
        setInterval(() => {
          void fetchStatus();
        }, 30000);
    }, [fetchStatus]);

  useEffect(() => {
    void fetchStatus();

    pollStatus();

    return () => {
      if (pollRef.current) {
        clearInterval(
          pollRef.current,
        );
      }
    };
  }, [
    fetchStatus,
    pollStatus,
  ]);

  return {
    agentStatus,
    isRunning,
    lastRun,
    nextRun,

    loading,
    error,

    fetchStatus,
    startAgent,
    stopAgent,
    pollStatus,
  };
}