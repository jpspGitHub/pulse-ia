import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';

export default ts.config(
  // 1. Ignorados globales
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**'],
  },

  // 2. Configuración de Parser y Entorno
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3. Bases recomendadas
  js.configs.recommended,
  ...ts.configs.recommended,

  // 4. Reglas específicas para NestJS / BullMQ
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      // BullMQ suele requerir funciones que devuelven Promesas sin await
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
);
