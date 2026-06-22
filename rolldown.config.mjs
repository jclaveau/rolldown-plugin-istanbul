export default {
	input: "src/index.js",
	external: ["istanbul-lib-instrument", "@rollup/pluginutils"],
	output: [
		{
			format: "cjs",
			file: "dist/rolldown-plugin-istanbul.cjs",
			exports: "default",
		},
		{
			format: "es",
			file: "dist/rolldown-plugin-istanbul.mjs",
			exports: "default",
		},
	],
}
