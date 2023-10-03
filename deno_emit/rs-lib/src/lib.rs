// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.


use anyhow::Result;
use deno_graph::ModuleParser;
use deno_graph::DefaultModuleParser;
use std::sync::Arc;

pub use emit::bundle_graph;
pub use emit::BundleEmit;
pub use emit::BundleOptions;
pub use emit::BundleType;
pub use emit::TranspileOptions;

pub use deno_ast::EmitOptions;
pub use deno_ast::ImportsNotUsedAsValues;
pub use deno_ast::ModuleSpecifier;
pub use deno_graph::source::CacheSetting;
pub use deno_graph::source::LoadFuture;
pub use deno_graph::source::Loader;


pub fn transpile_isolated(content: String, emit_options:EmitOptions, file_path:String) -> Result<String> {
  let parser = &DefaultModuleParser::new();
  let module_specifier = ModuleSpecifier::parse(&file_path).expect("Invalid url.");
  let parsed_source = parser.parse_module(&module_specifier, Arc::from(content), deno_ast::MediaType::from_specifier_and_headers(&module_specifier, None))?;

  let transpiled_source = parsed_source.transpile(&emit_options)?;
  return Ok(transpiled_source.text);
}

