import { lexer, type Token, type Tokens } from "marked";

export type SafeInline =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "strong"; children: SafeInline[] }
  | { kind: "em"; children: SafeInline[] }
  | { kind: "link"; href: string; children: SafeInline[] };

export type SafeBlock =
  | { kind: "paragraph"; children: SafeInline[] }
  | { kind: "list"; ordered: boolean; items: SafeInline[][] }
  | { kind: "code"; text: string };

export function safeUrl(href: string): string | undefined {
  const trimmed = href.trim();
  if (/^mailto:[^\s"'<>]+$/i.test(trimmed)) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

function childTokens(token: Token): Token[] {
  if (!("tokens" in token) || !Array.isArray(token.tokens)) return [];
  return token.tokens;
}

function inlineFromToken(token: Token): SafeInline | undefined {
  if (token.type === "text" || token.type === "escape" || token.type === "del") {
    return { kind: "text", text: "text" in token && typeof token.text === "string" ? token.text : "" };
  }
  if (token.type === "codespan" && "text" in token && typeof token.text === "string") {
    return { kind: "code", text: token.text };
  }
  if (token.type === "strong") {
    return { kind: "strong", children: inlines(childTokens(token)) };
  }
  if (token.type === "em") {
    return { kind: "em", children: inlines(childTokens(token)) };
  }
  if (token.type === "link" && "href" in token && typeof token.href === "string") {
    const href = safeUrl(token.href);
    const children = inlines(childTokens(token));
    if (!href) {
      const label = children.length > 0 ? children.map(plainText).join("") : textOf(token);
      return { kind: "text", text: label };
    }
    return { kind: "link", href, children };
  }
  if (token.type === "br") return { kind: "text", text: " " };
  return undefined;
}

function textOf(token: Token): string {
  if ("text" in token && typeof token.text === "string") return token.text;
  return "";
}

function plainText(node: SafeInline): string {
  switch (node.kind) {
    case "text":
    case "code":
      return node.text;
    case "strong":
    case "em":
    case "link":
      return node.children.map(plainText).join("");
    default: {
      const unreachable: never = node;
      return unreachable;
    }
  }
}

function inlines(tokens: Token[]): SafeInline[] {
  const result: SafeInline[] = [];
  for (const token of tokens) {
    const inline = inlineFromToken(token);
    if (inline) result.push(inline);
  }
  return result;
}

function isList(token: Token): token is Tokens.List {
  return token.type === "list" && "items" in token && Array.isArray(token.items);
}

function listItemInlines(item: Tokens.ListItem): SafeInline[] {
  const result: SafeInline[] = [];
  for (const token of item.tokens) {
    if (token.type === "text" || token.type === "paragraph") {
      result.push(...inlines(childTokens(token)));
    } else {
      const inline = inlineFromToken(token);
      if (inline) result.push(inline);
    }
  }
  return result;
}

function appendToken(token: Token, blocks: SafeBlock[]): void {
  if (token.type === "paragraph" || token.type === "heading") {
    blocks.push({ kind: "paragraph", children: inlines(childTokens(token)) });
    return;
  }
  if (token.type === "blockquote") {
    for (const child of childTokens(token)) appendToken(child, blocks);
    return;
  }
  if (isList(token)) {
    blocks.push({
      kind: "list",
      ordered: token.ordered,
      items: token.items.map((item) => listItemInlines(item)),
    });
    return;
  }
  if (token.type === "code") {
    blocks.push({ kind: "code", text: textOf(token) });
  }
}

export function markdownBlocks(source: string): SafeBlock[] {
  const blocks: SafeBlock[] = [];
  for (const token of lexer(source, { gfm: true })) {
    appendToken(token, blocks);
  }
  return blocks;
}
