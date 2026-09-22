/**
 * シェルコマンド文字列を解析するための共通ユーティリティ。
 * protected-branch-guard.ts と pr-merge-guard.ts の両方から利用する。
 */

export const SEGMENT_SEPARATORS = new Set(["&&", "||", ";", "|", "&", "(", ")", "\n"]);

const PUNCTUATION = new Set(["&", "|", ";", "(", ")", "\n"]);
const DOUBLE_QUOTE_ESCAPABLE = '"\\$`';

const isSingleQuoteChar = (ch: string): boolean => ch === "'";
const isDoubleQuoteChar = (ch: string): boolean => ch === '"';
const isEscapeChar = (ch: string): boolean => ch === "\\";
const isWhitespace = (ch: string): boolean => /\s/.test(ch);
const isPunctuation = (ch: string): boolean => PUNCTUATION.has(ch);
const isDoubleQuoteEscapable = (ch: string): boolean => DOUBLE_QUOTE_ESCAPABLE.includes(ch);

/**
 * # は単語先頭（直前が空白または文字列開始）のときのみコメント開始とみなす。
 * 単語途中の # (例: fix#123) はコメント扱いしない。
 */
const isCommentStart = (ch: string, hasToken: boolean): boolean => ch === "#" && !hasToken;

/** コマンド文字列をトークン列に分解する。引用符の中身は 1 トークンにまとまる。 */
export const tokenize = (command: string): string[] => {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let hasToken = false;

  const flush = () => {
    if (hasToken) {
      tokens.push(current);
      current = "";
      hasToken = false;
    }
  };

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (inSingle && isSingleQuoteChar(ch)) {
      inSingle = false;
      continue;
    }
    if (inSingle) {
      current += ch;
      continue;
    }

    if (inDouble && isDoubleQuoteChar(ch)) {
      inDouble = false;
      continue;
    }
    if (inDouble && isEscapeChar(ch) && i + 1 < command.length && isDoubleQuoteEscapable(command[i + 1])) {
      current += command[i + 1];
      i++;
      continue;
    }
    if (inDouble) {
      current += ch;
      continue;
    }

    if (isSingleQuoteChar(ch)) {
      inSingle = true;
      hasToken = true;
      continue;
    }

    if (isDoubleQuoteChar(ch)) {
      inDouble = true;
      hasToken = true;
      continue;
    }

    if (isEscapeChar(ch) && i + 1 < command.length) {
      current += command[i + 1];
      hasToken = true;
      i++;
      continue;
    }

    if (isCommentStart(ch, hasToken)) {
      while (i < command.length && command[i] !== "\n") {
        i++;
      }
      i--;
      continue;
    }

    if (isWhitespace(ch)) {
      flush();
      continue;
    }

    if (isPunctuation(ch)) {
      flush();
      if ((ch === "&" || ch === "|") && command[i + 1] === ch) {
        tokens.push(ch + ch);
        i++;
      } else {
        tokens.push(ch);
      }
      continue;
    }

    current += ch;
    hasToken = true;
  }
  flush();

  if (inSingle || inDouble) {
    throw new Error("unterminated quote");
  }

  return tokens;
};

const isSegmentSeparator = (token: string): boolean => SEGMENT_SEPARATORS.has(token);

/** `&&` や `;` などの区切りでトークン列をコマンド単位に分ける。 */
export const splitSegments = (tokens: string[]): string[][] => {
  const segments: string[][] = [[]];
  for (const token of tokens) {
    if (isSegmentSeparator(token)) {
      segments.push([]);
      continue;
    }
    segments[segments.length - 1].push(token);
  }
  return segments.filter((segment) => segment.length > 0);
};

const isIdentifier = (s: string): boolean => /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
const isSudo = (token: string): boolean => token === "sudo";
const isEnvAssignment = (token: string): boolean =>
  token.includes("=") && isIdentifier(token.split("=", 1)[0]);

/** 先頭の環境変数代入と sudo を読み飛ばす。 */
export const stripPrefix = (segment: string[]): string[] => {
  let index = 0;
  while (index < segment.length) {
    const token = segment[index];
    if (!isSudo(token) && !isEnvAssignment(token)) {
      break;
    }
    index += 1;
  }
  return segment.slice(index);
};
