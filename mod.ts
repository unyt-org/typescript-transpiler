import { instantiate } from "./deno_emit/js/emit.generated.js";

export interface CompilerOptions {
	checkJs?: boolean;
	/** Determines if reflection meta data is emitted for legacy decorators or
	 * not.  Defaults to `false`. */
	emitDecoratorMetadata?: boolean;
	importsNotUsedAsValues?: string;
	/** When set, instead of writing out a `.js.map` file to provide source maps,
	 * the source map will be embedded the source map content in the `.js` files.
	 *
	 * Although this results in larger JS files, it can be convenient in some
	 * scenarios. For example, you might want to debug JS files on a webserver
	 * that doesn’t allow `.map` files to be served. */
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
	/**  When transforming JSX, what value should be used for the JSX factory.
	 * Defaults to `React.createElement`. */
	jsxImportSource?: string;
	/** Enables the generation of sourcemap files. */
	sourceMap?: boolean;
  }

  
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
	checkCompilerOptions(compilerOptions);
	const { transpile } = await instantiate();
	return transpile(content, compilerOptions);
}
  

function checkCompilerOptions(
	compilerOptions: CompilerOptions | undefined,
  ): void {
	if (compilerOptions === undefined) {
	  return;
	}
	if (compilerOptions.inlineSourceMap && compilerOptions.sourceMap) {
	  throw new Error(
		"Option 'sourceMap' cannot be specified with option 'inlineSourceMap'",
	  );
	}
	if (
	  compilerOptions.inlineSources &&
	  !(compilerOptions.inlineSourceMap || compilerOptions.sourceMap)
	) {
	  throw new Error(
		"Option 'inlineSources' can only be used when either option 'inlineSourceMap' or option 'sourceMap' is provided",
	  );
	}
}