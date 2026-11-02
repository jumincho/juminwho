/**
 * Every number on the project page, transcribed from the CIKM 2026 paper
 * "Forward-Looking Guidance for Iterative RAG in Multi-Hop Question
 * Answering". Table and figure numbers refer to the paper.
 */

export type Backbone = 'qwen' | 'gpt'
export type Dataset = '2wiki' | 'hotpotqa' | 'musique'
export type Metric = 'em' | 'f1' | 'p' | 'r'

export const backbones: { id: Backbone; label: string }[] = [
  { id: 'qwen', label: 'Qwen3-8B' },
  { id: 'gpt', label: 'GPT-4o-mini' },
]

export const datasets: { id: Dataset; label: string; short: string }[] = [
  { id: '2wiki', label: '2WikiMultiHopQA', short: '2Wiki' },
  { id: 'hotpotqa', label: 'HotpotQA', short: 'HotpotQA' },
  { id: 'musique', label: 'MuSiQue', short: 'MuSiQue' },
]

export const metrics: { id: Metric; label: string }[] = [
  { id: 'em', label: 'EM' },
  { id: 'f1', label: 'F1' },
  { id: 'p', label: 'P' },
  { id: 'r', label: 'R' },
]

/** EM, F1, P, R for 2WikiMultiHopQA, HotpotQA and MuSiQue, in that order. */
type Row = [number, number, number, number, number, number, number, number, number, number, number, number]

export interface ResultRow {
  method: string
  /** The method this +FG variant extends. */
  base?: string
  scores: Row
}

/** Table 2: main results under ordinary retrieval on the reproduced STRIDE setting. */
export const mainResults: Record<Backbone, ResultRow[]> = {
  qwen: [
    { method: 'CoT', scores: [0.308, 0.361, 0.355, 0.381, 0.22, 0.303, 0.311, 0.324, 0.045, 0.123, 0.128, 0.146] },
    { method: 'RAG w/ CoT', scores: [0.397, 0.46, 0.451, 0.503, 0.501, 0.602, 0.616, 0.625, 0.144, 0.227, 0.234, 0.262] },
    { method: 'SelfAsk', scores: [0.299, 0.362, 0.351, 0.394, 0.449, 0.52, 0.529, 0.542, 0.166, 0.24, 0.239, 0.269] },
    { method: 'Iter-RetGen', scores: [0.413, 0.455, 0.453, 0.467, 0.519, 0.619, 0.633, 0.634, 0.148, 0.239, 0.251, 0.264] },
    { method: 'GenGround', scores: [0.621, 0.717, 0.702, 0.76, 0.523, 0.628, 0.636, 0.664, 0.218, 0.325, 0.331, 0.353] },
    { method: 'DualRAG', scores: [0.622, 0.691, 0.682, 0.724, 0.552, 0.658, 0.666, 0.701, 0.229, 0.316, 0.321, 0.349] },
    { method: 'STRIDE', scores: [0.692, 0.773, 0.757, 0.815, 0.549, 0.653, 0.662, 0.681, 0.288, 0.401, 0.407, 0.461] },
    { method: 'SelfAsk+FG', base: 'SelfAsk', scores: [0.316, 0.387, 0.374, 0.42, 0.452, 0.545, 0.548, 0.579, 0.223, 0.312, 0.314, 0.342] },
    { method: 'DualRAG+FG', base: 'DualRAG', scores: [0.622, 0.72, 0.712, 0.73, 0.582, 0.689, 0.691, 0.726, 0.238, 0.374, 0.345, 0.394] },
    { method: 'STRIDE+FG', base: 'STRIDE', scores: [0.701, 0.775, 0.764, 0.807, 0.587, 0.681, 0.703, 0.683, 0.375, 0.474, 0.49, 0.49] },
  ],
  gpt: [
    { method: 'CoT', scores: [0.385, 0.436, 0.432, 0.448, 0.346, 0.441, 0.459, 0.442, 0.12, 0.223, 0.236, 0.234] },
    { method: 'RAG w/ CoT', scores: [0.484, 0.552, 0.547, 0.573, 0.522, 0.633, 0.646, 0.669, 0.186, 0.308, 0.313, 0.335] },
    { method: 'SelfAsk', scores: [0.34, 0.42, 0.41, 0.46, 0.49, 0.57, 0.58, 0.59, 0.21, 0.31, 0.31, 0.35] },
    { method: 'Iter-RetGen', scores: [0.446, 0.517, 0.505, 0.557, 0.551, 0.668, 0.676, 0.723, 0.156, 0.289, 0.267, 0.444] },
    { method: 'GenGround', scores: [0.467, 0.628, 0.594, 0.731, 0.48, 0.623, 0.613, 0.705, 0.23, 0.372, 0.355, 0.475] },
    { method: 'DualRAG', scores: [0.66, 0.72, 0.711, 0.752, 0.578, 0.679, 0.691, 0.694, 0.277, 0.399, 0.393, 0.481] },
    { method: 'STRIDE', scores: [0.661, 0.777, 0.744, 0.837, 0.564, 0.671, 0.683, 0.695, 0.33, 0.467, 0.471, 0.514] },
    { method: 'SelfAsk+FG', base: 'SelfAsk', scores: [0.36, 0.491, 0.469, 0.556, 0.51, 0.64, 0.65, 0.669, 0.227, 0.353, 0.354, 0.4] },
    { method: 'DualRAG+FG', base: 'DualRAG', scores: [0.7, 0.733, 0.72, 0.781, 0.628, 0.675, 0.695, 0.744, 0.257, 0.381, 0.366, 0.431] },
    { method: 'STRIDE+FG', base: 'STRIDE', scores: [0.74, 0.795, 0.809, 0.792, 0.576, 0.673, 0.709, 0.668, 0.39, 0.5, 0.533, 0.495] },
  ],
}

/** Index of a dataset's metric in a result row. */
export const column = (dataset: Dataset, metric: Metric) =>
  datasets.findIndex((d) => d.id === dataset) * 4 + metrics.findIndex((m) => m.id === metric)

export type Stage = 'none' | 'retrieval' | 'extraction' | 'reasoning' | 'extraction+reasoning'

/** Table 1: change in EM when guidance is added at each stage (MuSiQue development subset, Qwen3-8B). */
export const stageEffects: { stage: Exclude<Stage, 'none'>; label: string; delta: number }[] = [
  { stage: 'retrieval', label: 'Retrieval', delta: -0.035 },
  { stage: 'extraction', label: 'Extraction', delta: 0.035 },
  { stage: 'reasoning', label: 'Reasoning', delta: 0.023 },
  { stage: 'extraction+reasoning', label: 'Extraction + Reasoning', delta: 0.087 },
]

/** Table 3: MuSiQue EM by gold reasoning depth on the 1,000-question test set (Qwen3-8B). */
export const depthResults = [
  { group: '2-hop', questions: 619, stride: 0.328, fg: 0.426, relative: 0.299 },
  { group: '3-hop', questions: 257, stride: 0.26, fg: 0.339, relative: 0.304 },
  { group: '4-hop', questions: 124, stride: 0.149, fg: 0.194, relative: 0.302 },
  { group: 'Overall', questions: 1000, stride: 0.288, fg: 0.375, relative: 0.302 },
]

/** Figure 3: module-wise LLM tokens per question (Qwen3-8B). */
export const tokenCosts: { dataset: Dataset; extractor: [number, number]; reasoner: [number, number] }[] = [
  { dataset: '2wiki', extractor: [2563, 2619], reasoner: [705, 801] },
  { dataset: 'hotpotqa', extractor: [2992, 3004], reasoner: [655, 721] },
  { dataset: 'musique', extractor: [3163, 3248], reasoner: [560, 633] },
]

/** Table 4: execution traces of STRIDE and STRIDE+FG on a HotpotQA question, verbatim. */
export const trace = {
  dataset: 'HotpotQA',
  question: 'Which person that recorded the album “Focus Plays Focus” was born on 24 December 1946?',
  answer: 'Jan Akkerman',
  plan: [
    'Who recorded the album “Focus Plays Focus”?',
    'What is the birth date of each person who recorded “Focus Plays Focus”?',
    'Which person among them was born on 24 December 1946?',
  ],
  query1: 'artists who recorded the album Focus Plays Focus',
  evidence1:
    '“Focus Plays Focus … is the first studio album from the Dutch rock band Focus … only album recorded with the original line-up of Thijs van Leer, Jan Akkerman, Martin Dresden and Hans Cleuver.”',
  /** The rows after the shared context. `null` means the row does not apply to that system. */
  steps: [
    {
      stage: 'Guidance G_1',
      stride: null,
      fg: [
        'o_2: What is the birth date of each person who recorded “Focus Plays Focus”?',
        'o_3: Which person among them was born on 24 December 1946?',
      ],
    },
    {
      stage: 'Extracted facts f_1',
      stride: 'Focus Plays Focus was recorded by the Dutch rock band Focus.',
      fg: 'Focus Plays Focus was recorded by the Dutch rock band Focus, with the original line-up of Thijs van Leer, Jan Akkerman, Martin Dresden, and Hans Cleuver.',
    },
    {
      stage: 'Intermediate output r_1',
      stride: 'Focus (the band)',
      fg: 'Focus, Thijs van Leer, Jan Akkerman, Martin Dresden, Hans Cleuver (the band and its members)',
    },
    {
      stage: 'Query for o_2',
      stride: 'birth date of Focus',
      fg: 'birth date of Focus, Thijs van Leer, Jan Akkerman, Martin Dresden, Hans Cleuver',
    },
    {
      stage: 'Evidence D_2',
      stride: 'Focus Plays Focus; BBC Focus; Focus Brands; Jan Akkerman; History of the United States',
      fg: 'Focus Plays Focus; Jan Akkerman; BBC Focus; Jan van Steffeswert; Koningsdag',
    },
    {
      stage: 'Extracted facts f_2',
      stride: 'Jan Akkerman was born on 24 December 1946.',
      fg: 'Jan Akkerman was born on 24 December 1946.',
    },
    {
      stage: 'Intermediate output r_2',
      stride: 'not resolved: a person’s birth date does not answer the band-scoped query, and the retried query fails again',
      fg: '24 December 1946',
    },
    {
      stage: 'Final answer',
      stride: 'o_3 is not executed; None (wrong)',
      fg: 'o_3 reasons over the accumulated facts; Jan Akkerman (correct)',
    },
  ] as { stage: string; stride: string | null; fg: string | string[] }[],
}
