export enum AnswerType {
  TFQ, // True False Question
  MCQ, // Multiple Choice Question
  MAQ, // Multiple Answer Question
  ARQ, // Assertion and Reasoning Question
  NCQ, // No Choice Question = give input text
  NAQ, //No Answer Question = No choices
  UNKNOWN_LAST // Just tag the end?
}

export const ANSWER_TYPES = [
  AnswerType.TFQ,
  AnswerType.MCQ,
  AnswerType.MAQ,
  AnswerType.ARQ,
  AnswerType.NCQ,
  AnswerType.NAQ,
]

export const ANSWER_TYPE_NAMES = ANSWER_TYPES.map(a => AnswerType[a])


export const TFQChoices: string[] = ['True', 'False']
export const ARQChoices: string[] = [
  'Both <b>A</b> and <b>R</b> are CORRECT and <b>R</b> is the CORRECT explanation of the <b>A</b>.',
  'Both <b>A</b> and <b>R</b> are CORRECT, but <b>R</b> is NOT THE CORRECT explanation of the <b>A</b>.',
  '<b>A</b> is CORRECT, but <b>R</b> is INCORRECT.',
  '<b>A</b> is INCORRECT, but <b>R</b> is CORRECT',
  'Both <b>A</b> and <b>R</b> are INCORRECT.'
]
