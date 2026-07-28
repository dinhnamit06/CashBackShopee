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

const { inspectShopeeUrl, parseShopeeProductIds } =
  await loadTypeScriptModule("src/lib/shopee-url.ts");
const { estimateCashback } =
  await loadTypeScriptModule("src/lib/cashback.ts");

test("accepts supported Shopee product and short-link hosts", () => {
  assert.equal(
    inspectShopeeUrl("https://shopee.vn/ao-khoac-i.12345.67890")?.kind,
    "product"
  );
  assert.equal(
    inspectShopeeUrl("https://s.shopee.vn/9pQabc")?.kind,
    "short"
  );
  assert.equal(inspectShopeeUrl("https://shope.ee/abc123")?.kind, "short");
});

test("extracts product identifiers from supported Shopee URL formats", () => {
  assert.deepEqual(
    parseShopeeProductIds("https://shopee.vn/product/12345/67890"),
    { shopId: "12345", itemId: "67890" }
  );
  assert.deepEqual(
    parseShopeeProductIds("https://shopee.vn/ao-khoac-i.12345.67890?xptdk=1"),
    { shopId: "12345", itemId: "67890" }
  );
});

test("rejects lookalike hosts, unsafe schemes and credentialed URLs", () => {
  const unsafeUrls = [
    "https://shopee.vn.evil.example/product/1/2",
    "https://example.com/?next=https://shopee.vn/product/1/2",
    "http://shopee.vn/product/1/2",
    "file:///etc/passwd",
    "https://user:pass@shopee.vn/product/1/2",
    "https://shope.ee.evil.example/abc",
  ];

  for (const url of unsafeUrls) {
    assert.equal(inspectShopeeUrl(url), null);
  }
});

test("rejects malformed, empty and oversized values", () => {
  assert.equal(inspectShopeeUrl(""), null);
  assert.equal(inspectShopeeUrl("not a url"), null);
  assert.equal(inspectShopeeUrl(`https://shope.ee/${"a".repeat(2100)}`), null);
  assert.equal(inspectShopeeUrl("https://shopee.vn/search?keyword=ao"), null);
});

test("estimates cashback conservatively and never returns a negative value", () => {
  assert.equal(estimateCashback(500_000), 28_000);
  assert.equal(estimateCashback(99_999), 5_600);
  assert.equal(estimateCashback(-100_000), 0);
  assert.equal(estimateCashback(Number.NaN), 0);
});
