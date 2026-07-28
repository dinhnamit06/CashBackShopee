import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import ts from "typescript";

async function loadTypeScriptModule(relativePath) {
  const filePath = path.resolve(relativePath);
  const source = await readFile(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filePath,
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
  );
}

const {
  buildBotLinkCommands,
  isValidBotLinkCode,
  DEMO_TELEGRAM_BOT_URL,
  DEMO_ZALO_GROUP_URL,
} = await loadTypeScriptModule("src/lib/bot-link.ts");

test("creates a separate copy command for Telegram and Zalo", () => {
  assert.deepEqual(buildBotLinkCommands("123456"), {
    telegram: "/lienket 123456",
    zalo: "lienket 123456",
  });
});

test("accepts only six-digit account link codes", () => {
  assert.equal(isValidBotLinkCode("123456"), true);
  assert.equal(isValidBotLinkCode("12345"), false);
  assert.equal(isValidBotLinkCode("1234567"), false);
  assert.equal(isValidBotLinkCode("12 456"), false);
  assert.equal(isValidBotLinkCode("abcdef"), false);
});

test("rejects invalid codes before a command can be copied", () => {
  assert.equal(buildBotLinkCommands("12345"), null);
  assert.equal(buildBotLinkCommands("123456<script>"), null);
});

test("demo social links use secure external URLs", () => {
  assert.match(DEMO_TELEGRAM_BOT_URL, /^https:\/\/t\.me\//);
  assert.match(DEMO_ZALO_GROUP_URL, /^https:\/\/zalo\.me\//);
});
