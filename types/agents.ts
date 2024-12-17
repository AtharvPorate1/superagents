export type AgentType = 'superagent' | 'trading' | 'travel' | 'healthcare' | 'nft' | 'personal' | 'vision';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: AgentType;
}

export interface AgentResponse {
  content: string;
  agent: AgentType;
}

