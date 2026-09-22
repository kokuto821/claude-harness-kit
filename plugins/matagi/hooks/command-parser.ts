/**
 * シェルコマンド文字列を解析するための共通ユーティリティ。
 * protected-branch-guard.ts と pr-merge-guard.ts の両方から利用する。
 */

export const SEGMENT_SEPARATORS = new Set(["&&", "||", ";", "|", "&", "(", ")", "\n"]);

/** コマンド文字列をトークン列に分解する。引用符の中身は 1 トークンにまとまる。 */
export const tokenize = (command: string): string[] => {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let hasToken = false;

  const punctuation = new Set(["&", "|", ";", "(", ")", "\n"]);

  const flush = () => {
    if (hasToken) {
      tokens.push(current);
      current = "";
      hasToken = false;
    }
  };

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        current += ch;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      } else if (ch === "\\" && i + 1 < command.length && '"\\$`'.includes(command[i + 1])) {
        current += command[i + 1];
        i++;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      hasToken = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      hasToken = true;
      continue;
    }
    if (ch === "\\" && i + 1 < command.length) {
      current += command[i + 1];
      hasToken = true;
      i++;
      continue;
    }

    // # は単語先頭（直前が空白または文字列開始）のときのみコメント開始とみなす。
    // 単語途中の # (例: fix#123) はコメント扱いしない。
    if (ch === "#" && !hasToken) {
      while (i < command.length && command[i] !== "\n") {
        i++;
      }
      i--;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      continue;
    }

    if (punctuation.has(ch)) {
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

/** `&&` や `;` などの区切りでトークン列をコマンド単位に分ける。 */
export const splitSegments = (tokens: string[]): string[][] => {
  const segments: string[][] = [[]];
  for (const token of tokens) {
    if (SEGMENT_SEPARATORS.has(token)) {
      segments.push([]);
    } else {
      segments[segments.length - 1].push(token);
    }
  }
  return segments.filter((segment) => segment.length > 0);
};

/** 先頭の環境変数代入と sudo を読み飛ばす。 */
export const stripPrefix = (segment: string[]): string[] => {
  let index = 0;
  const isIdentifier = (s: string) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
  while (index < segment.length) {
    const token = segment[index];
    if (token === "sudo") {
      index += 1;
    } else if (token.includes("=") && isIdentifier(token.split("=", 1)[0])) {
      index += 1;
    } else {
      break;
    }
  }
  return segment.slice(index);
};
