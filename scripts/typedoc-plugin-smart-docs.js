// typedoc-plugin-smart-docs.js
/**
 * @packageDocumentation
 * 
 * Custom TypeDoc Smart Docs Plugin.
 * 
 * This plugin extends TypeDoc with custom options to control the visibility and inclusion 
 * of symbols and test members during documentation generation.
 * 
 * ## Custom TypeDoc Options
 * 
 * - `forceExportAll` (Boolean): 
 *   Treats all declarations within modules/namespaces as exported, even if they lack an explicit `export` keyword.
 * - `forceExportAllVerbose` (Boolean): 
 *   Logs detailed information about each symbol that was forcibly exported to the console.
 * - `excludeTestMembers` (Boolean, default: `true`): 
 *   Automatically filters out and removes any reflections (functions, variables, etc.) starting with the prefix `test_`.
 * - `excludeTestMembersVerbose` (Boolean): 
 *   Logs detailed information about each removed test member to the console.
 * 
 * ## Example Configuration (`typedoc.json`)
 * 
 * ```json
 * {
 *   "plugin": ["./scripts/typedoc-plugin-smart-docs.js"],
 *   "forceExportAll": true,
 *   "forceExportAllVerbose": false,
 *   "excludeTestMembers": true,
 *   "excludeTestMembersVerbose": false
 * }
 * ```
 */

import { Converter, TypeScript } from "typedoc";

const ModuleFlags =
  TypeScript.SymbolFlags.ValueModule | TypeScript.SymbolFlags.NamespaceModule;

export function load(app) {
  // Hauptoptionen und ihre zugehörigen Verbose-Pendants
  app.options.addDeclaration({
    name: 'forceExportAll',
    type: 0, // ParameterType.Boolean
    help: 'Treats all declarations as exported',
    defaultValue: false,
  });

  app.options.addDeclaration({
    name: 'forceExportAllVerbose',
    type: 0, // ParameterType.Boolean
    help: 'Logs detailed information about forced exports',
    defaultValue: false,
  });

  app.options.addDeclaration({
    name: 'excludeTestMembers',
    type: 0, // ParameterType.Boolean
    help: 'Excludes reflections starting with "test_"',
    defaultValue: true,
  });

  app.options.addDeclaration({
    name: 'excludeTestMembersVerbose',
    type: 0, // ParameterType.Boolean
    help: 'Logs detailed information about removed test members',
    defaultValue: false,
  });

  // 1. Hook für das Erzwingen von nicht-exportierten Symbolen beim Erstellen der Deklarationen
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context, _reflection, node) => {
      const forceExport = app.options.getValue('forceExportAll') === true || app.options.getValue('forceExportAll') === 'true';
      if (!forceExport) {
        return;
      }

      if (!node) {
        return;
      }

      const moduleSymbol = context.checker.getSymbolAtLocation(node) ?? node.symbol;
      if (!moduleSymbol) {
        return;
      }

      if ((moduleSymbol.flags & ModuleFlags) === 0) {
        return;
      }

      const exportedSymbols = context.checker.getExportsOfModule(moduleSymbol);

      const symbols = context.checker
        .getSymbolsInScope(node, TypeScript.SymbolFlags.ModuleMember)
        .filter(
          (symbol) =>
            isInDocumentableScope(symbol, node) &&
            !exportedSymbols.includes(symbol)
        );

      const forceExportVerbose = app.options.getValue('forceExportAllVerbose') === true || app.options.getValue('forceExportAllVerbose') === 'true';
      let forcedCount = 0;

      for (const symbol of symbols) {
        context.converter.convertSymbol(context, symbol);
        forcedCount++;
        if (forceExportVerbose) {
          app.logger.info(`[SmartDocs Plugin] Nicht-exportiertes Symbol erzwungen: ${symbol.name}`);
        }
      }

      if (forcedCount > 0 && forceExportVerbose) {
        app.logger.info(`[SmartDocs Plugin] ${forcedCount} Elemente im Scope als exportiert konvertiert.`);
      }
    }
  );

  // 2. Hook für das Bereinigen / Filtern von Test-Membern und allgemeinen Project-Reflections
  if ("EVENT_RESOLVE" in Converter) {
    app.converter.on(Converter.EVENT_RESOLVE_END, (context) => {
      const excludeTests = app.options.getValue('excludeTestMembers') === true || app.options.getValue('excludeTestMembers') === 'true';
      const excludeTestsVerbose = app.options.getValue('excludeTestMembersVerbose') === true || app.options.getValue('excludeTestMembersVerbose') === 'true';

      const project = context.project;
      let removedCount = 0;

      if (project.reflections) {
        for (const reflection of Object.values(project.reflections)) {
          if (!reflection.name) {
            continue;
          }
          if (reflection.sources && reflection.sources.length > 0) {
            const sourcePath = reflection.sources[0].fileName;
            if (sourcePath.includes('node_')) {
              continue;
            }
          }

          let parentName = '';
          let current = reflection.parent;
          while (current && current.name && current.kindString && current.kindString !== 'Module' && current.kindString !== 'Project') {
            parentName = current.name + '.' + parentName;
            current = current.parent;
          }

          const fullName = parentName ? `${parentName}${reflection.name}` : reflection.name;

          let fileName = '';
          if (reflection.sources && reflection.sources.length > 0) {
            fileName = ` [${reflection.sources[0].fileName}]`;
          }

          // Test-Member im Public-Modus filtern
          if (reflection.name.startsWith('test_')) {
            if (excludeTests) {
              if (excludeTestsVerbose) {
                app.logger.info(`[SmartDocs Plugin] Entfernt: ${fullName}${fileName}`);
              }
              project.removeReflection(reflection);
              removedCount++;
              continue;
            }
          }
        }
      }

      if (removedCount > 0) {
        app.logger.info(`[SmartDocs Plugin] Fertig. ${removedCount} Test-Member insgesamt entfernt.`);
      }
    });
  }
}

function isInDocumentableScope(symbol, node) {
  for (const decl of symbol.getDeclarations() || []) {
    if (decl.parent === node) return true;

    if (
      TypeScript.isSourceFile(node) &&
      TypeScript.isModuleBlock(decl.parent) &&
      decl.parent.parent.name.getText() === 'global'
    ) {
      return true;
    }
  }

  return false;
}