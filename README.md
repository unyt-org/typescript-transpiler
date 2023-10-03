# Standalone TypeScript Transpiler

A simple typescript transpiler which can be used to transpile **TypeScript** source code to **JavaScript** source code directly in the browser or in [deno](https://deno.com/).


It supports all the latest TypeScript features that are supported by deno, like:
 * ECMAScript Decorators
 * JSX

> This transpiler is based on [deno_ast](https://github.com/denoland/deno_ast), [deno_graph](https://github.com/denoland/deno_graph) and [deno_emit](https://github.com/denoland/deno_emit).

## Usage

To transpile a TypeScript module, pass the source code to the `transpile` function:

```ts
import { transpile } from "https://unyt.land/x/ts_transpiler/mod.ts";

const tsSource = "..."
const jsSource = await transpile(tsSource);
```

To import the transpiler module directly in the browser without a transpilation step, use the [unyt.land]("https://unyt.land/x/ts_transpiler/mod.ts") import url.
Alternativly, you can import the module from <https://deno.land/x/ts_transpiler/mod.ts>.


### Transpiler Options

You can optionally pass in transpiler options as a second argument to the transpile function:

```ts
const jsSource = await transpile(tsSource, {
	emitDecoratorMetadata: true
});
```

The following transpiler options are supported:

| Name                     | Type       | Description                                      |
|--------------------------|------------|--------------------------------------------------|
| emitDecoratorMetadata    | `boolean`  | Determines if reflection meta data is emitted for legacy decorators or not.  Defaults to `false`. |
| importsNotUsedAsValues   | `"Remove"` \| `"Preserve"` \| `"Error"` | What to do with import statements that only import types i.e. whether to remove them (`Remove`), keep them as side-effect imports (`Preserve`) or error (`Error`). Defaults to `Remove`.|
| inlineSourceMap          | `boolean`  | When set, adds an inline source map to the generated output.|
| inlineSources            | `boolean`  | When set, adds the original content of the `.ts` file as an embedded string in the source map (using the source map’s `sourcesContent` property).|
| jsx    				   | `"preserve"` \| `"react-jsx"` \| `"react-jsxdev"` \| `"react-native"` \| `"react"`  |  Controls how JSX constructs are emitted in JavaScript files. When set, the module is treated as a '.tsx' file. |
| jsxFactory   		       | `string`   | Changes the function called in `.js` files when compiling JSX Elements using the classic JSX runtime. |
| jsxFragmentFactory       | `string`   | When transforming JSX, what value should be used for the JSX factory. Defaults to `React.createElement`.|
| jsxImportSource      	   | `string`   | The string module specifier to implicitly import JSX factories from when transpiling JSX.|