import {TokenType, type Token, type Program} from "../types";
import {
  type ASTNode,
  ASTNodeType,
  type BinaryExpression,
  type Expression,
  type FunctionCall, type Identifier, type Literal,
  type VariableDeclaration
} from "../types";

/**
 * Parser for DevScript language
 * Builds an Abstract Syntax Tree from tokens
 */
export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE); // Filter out newlines for easier parsing
    this.currentToken = this.tokens[0];
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
    const body: ASTNode[] = [];

    while (this.currentToken.type !== TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    return {
      type: ASTNodeType.PROGRAM,
      body,
      line: 1,
    };
  }

  /**
   * Parse a statement
   */
  private parseStatement(): ASTNode | null {
    // Comment
    if (this.currentToken.type === TokenType.COMMENT) {
      const comment: Comment = {
        type: ASTNodeType.COMMENT,
        text: String(this.currentToken.value),
        line: this.currentToken.line,
      };
      this.advance();
      // @ts-ignore
      return comment;
    }

    // Variable declaration
    if (this.currentToken.type === TokenType.LET || this.currentToken.type === TokenType.CONST) {
      return this.parseVariableDeclaration();
    }

    // Function call
    if (this.currentToken.type === TokenType.IDENTIFIER && this.peek().type === TokenType.LPAREN) {
      const funcCall = this.parseFunctionCall();
      // Consume optional semicolon
      // @ts-ignore
      if (this.currentToken.type === TokenType.SEMICOLON) {
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
    const kind = this.currentToken.type === TokenType.LET ? 'let' : 'const';
    const line = this.currentToken.line;
    this.advance(); // skip let/const

    const nameToken = this.expect(TokenType.IDENTIFIER);
    const name = String(nameToken.value);

    this.expect(TokenType.ASSIGN);

    const value = this.parseExpression();

    // Consume optional semicolon
    if (this.currentToken.type === TokenType.SEMICOLON) {
      this.advance();
    }

    return {
      type: ASTNodeType.VARIABLE_DECLARATION,
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
    const nameToken = this.expect(TokenType.IDENTIFIER);
    const name = String(nameToken.value);
    const line = nameToken.line;

    this.expect(TokenType.LPAREN);

    const args: Expression[] = [];

    // Parse arguments
    if (this.currentToken.type !== TokenType.RPAREN) {
      args.push(this.parseExpression());

      while (this.currentToken.type === TokenType.COMMA) {
        this.advance(); // skip comma
        args.push(this.parseExpression());
      }
    }

    this.expect(TokenType.RPAREN);

    return {
      type: ASTNodeType.FUNCTION_CALL,
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

    while (this.currentToken.type === TokenType.PLUS || this.currentToken.type === TokenType.MINUS) {
      const operator = this.currentToken.type === TokenType.PLUS ? '+' : '-';
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseMultiplicativeExpression();
      left = {
        type: ASTNodeType.BINARY_EXPRESSION,
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

    while (this.currentToken.type === TokenType.MULTIPLY || this.currentToken.type === TokenType.DIVIDE) {
      const operator = this.currentToken.type === TokenType.MULTIPLY ? '*' : '/';
      const line = this.currentToken.line;
      this.advance();
      const right = this.parsePrimaryExpression();
      left = {
        type: ASTNodeType.BINARY_EXPRESSION,
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
    if (this.currentToken.type === TokenType.NUMBER) {
      const literal: Literal = {
        type: ASTNodeType.LITERAL,
        value: this.currentToken.value,
        valueType: 'number',
        line: this.currentToken.line,
      };
      this.advance();
      return literal;
    }

    // String literal
    if (this.currentToken.type === TokenType.STRING) {
      const literal: Literal = {
        type: ASTNodeType.LITERAL,
        value: this.currentToken.value,
        valueType: 'string',
        line: this.currentToken.line,
      };
      this.advance();
      return literal;
    }

    // Identifier or function call
    if (this.currentToken.type === TokenType.IDENTIFIER) {
      // Check if it's a function call
      if (this.peek().type === TokenType.LPAREN) {
        return this.parseFunctionCall();
      }
      // Otherwise, it's an identifier
      const identifier: Identifier = {
        type: ASTNodeType.IDENTIFIER,
        name: String(this.currentToken.value),
        line: this.currentToken.line,
      };
      this.advance();
      return identifier;
    }

    // Parenthesized expression
    if (this.currentToken.type === TokenType.LPAREN) {
      this.advance(); // skip (
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN);
      return expr;
    }

    throw new Error(`Unexpected token ${this.currentToken.type} at line ${this.currentToken.line}`);
  }
}
