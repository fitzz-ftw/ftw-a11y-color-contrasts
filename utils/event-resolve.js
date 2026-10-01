// typedoc-plugin-smart-docs.js

import { Converter } from "typedoc";

export function load(app) {
  app.logger.info('[SmartDocs] Plugin erfolgreich geladen.');
  app.options.addDeclaration({
    name: 'forceExportAll',
    type: 0,
    help: 'Treats all declarations as exported',
    defaultValue: false,
  });

  app.options.addDeclaration({
    name: 'excludeTestMembers',
    type: 0,
    help: 'Excludes reflections starting with "test_"',
    defaultValue: true,
  });
  if ("EVENT_RESOLVE" in Converter) {
    app.logger.info('[SmartDocs] event_resolve.');
  } else {
    app.logger.info('[SmartDocs] no event_resolve.');
  }
  // Erst beim RESOLVE-Event filtern, damit nachgelagerte Tools (wie Coverage) 
  // keine Geister-Referenzen mehr sehen
  app.converter.on(Converter.EVENT_RESOLVE, (context) => {
    const excludeTests = app.options.getValue('excludeTestMembers');
    const forceExport = app.options.getValue('forceExportAll');
    const project = context.project;

    // app.logger.verbose(`[SmartDocs Plugin] EVENT_RESOLVE gestartet. excludeTests: ${excludeTests}, forceExport: ${forceExport}`);
    // const ref = project.reflections;
    // app.logger.verbose(`[SmartDocs Plugin] project ${project}, reflexions: ${Object.values(project.reflections)}`);

    let removedCount = 0;

    // Über alle Reflektionen iterieren (mittels Object.values, da Objekt)
    if (project.reflections) {
      for (const reflection of Object.values(project.reflections)) {
        if (!reflection.name) {
          continue;
        }
        // 1. Test-Member im Public-Modus filtern
        if (reflection.name.startsWith('test_')) {
          app.logger.info(`[SmartDocs Plugin] Gefundenes test_-Member: ${reflection.name}`);
          if (excludeTests) {
            project.removeReflection(reflection);
            removedCount++;
            continue;
          }
        }

        // 2. Optional: Export-Flag erzwingen (falls benötigt)
        if (forceExport && reflection.flags) {
          // reflection.flags.setFlag(2, true); 
        }
      }
    }
    if (removedCount)
      app.logger.info(`[SmartDocs Plugin] Fertig. ${removedCount} Test-Member entfernt.`);
  });
}