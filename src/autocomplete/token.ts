export type SuggestResult = {
  readonly suggestion: string;
  readonly count: number;
  readonly error?: string;
}

export type Suggestor = {
  (...exps: readonly string[]): readonly SuggestResult[];
}

type Token = string|Suggestor

export default Token
