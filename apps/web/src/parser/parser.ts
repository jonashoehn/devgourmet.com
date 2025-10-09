import {type Token, type Program, type TokenType} from "../types";
import {
  type ASTNode,
  type BinaryExpression,
  type Expression,
  type FunctionCall, type Identifier, type Literal,
  type VariableDeclaration, type Comment, type Frontmatter
} from "../types";

/**
 * Sanitize a string to prevent XSS attacks
 */
function sanitizeString(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Parse frontmatter from raw code
 */
function parseFrontmatter(code: string): { frontmatter: Frontmatter | null; codeWithoutFrontmatter: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = code.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, codeWithoutFrontmatter: code };
  }

  const frontmatterContent = match[1];
  const codeWithoutFrontmatter = code.slice(match[0].length);

  const metadata: Frontmatter['metadata'] = {};
  const lines = frontmatterContent.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Sanitize the value
    value = sanitizeString(value);

    // Parse arrays (tags)
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      metadata[key] = arrayContent.split(',').map(item => sanitizeString(item.trim().replace(/['"]/g, '')));
    }
    // Parse numbers
    else if (key === 'servings' && !isNaN(Number(value))) {
      metadata[key] = Number(value);
    }
    // Regular string values
    else {
      metadata[key] = value;
    }
  }

  return {
    frontmatter: {
      type: 'FRONTMATTER',
      metadata,
      line: 1,
    },
    codeWithoutFrontmatter,
  };
}

/**
 * Parser for DevScript language
 * Builds an Abstract Syntax Tree from tokens
 */
export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentToken: Token;
  private rawCode: string;

  constructor(tokens: Token[], rawCode: string = '') {
    this.tokens = tokens.filter(t => t.type !== 'NEWLINE'); // Filter out newlines for easier parsing
    this.currentToken = this.tokens[0];
    this.rawCode = rawCode;
  }

  /**
   * Advance to the next token
   */
  private advance(): void {
    this.position++;
    this.currentToken = this.position < this.tokens.length ? this.tokens[this.position] : this.tokens[this.tokens.length - 1];
  }

  /**
   * Peek at the next token without advancing
   */
  private peek(offset: number = 1): Token {
    const peekPos = this.position + offset;
    return peekPos < this.tokens.length ? this.tokens[peekPos] : this.tokens[this.tokens.length - 1];
  }

  /**
   * Expect a specific token type and advance
   */
  private expect(type: TokenType): Token {
    if (this.currentToken.type !== type) {
      throw new Error(
        `Expected token ${type} but got ${this.currentToken.type} at line ${this.currentToken.line}`
      );
    }
    const token = this.currentToken;
    this.advance();
    return token;
  }

  /**
   * Parse the entire program
   */
  public parse(): Program {
    // Extract frontmatter from raw code
    const { frontmatter, codeWithoutFrontmatter } = parseFrontmatter(this.rawCode);

    const body: ASTNode[] = [];

    while (this.currentToken.type !== 'EOF') {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    return {
      type: 'PROGRAM',
      frontmatter: frontmatter || undefined,
      body,
      line: 1,
    };
  }

  /**
   * Parse a statement
   */
  private parseStatement(): ASTNode | null {
    // Comment
    if (this.currentToken.type === 'COMMENT') {
      const comment: Comment = {
        type: 'COMMENT',
        text: String(this.currentToken.value),
        line: this.currentToken.line,
      };
      this.advance();
      return comment;
    }

    // Variable declaration
    if (this.currentToken.type === 'LET' || this.currentToken.type === 'CONST') {
      return this.parseVariableDeclaration();
    }

    // Function call
    if (this.currentToken.type === 'IDENTIFIER' && this.peek().type === 'LPAREN') {
      const funcCall = this.parseFunctionCall();
      // Consume optional semicolon
      // @ts-ignore
      if (this.currentToken.type === 'SEMICOLON') {
        this.advance();
      }
      return funcCall;
    }

    // Skip unknown tokens
    this.advance();
    return null;
  }

  /**
   * Parse variable declaration: let x = 5;
   */
  private parseVariableDeclaration(): VariableDeclaration {
    const kind = this.currentToken.type === 'LET' ? 'let' : 'const';
    const line = this.currentToken.line;
    this.advance(); // skip let/const

    const nameToken = this.expect('IDENTIFIER');
    const name = String(nameToken.value);

    this.expect('ASSIGN');

    const value = this.parseExpression();

    // Consume optional semicolon
    if (this.currentToken.type === 'SEMICOLON') {
      this.advance();
    }

    return {
      type: 'VARIABLE_DECLARATION',
      name,
      value,
      kind,
      line,
    };
  }

  /**
   * Parse function call: add("flour", 200, "grams")
   */
  private parseFunctionCall(): FunctionCall {
    const nameToken = this.expect('IDENTIFIER');
    const name = String(nameToken.value);
    const line = nameToken.line;

    this.expect('LPAREN');

    const args: Expression[] = [];

    // Parse arguments
    if (this.currentToken.type !== 'RPAREN') {
      args.push(this.parseExpression());

      while (this.currentToken.type === 'COMMA') {
        this.advance(); // skip comma
        args.push(this.parseExpression());
      }
    }

    this.expect('RPAREN');

    return {
      type: 'FUNCTION_CALL',
      name,
      arguments: args,
      line,
    };
  }

  /**
   * Parse expression (handles binary operations and precedence)
   */
  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  /**
   * Parse additive expression: a + b, a - b
   */
  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();

    while (this.currentToken.type === 'PLUS' || this.currentToken.type === 'MINUS') {
      const operator = this.currentToken.type === 'PLUS' ? '+' : '-';
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseMultiplicativeExpression();
      left = {
        type: 'BINARY_EXPRESSION',
        left,
        operator,
        right,
        line,
      } as BinaryExpression;
    }

    return left;
  }

  /**
   * Parse multiplicative expression: a * b, a / b
   */
  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();

    while (this.currentToken.type === 'MULTIPLY' || this.currentToken.type === 'DIVIDE') {
      const operator = this.currentToken.type === 'MULTIPLY' ? '*' : '/';
      const line = this.currentToken.line;
      this.advance();
      const right = this.parsePrimaryExpression();
      left = {
        type: 'BINARY_EXPRESSION',
        left,
        operator,
        right,
        line,
      } as BinaryExpression;
    }

    return left;
  }

  /**
   * Parse primary expression: literals, identifiers, parenthesized expressions
   */
  private parsePrimaryExpression(): Expression {
    // Number literal
    if (this.currentToken.type === 'NUMBER') {
      const literal: Literal = {
        type: 'LITERAL',
        value: this.currentToken.value,
        valueType: 'number',
        line: this.currentToken.line,
      };
      this.advance();
      return literal;
    }

    // String literal
    if (this.currentToken.type === 'STRING') {
      const literal: Literal = {
        type: 'LITERAL',
        value: this.currentToken.value,
        valueType: 'string',
        line: this.currentToken.line,
      };
      this.advance();
      return literal;
    }

    // Identifier or function call
    if (this.currentToken.type === 'IDENTIFIER') {
      // Check if it's a function call
      if (this.peek().type === 'LPAREN') {
        return this.parseFunctionCall();
      }
      // Otherwise, it's an identifier
      const identifier: Identifier = {
        type: 'IDENTIFIER',
        name: String(this.currentToken.value),
        line: this.currentToken.line,
      };
      this.advance();
      return identifier;
    }

    // Parenthesized expression
    if (this.currentToken.type === 'LPAREN') {
      this.advance(); // skip (
      const expr = this.parseExpression();
      this.expect('RPAREN');
      return expr;
    }

    throw new Error(`Unexpected token ${this.currentToken.type} at line ${this.currentToken.line}`);
  }
}
