// replace https://deno.land with https://unyt.land urls to allow module loading in browsers
const generatedCodePath = "./js/transpiler.generated.js"

Deno.writeTextFileSync(
	generatedCodePath, 
	Deno.readTextFileSync(generatedCodePath)
		.replaceAll('https://deno.land/', 'https://unyt.land/')
)