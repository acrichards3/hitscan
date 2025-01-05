module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@react-three/recommended",
        "eslint-config-prettier",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
    },
    plugins: ["react-refresh", "sort-keys", "typescript-sort-keys"],
    rules: {
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": ["warn"],
        "react/jsx-sort-props": [
            1,
            {
                callbacksLast: true,
            },
        ],
        // This rule is incompatible with three.js
        // See: https://github.com/pmndrs/react-three-fiber/discussions/2487
        "react/no-unknown-property": 0,
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "sort-keys": 0, // disable default eslint sort-keys
        "sort-keys/sort-keys-fix": 1,
        "typescript-sort-keys/interface": "warn",
        "typescript-sort-keys/string-enum": "warn",
    },
};
