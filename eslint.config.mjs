import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript 관련 룰 완화
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // 일반 JavaScript 룰 완화
      "prefer-const": "warn",
      "no-unused-vars": "warn",

      // Next.js 관련 룰 완화
      "@next/next/no-page-custom-font": "warn",
      "@next/next/no-img-element": "warn",

      // 기타 엄격한 룰들 완화
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
];

export default eslintConfig;
