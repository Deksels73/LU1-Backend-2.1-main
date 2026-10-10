import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
export default tseslint.config({
    // Gegenereerde en externe bestanden worden niet gelint
    ignores: [
        "node_modules/**",
        "dist/**",
        "drizzle/**",
        "**/*.js",
        "**/*.d.ts",
        "**/*.map",
    ],
}, js.configs.recommended, ...tseslint.configs.recommended, {
    languageOptions: {
        globals: globals.node,
    },
    rules: {
        // Waarschuwing in plaats van fout: op een paar plekken staat nog "as any"
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        // Een underscore voor een parameter betekent: bewust ongebruikt
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
    },
}, {
    // In tests is "as any" bij mocks gebruikelijk
    files: ["**/*.test.ts", "tests/**/*.ts"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
    },
});
//# sourceMappingURL=Eslint.config.js.map