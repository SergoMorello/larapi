import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'], // Точка входа вашего пакета
	format: ['cjs', 'esm'],  // Собираем и для старого Node (CJS), и для нового веба (ESM)
	dts: true,               // Генерировать файлы типов .d.ts автоматически
	splitting: false,
	sourcemap: true,
	clean: true,             // Очищать папку dist перед каждой сборкой

	name: 'Larapi',
	
	platform: 'neutral'
});
