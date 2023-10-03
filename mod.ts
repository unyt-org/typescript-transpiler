import { instantiate } from "./js/transpiler.generated.js";


/** 
 * Transpiles TypeScript source code directly into JavaScript code, returning a promise
 * which resolves with the transpiled JavaScript code.
 * @param content TypeScript module source code
 * @param compilerOptions Options to use when transpiling
 * @returns A promise which resolves with a string containing the transpiled JavaScript code
 */
export async function transpile(
	content: string,
	compilerOptions: CompilerOptions = {},
  ): Promise<string> {

	if (compilerOptions.inlineSources && !compilerOptions.inlineSourceMap) {
		throw new Error("Option 'inlineSources' can only be used when option 'inlineSourceMap' is provided");
	}

	const { transpile } = await instantiate();
	return transpile(content, compilerOptions);
}
  


/**
 * Copyright (c) 2018-2023 the Deno authors https://github.com/denoland/deno_emit/
 */
export interface CompilerOptions {
	/** Determines if reflection meta data is emitted for legacy decorators or
	 * not.  Defaults to `false`. */
	emitDecoratorMetadata?: boolean;
	/**
	 * What to do with import statements that only import types i.e. whether to
     * remove them (`Remove`), keep them as side-effect imports (`Preserve`)
     * or error (`Error`). Defaults to `Remove`.
	 */
	importsNotUsedAsValues?: string;
	/** When set, the source map will be embedded the source map content in the `.js` files.*/
	inlineSourceMap?: boolean;
	/** When set, the original content of the `.ts` file as an embedded string in
	 * the source map (using the source map’s `sourcesContent` property).
	 *
	 * This is often useful in the same cases as `inlineSourceMap`. */
	inlineSources?: boolean;
	/** Controls how JSX constructs are emitted in JavaScript files. This only
	 * affects output of JS files that started in `.jsx` or `.tsx` files. */
	jsx?: "preserve" | "react-jsx" | "react-jsxdev" | "react-native" | "react";
	/** Changes the function called in `.js` files when compiling JSX Elements
	 * using the classic JSX runtime. The most common change is to use `"h"` or
	 * `"preact.h"`. */
	jsxFactory?: string;
	/** Specify the JSX fragment factory function to use when targeting react JSX
	 * emit with jsxFactory compiler option is specified, e.g. `Fragment`. */
	jsxFragmentFactory?: string;
	/** The string module specifier to implicitly import JSX factories from when transpiling JSX. */
	jsxImportSource?: string;
}