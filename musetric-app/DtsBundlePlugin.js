/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */

const { generateDtsBundle } = require('dts-bundle-generator');

const isTs = (filePath) => /\.(ts|tsx)$/.test(filePath);
/**
 * @param {Compilation} [compilation]
 */
const build = (compilation, entry) => {
	const { name, paths } = entry;
	const path = paths.length === 1 && paths[0];
	if (!path) return;
	if (!isTs(path)) return;
	const dts = generateDtsBundle([
		{
			filePath: path,
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
	compilation.emitAsset(`${name}.d.ts`, {
		source: () => result,
		size: () => result.length,
	});
};

module.exports.createDtsBundlePlugin = () => {
	/**
	 * @param {Compiler} [compiler]
	 */
	return (compiler) => {
		compiler.hooks.entryOption.tap('dts-bundle', (_, entry) => {
			const arr = Object.keys(entry).map((name) => {
				const paths = entry[name].import;
				return { name, paths };
			});
			compiler.hooks.thisCompilation.tap('dts-bundle', (compilation) => {
				for (let i = 0; i < arr.length; i++) {
					const x = arr[i];
					build(compilation, x);
				}
			});
		});
	};
};
