// @ts-ignore
/**
 * Token types for the DevScript lexer
 */
export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',

  // Keywords
  LET = 'LET',
  CONST = 'CONST',

  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  ASSIGN = 'ASSIGN',

  // Punctuation
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  COMMA = 'COMMA',
  SEMICOLON = 'SEMICOLON',

  // Comments
  COMMENT = 'COMMENT',

  // Special
  EOF = 'EOF',
  NEWLINE = 'NEWLINE',
}

/**
 * Represents a single token from the lexer
 */
export interface Token {
  type: TokenType;
  value: string | number;
  line: number;
  column: number;
}
