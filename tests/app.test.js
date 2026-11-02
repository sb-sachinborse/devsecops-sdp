import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);

    await new Promise((resolve) => {
        server.once("listening", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});

test("GET / should return the home page", async () => {
    const response = await fetch(baseUrl);

    assert.equal(response.status, 200);

    const body = await response.text();

    assert.match(body, /SecureTask/);
    assert.match(body, /DevSecOps Learning Project/);
});

test("GET /health should return UP", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.status, "UP");
    assert.equal(body.application, "SecureTask");
});

test("Unknown routes should return 404", async () => {
    const response = await fetch(`${baseUrl}/unknown`);

    assert.equal(response.status, 404);
});