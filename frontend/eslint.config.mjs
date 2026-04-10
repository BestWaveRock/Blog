import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

// 检查是否为数组，如果是则展开，否则直接使用
const configs = [];
if (Array.isArray(nextVitals)) {
  configs.push(...nextVitals);
} else {
  configs.push(nextVitals);
}

if (Array.isArray(nextTs)) {
  configs.push(...nextTs);
} else {
  configs.push(nextTs);
}

const eslintConfig = defineConfig([
  ...configs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;