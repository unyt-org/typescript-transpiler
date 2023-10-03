// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// 2023 unyt.org

use wasm_bindgen::prelude::*;

use anyhow::Result;
use deno_graph::ModuleParser;
use deno_graph::DefaultModuleParser;
use std::sync::Arc;

pub use deno_ast::EmitOptions;
pub use deno_ast::ImportsNotUsedAsValues;
pub use deno_ast::ModuleSpecifier;
pub use deno_graph::source::CacheSetting;
pub use deno_graph::source::LoadFuture;
pub use deno_graph::source::Loader;

/// This is a deserializable structure of the `"compilerOptions"` section of a
/// TypeScript or Deno configuration file which can effect how the emitting is
/// handled, all other options don't impact the output.
#[derive(serde::Deserialize)]
#[serde(default, rename_all = "camelCase")]
#[derive(Debug)]
pub struct CompilerOptions {
  pub check_js: bool,
  pub emit_decorator_metadata: bool,
  pub imports_not_used_as_values: String,
  pub inline_source_map: bool,
  pub inline_sources: bool,
  pub jsx: String,
  pub jsx_factory: String,
  pub jsx_fragment_factory: String,
  pub jsx_import_source: Option<String>,
  pub source_map: bool,
}

impl Default for CompilerOptions {
  fn default() -> Self {
    Self {
      check_js: false,
      emit_decorator_metadata: false,
      imports_not_used_as_values: "remove".to_string(),
      inline_source_map: false,
      inline_sources: false,
      jsx: "react".to_string(),
      jsx_factory: "React.createElement".to_string(),
      jsx_fragment_factory: "React.Fragment".to_string(),
      jsx_import_source: None,
      source_map: false,
    }
  }
}

impl From<CompilerOptions> for EmitOptions {
  fn from(options: CompilerOptions) -> Self {
    let imports_not_used_as_values =
      match options.imports_not_used_as_values.as_str() {
        "preserve" => ImportsNotUsedAsValues::Preserve,
        "error" => ImportsNotUsedAsValues::Error,
        _ => ImportsNotUsedAsValues::Remove,
      };

    Self {
      emit_metadata: options.emit_decorator_metadata,
      imports_not_used_as_values,
      inline_source_map: options.inline_source_map,
      inline_sources: options.inline_sources,
      jsx_factory: options.jsx_factory,
      jsx_fragment_factory: options.jsx_fragment_factory,
      transform_jsx: options.jsx == "react" || options.jsx == "react-jsx" || options.jsx == "react-jsxdev",
      var_decl_imports: false,
      source_map: options.source_map,
      jsx_automatic: options.jsx == "react-jsx" || options.jsx == "react-jsxdev",
      jsx_development: options.jsx == "react-jsxdev",
      jsx_import_source: options.jsx_import_source,
    }
  }
}


#[wasm_bindgen]
pub fn transpile(
  content: String,
  maybe_compiler_options: JsValue
) -> Result<String, JsValue> {

  let compiler_options: CompilerOptions = serde_wasm_bindgen::from_value::<
    Option<CompilerOptions>,
  >(maybe_compiler_options)
    .map_err(|err| JsValue::from(js_sys::Error::new(&err.to_string())))?
    .unwrap_or_default();

  let emit_options: EmitOptions = compiler_options.into();

  let parser = &DefaultModuleParser::new();
  let module_specifier = ModuleSpecifier::parse("file:///tmp.ts").expect("Invalid url.");
  let parsed_source = parser.parse_module(&module_specifier, Arc::from(content), deno_ast::MediaType::from_specifier_and_headers(&module_specifier, None))
    .map_err(|err| JsValue::from(js_sys::Error::new(&err.to_string())))?;

  let transpiled_source = parsed_source.transpile(&emit_options)
    .map_err(|err| JsValue::from(js_sys::Error::new(&err.to_string())))?;
  return Ok(transpiled_source.text);
}