import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals'; // Importante para reconocer 'process', 'module', etc.

export default ts.config(
  // 1. IGNORADOS GLOBALES (Siempre primero y solos)
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'coverage/**'],
  },

  // 2. CONFIGURACIÓN BASE DE TYPESCRIPT
  {
    languageOptions: {
      globals: {
        ...globals.node, // Habilita variables de Node.js
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'], // <--- Esto permite archivos de config en la raíz
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3. REGLAS RECOMENDADAS
  js.configs.recommended,
  ...ts.configs.recommended,

  // 4. REGLAS ESPECÍFICAS DE NESTJS
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Regla útil para NestJS: permite usar inyección de dependencias en constructores
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
);
