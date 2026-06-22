const assert = require("node:assert")
const { rolldown } = require("rolldown")
const istanbulPlugin = require("..")

process.chdir(__dirname)

describe("rolldown-plugin-istanbul", function () {
	this.timeout(15000)

	it("transforms code through istanbul instrumenter", () =>
		rolldown({
			input: "fixtures/main.js",
			plugins: [istanbulPlugin()],
		})
			.then((bundle) => {
				return bundle.generate({
					format: "iife",
					name: "test",
					globals: {
						whatever: "whatever",
					},
				})
			})
			.then((generated) => {
				const code = generated.output[0].code
				assert.ok(code.indexOf("coverage[path]") !== -1, code)
			}))

	it("adds the file name properly", () =>
		rolldown({
			input: "fixtures/main.js",
			plugins: [istanbulPlugin()],
		})
			.then((bundle) => {
				return bundle.generate({
					format: "iife",
					name: "test",
					globals: {
						whatever: "whatever",
					},
				})
			})
			.then((generated) => {
				const code = generated.output[0].code
				assert.ok(code.indexOf("fixtures/main.js") !== -1, code)
			}))

	it("transforms code through istanbul instrumenter with source map", () =>
		rolldown({
			input: "fixtures/main.js",
			plugins: [
				istanbulPlugin({
					instrumenterConfig: {
						produceSourceMap: false,
						compact: false,
					},
				}),
			],
		})
			.then((bundle) => {
				return bundle.generate({
					sourcemap: true,
					format: "iife",
					name: "test",
					// rolldown defaults the output dir to "dist", which makes
					// sourcemap sources relative to it ("../fixtures/main.js")
					dir: ".",
					globals: {
						whatever: "whatever",
					},
				})
			})
			.then((generated) => {
				const { map } = generated.output[0]

				assert.deepEqual(map.sources, ["fixtures/main.js"])
				assert.deepEqual(map.sourcesContent, [
					"export const foo = (bar) => {\n" +
						"\tif (bar) {\n" +
						"\t\twhatever.do()\n" +
						"\t} else {\n" +
						"\t\twhatever.stop()\n" +
						"\t}\n" +
						"}\n",
				])
				assert.notEqual(map.mappings, "")
			}))
})
