/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").Entrypoint} Entrypoint */

const { generateDtsBundle } = require('dts-bundle-generator');

const isTs = (filePath) => /\.(ts|tsx)$/.test(filePath);
/**
 * @param {Compilation} [compilation]
 * @param {Entrypoint} [entrypoint]
 */
const build = (compilation, entrypoint) => {
	const originRecord = entrypoint.origins.length === 1 && entrypoint.origins[0];
	if (!originRecord) return;
	if (!isTs(originRecord.request)) return;
	const dts = generateDtsBundle([
		{
			filePath: originRecord.request,
			output: {
				noBanner: true,
				inlineDeclareExternals: true,
				inlineDeclareGlobals: true,
			},
			libraries: {
				importedLibraries: [
					'react',
					'i18next',
				],
			},
		},
	]);
	const result = dts.join('');
	compilation.emitAsset(`${entrypoint.name}.d.ts`, {
		source: () => result,
		size: () => result.length,
	});
};

const createDtsBundlePlugin = () => {
	/**
	 * @param {Compiler} [compiler]
	 */
	return (compiler) => {
		compiler.hooks.emit.tap('dts-bundle', (compilation) => {
			compilation.entrypoints.forEach(entrypoint => build(compilation, entrypoint));
		});
	};
};

module.exports = {
	createDtsBundlePlugin,
};
