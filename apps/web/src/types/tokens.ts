/**
 * Token types for the DevScript lexer
 */
export type TokenType =
  // Literals
  | 'NUMBER'
  | 'STRING'
  | 'IDENTIFIER'
  // Keywords
  | 'LET'
  | 'CONST'
  // Operators
  | 'PLUS'
  | 'MINUS'
  | 'MULTIPLY'
  | 'DIVIDE'
  | 'ASSIGN'
  // Punctuation
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'SEMICOLON'
  // Comments
  | 'COMMENT'
  // Special
  | 'EOF'
  | 'NEWLINE';

/**
 * Represents a single token from the lexer
 */
export interface Token {
  type: TokenType;
  value: string | number;
  line: number;
  column: number;
}
