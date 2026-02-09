export type Locale = 'en' | 'es' | 'pt';

export type MessageEventJob = {
  name: 'score-message';
  payload: {
    messageId: string;
    content: string;
  };
};
