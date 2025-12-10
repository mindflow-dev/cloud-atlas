/**
 * WARNING: This file contains intentional security vulnerabilities for SAST testing purposes.
 * DO NOT use this code in production!
 */

// 2. SQL Injection vulnerability
export function getUserData(userId: string): string {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return query;
}

// 3. XSS vulnerability - innerHTML with user input
export function displayUserContent(userInput: string): void {
  const element = document.createElement("div");
  element.innerHTML = userInput; // Dangerous!
}

// 4. Command injection vulnerability
export function executeCommand(userInput: string): void {
  const command = `ls -la ${userInput}`;
  // Simulated command execution
  console.log(`Executing: ${command}`);
}

// 5. eval() usage - dangerous code execution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function evaluateCode(code: string): any {
  return eval(code); // Never use eval!
}

// 6. Insecure random number generation
export function generateSessionToken(): string {
  return Math.random().toString(36); // Not cryptographically secure
}

// 7. Weak cryptographic hash (MD5)
// @ts-ignore - Node.js module for SAST testing
import * as crypto from "crypto";
export function hashPassword(password: string): string {
  // @ts-ignore
  return crypto.createHash("md5").update(password).digest("hex");
}

// 8. Path traversal vulnerability
// @ts-ignore - Node.js module for SAST testing
import * as fs from "fs";
export function readFile(filename: string): string {
  // @ts-ignore
  return fs.readFileSync(`/data/${filename}`, "utf8");
}

// 9. Insecure HTTP request (no HTTPS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetchUserData(userId: string): Promise<any> {
  return fetch(`http://api.example.com/users/${userId}`); // Should use HTTPS
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function signToken(payload: any): string {
  // Simulated JWT signing
  return `token.${JSON.stringify(payload)}.signature`;
}

