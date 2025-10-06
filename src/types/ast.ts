/**
 * Abstract Syntax Tree node types for DevScript
 */

export enum ASTNodeType {
  PROGRAM = 'PROGRAM',
  VARIABLE_DECLARATION = 'VARIABLE_DECLARATION',
  FUNCTION_CALL = 'FUNCTION_CALL',
  BINARY_EXPRESSION = 'BINARY_EXPRESSION',
  LITERAL = 'LITERAL',
  IDENTIFIER = 'IDENTIFIER',
  COMMENT = 'COMMENT',
}

export interface ASTNode {
  type: ASTNodeType;
  line: number;
}

export interface Program extends ASTNode {
  type: ASTNodeType.PROGRAM;
  body: ASTNode[];
}

export interface VariableDeclaration extends ASTNode {
  type: ASTNodeType.VARIABLE_DECLARATION;
  name: string;
  value: Expression;
  kind: 'let' | 'const';
}

export interface FunctionCall extends ASTNode {
  type: ASTNodeType.FUNCTION_CALL;
  name: string;
  arguments: Expression[];
}

export interface BinaryExpression extends ASTNode {
  type: ASTNodeType.BINARY_EXPRESSION;
  left: Expression;
  operator: '+' | '-' | '*' | '/';
  right: Expression;
}

export interface Literal extends ASTNode {
  type: ASTNodeType.LITERAL;
  value: string | number;
  valueType: 'string' | 'number';
}

export interface Identifier extends ASTNode {
  type: ASTNodeType.IDENTIFIER;
  name: string;
}

export interface Comment extends ASTNode {
  type: ASTNodeType.COMMENT;
  text: string;
}

export type Expression = BinaryExpression | Literal | Identifier | FunctionCall;
export type Statement = VariableDeclaration | FunctionCall | Comment;
