import {type Token, TokenType} from '../types';

/**
 * Lexer for DevScript language
 * Converts raw recipe text into tokens for parsing
 */
export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input[0] || null;
  }

  /**
   * Advance to the next character
   */
  private advance(): void {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  /**
   * Peek at the next character without advancing
   */
  private peek(offset: number = 1): string | null {
    const peekPos = this.position + offset;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  /**
   * Skip whitespace except newlines
   */
  private skipWhitespace(): void {
    while (this.currentChar !== null && /[ \t\r]/.test(this.currentChar)) {
      this.advance();
    }
  }

  /**
   * Skip comment starting with //
   */
  private skipComment(): Token | null {
    if (this.currentChar === '/' && this.peek() === '/') {
      const startLine = this.line;
      const startColumn = this.column;
      this.advance(); // skip first /
      this.advance(); // skip second /

      let comment = '';
      while (this.currentChar !== null && this.currentChar !== '\n') {
        comment += this.currentChar;
        this.advance();
      }

      return {
        type: TokenType.COMMENT,
        value: comment.trim(),
        line: startLine,
        column: startColumn,
      };
    }
    return null;
  }

  /**
   * Parse a number
   */
  private number(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let numStr = '';

    while (this.currentChar !== null && /[0-9.]/.test(this.currentChar)) {
      numStr += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.NUMBER,
      value: parseFloat(numStr),
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * Parse a string literal (single or double quotes)
   */
  private string(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    const quote = this.currentChar;
    this.advance(); // skip opening quote

    let str = '';
    while (this.currentChar !== null && this.currentChar !== quote) {
      if (this.currentChar === '\\' && this.peek() === quote) {
        this.advance(); // skip backslash
        str += this.currentChar;
        this.advance();
      } else {
        str += this.currentChar;
        this.advance();
      }
    }

    if (this.currentChar === quote) {
      this.advance(); // skip closing quote
    }

    return {
      type: TokenType.STRING,
      value: str,
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * Parse an identifier or keyword
   */
  private identifier(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let id = '';

    while (this.currentChar !== null && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      id += this.currentChar;
      this.advance();
    }

    // Check for keywords
    let type = TokenType.IDENTIFIER;
    if (id === 'let') {
      type = TokenType.LET;
    } else if (id === 'const') {
      type = TokenType.CONST;
    }

    return {
      type,
      value: id,
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * Get the next token
   */
  public getNextToken(): Token {
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/[ \t\r]/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // Newline
      if (this.currentChar === '\n') {
        const token: Token = {
          type: TokenType.NEWLINE,
          value: '\n',
          line: this.line,
          column: this.column,
        };
        this.advance();
        return token;
      }

      // Comments
      const comment = this.skipComment();
      if (comment) {
        return comment;
      }

      // Numbers
      if (/[0-9]/.test(this.currentChar)) {
        return this.number();
      }

      // Strings
      if (this.currentChar === '"' || this.currentChar === "'") {
        return this.string();
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      // Operators and punctuation
      const char = this.currentChar;
      const token: Token = {
        type: TokenType.EOF,
        value: char,
        line: this.line,
        column: this.column,
      };

      switch (char) {
        case '+':
          token.type = TokenType.PLUS;
          break;
        case '-':
          token.type = TokenType.MINUS;
          break;
        case '*':
          token.type = TokenType.MULTIPLY;
          break;
        case '/':
          token.type = TokenType.DIVIDE;
          break;
        case '=':
          token.type = TokenType.ASSIGN;
          break;
        case '(':
          token.type = TokenType.LPAREN;
          break;
        case ')':
          token.type = TokenType.RPAREN;
          break;
        case ',':
          token.type = TokenType.COMMA;
          break;
        case ';':
          token.type = TokenType.SEMICOLON;
          break;
        default:
          // Unknown character - skip it
          this.advance();
          continue;
      }

      this.advance();
      return token;
    }

    // End of file
    return {
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    };
  }

  /**
   * Tokenize the entire input
   */
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();

    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    tokens.push(token); // Include EOF token
    return tokens;
  }
}
