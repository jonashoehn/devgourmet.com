import { StreamLanguage } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * DevScript Language Mode for CodeMirror
 * Syntax highlighting for the DevGourmet recipe DSL
 */

interface DevScriptState {
  inString: boolean;
  stringDelim: string | null;
}

export const devscript = StreamLanguage.define<DevScriptState>({
  name: 'devscript',

  startState: () => ({
    inString: false,
    stringDelim: null,
  }),

  token(stream, state) {
    // Handle strings
    if (state.inString) {
      if (stream.match(state.stringDelim!)) {
        state.inString = false;
        state.stringDelim = null;
        return 'string';
      }
      stream.next();
      return 'string';
    }

    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    // Comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    // String start
    if (stream.match('"') || stream.match("'")) {
      state.inString = true;
      state.stringDelim = stream.current();
      return 'string';
    }

    // Keywords
    if (stream.match(/^(let|const|var|function|return|if|else|for|while)\b/)) {
      return 'keyword';
    }

    // Recipe actions (function calls)
    if (
      stream.match(
        /^(add|mix|cook|bake|rest|serve|flip|heat|cool|stir|whisk|blend|chop|dice|slice|preheat|boil|simmer|fry|sauté|grill|roast|steam|knead|fold|season|resource|image|pour)\b/
      )
    ) {
      return 'function';
    }

    // Numbers
    if (stream.match(/^-?\d+\.?\d*/)) {
      return 'number';
    }

    // Units (after numbers or in quotes)
    if (
      stream.match(
        /^(grams?|g|kilograms?|kg|ounces?|oz|pounds?|lbs?|cups?|tablespoons?|tbsp|teaspoons?|tsp|milliliters?|ml|liters?|l|minutes?|min|seconds?|sec|hours?|hr|pieces?|pcs?|pinch|dash|handful)\b/
      )
    ) {
      return 'unit';
    }

    // Operators
    if (stream.match(/^[+\-*\/=<>!&|]+/)) {
      return 'operator';
    }

    // Punctuation
    if (stream.match(/^[()[\]{},;.]/)) {
      return 'punctuation';
    }

    // Variable names and identifiers
    if (stream.match(/^[a-zA-Z_]\w*/)) {
      return 'variableName';
    }

    // Default: skip character
    stream.next();
    return null;
  },

  languageData: {
    commentTokens: { line: '//' },
  },
});

/**
 * Syntax highlighting styles for DevScript
 * Maps token types to CodeMirror tags
 */
export const devscriptHighlightStyle = [
  { tag: t.keyword, class: 'cm-keyword' },
  { tag: t.function(t.variableName), class: 'cm-function' },
  { tag: t.string, class: 'cm-string' },
  { tag: t.number, class: 'cm-number' },
  { tag: t.comment, class: 'cm-comment' },
  { tag: t.operator, class: 'cm-operator' },
  { tag: t.punctuation, class: 'cm-punctuation' },
  { tag: t.variableName, class: 'cm-variable' },
];
