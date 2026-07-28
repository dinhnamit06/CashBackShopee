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

const { isNavItemActive } = await loadTypeScriptModule(
  "src/lib/navigation.ts"
);

test("marks the guide tab active only on the guide route", () => {
  assert.equal(isNavItemActive("/guide", "/guide"), true);
  assert.equal(isNavItemActive("/guide", "/"), false);
});

test("keeps the home tab active only on the exact home route", () => {
  assert.equal(isNavItemActive("/", "/"), true);
  assert.equal(isNavItemActive("/hoan-tien", "/"), false);
});

test("supports nested routes without activating unrelated tabs", () => {
  assert.equal(
    isNavItemActive("/dashboard/don-hang", "/dashboard"),
    true
  );
  assert.equal(isNavItemActive("/guide-extra", "/guide"), false);
});
