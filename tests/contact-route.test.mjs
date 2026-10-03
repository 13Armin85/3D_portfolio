import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/contact/route.ts";

const valid = {
  name: " Alex Example ",
  email: " alex@example.com ",
  message: " I would like to discuss a project. ",
  website: "",
};
const request = (body = valid, headers = {}) =>
  new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
function setup(t) {
  const previous = { ...process.env };
  Object.assign(process.env, {
    RESEND_API_KEY: "re_test_fake",
    RESEND_FROM_EMAIL: "Portfolio <contact@example.com>",
    CONTACT_TO_EMAIL: "owner@example.com",
  });
  t.after(() => {
    for (const key of [
      "RESEND_API_KEY",
      "RESEND_FROM_EMAIL",
      "CONTACT_TO_EMAIL",
    ]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  t.mock.method(console, "error", () => {});
  return t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected external request");
  });
}

test("sends through Resend with fixed sender/recipient and visitor Reply-To", async (t) => {
  const fetch = setup(t);
  fetch.mock.mockImplementation(async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.headers.get("Authorization"), "Bearer re_test_fake");
    const body = JSON.parse(options.body);
    assert.equal(body.from, "Portfolio <contact@example.com>");
    assert.equal(body.to, "owner@example.com");
    assert.equal(body.reply_to, "alex@example.com");
    assert.match(body.text, /I would like to discuss a project/);
    return Response.json({ id: "test-email-id" });
  });
  const response = await POST(
    request({ ...valid, to: "attacker@example.com" }),
  );
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /sent/);
  assert.equal(fetch.mock.callCount(), 1);
});

test("rejects malformed, invalid, oversized and foreign-origin submissions without sending", async (t) => {
  const fetch = setup(t);
  for (const body of [
    "{",
    "null",
    "[]",
    { ...valid, email: "invalid" },
    { ...valid, name: " " },
    { ...valid, message: "short" },
    { ...valid, message: "x".repeat(3001) },
    { ...valid, name: "Alex\nBcc: other@example.com" },
  ]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal((await POST(request("x".repeat(20_001)))).status, 413);
  assert.equal(
    (await POST(request(valid, { "content-length": "20001" }))).status,
    413,
  );
  assert.equal(
    (await POST(request(valid, { origin: "https://other.example" }))).status,
    403,
  );
  assert.equal(
    (await POST(request(valid, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(fetch.mock.callCount(), 0);
});

test("honeypot and missing configuration never send an email", async (t) => {
  const fetch = setup(t);
  assert.equal(
    (await POST(request({ ...valid, website: "spam.example" }))).status,
    200,
  );
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(request())).status, 503);
  assert.equal(fetch.mock.callCount(), 0);
});

test("provider rejection and network failure are not reported as success or leaked", async (t) => {
  const fetch = setup(t);
  fetch.mock.mockImplementation(async () =>
    Response.json(
      { name: "validation_error", message: "private provider details" },
      { status: 422 },
    ),
  );
  const rejected = await POST(request());
  assert.equal(rejected.status, 502);
  assert.doesNotMatch(await rejected.text(), /private provider details/);
  fetch.mock.mockImplementation(async () => {
    throw new Error("private network details");
  });
  const failed = await POST(request());
  assert.equal(failed.status, 502);
  assert.doesNotMatch(await failed.text(), /private network details/);
});
