/**
 * Abstract Syntax Tree node types for DevScript
 */

export type ASTNodeType =
  | 'PROGRAM'
  | 'VARIABLE_DECLARATION'
  | 'FUNCTION_CALL'
  | 'BINARY_EXPRESSION'
  | 'LITERAL'
  | 'IDENTIFIER'
  | 'COMMENT'
  | 'FRONTMATTER';

export interface ASTNode {
  type: ASTNodeType;
  line: number;
}

export interface Frontmatter extends ASTNode {
  type: 'FRONTMATTER';
  metadata: {
    title?: string;
    description?: string;
    author?: string;
    servings?: number;
    prepTime?: string;
    cookTime?: string;
    tags?: string[];
    [key: string]: string | number | string[] | undefined;
  };
}

export interface Program extends ASTNode {
  type: 'PROGRAM';
  frontmatter?: Frontmatter;
  body: ASTNode[];
}

export interface VariableDeclaration extends ASTNode {
  type: 'VARIABLE_DECLARATION';
  name: string;
  value: Expression;
  kind: 'let' | 'const';
}

export interface FunctionCall extends ASTNode {
  type: 'FUNCTION_CALL';
  name: string;
  arguments: Expression[];
}

export interface BinaryExpression extends ASTNode {
  type: 'BINARY_EXPRESSION';
  left: Expression;
  operator: '+' | '-' | '*' | '/';
  right: Expression;
}

export interface Literal extends ASTNode {
  type: 'LITERAL';
  value: string | number;
  valueType: 'string' | 'number';
}

export interface Identifier extends ASTNode {
  type: 'IDENTIFIER';
  name: string;
}

export interface Comment extends ASTNode {
  type: 'COMMENT';
  text: string;
}

export type Expression = BinaryExpression | Literal | Identifier | FunctionCall;
export type Statement = VariableDeclaration | FunctionCall | Comment;
