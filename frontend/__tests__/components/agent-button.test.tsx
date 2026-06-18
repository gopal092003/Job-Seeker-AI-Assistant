// tests/components/agent-button.test.tsx

import {
    fireEvent,
    render,
    screen,
  } from "@testing-library/react";
  
  import { AgentButton } from "@/components/profile/agent-button";
  
  import { useAgentStatus } from "@/hooks/use-agent-status";
  
  jest.mock(
    "@/hooks/use-agent-status",
  );
  
  const mockStartAgent =
    jest.fn();
  
  const mockStopAgent =
    jest.fn();
  
  const mockedUseAgentStatus =
    useAgentStatus as jest.Mock;
  
  describe(
    "AgentButton",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
  
      it(
        "renders start button",
        () => {
          mockedUseAgentStatus.mockReturnValue(
            {
              agentStatus:
                false,
              loading:
                false,
              startAgent:
                mockStartAgent,
              stopAgent:
                mockStopAgent,
            },
          );
  
          render(
            <AgentButton />,
          );
  
          expect(
            screen.getByRole(
              "button",
              {
                name:
                  /start agent/i,
              },
            ),
          ).toBeInTheDocument();
        },
      );
  
      it(
        "renders stop button",
        () => {
          mockedUseAgentStatus.mockReturnValue(
            {
              agentStatus:
                true,
              loading:
                false,
              startAgent:
                mockStartAgent,
              stopAgent:
                mockStopAgent,
            },
          );
  
          render(
            <AgentButton />,
          );
  
          expect(
            screen.getByRole(
              "button",
              {
                name:
                  /stop agent/i,
              },
            ),
          ).toBeInTheDocument();
        },
      );
  
      it(
        "calls api",
        () => {
          mockedUseAgentStatus.mockReturnValue(
            {
              agentStatus:
                false,
              loading:
                false,
              startAgent:
                mockStartAgent,
              stopAgent:
                mockStopAgent,
            },
          );
  
          render(
            <AgentButton />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /start agent/i,
              },
            ),
          );
  
          expect(
            mockStartAgent,
          ).toHaveBeenCalledTimes(
            1,
          );
        },
      );
  
      it(
        "shows loading state",
        () => {
          mockedUseAgentStatus.mockReturnValue(
            {
              agentStatus:
                false,
              loading: true,
              startAgent:
                mockStartAgent,
              stopAgent:
                mockStopAgent,
            },
          );
  
          render(
            <AgentButton />,
          );
  
          expect(
            screen.getByRole(
              "button",
              {
                name:
                  /starting/i,
              },
            ),
          ).toBeDisabled();
        },
      );
    },
  );