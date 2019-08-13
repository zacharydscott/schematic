import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  chain,
  SchematicsException,
  FileEntry,
  forEach,
  move
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
// import * as ts from 'typescript';
// import { dasherize, classify } from '@angular-devkit/core';
// import { addDeclarationToNgModule } from './utils/ng-module-utils';
// import * as fs from 'fs';
// import { dependencies } from '../dependencies';

export interface NewPageOptions {
  name: string;
  project?: string;
  path?: string;
  module?: string;
  nocomp?: boolean;
}
// You don't have to export the function as default. You can also have more than one rule factory
// per file.

export function newPage(_options: NewPageOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
  
    // if nocomp setting is true, skip file creation
    if (_options.nocomp) {
      return;
    }

    // find paths to all relevant modules based on name argument
    const pathArray = _options.name.split('/');
    const compName = pathArray[pathArray.length -1];
    const modulePath = bubbleFileFind(pathArray, /form.module/, tree);
    const routingPath = bubbleFileFind(pathArray, /routing.module/, tree);

    // update module
    if ( modulePath ) {
      let moduleBuffer = tree.read(modulePath);
      let moduleFile = moduleBuffer ? moduleBuffer.toString('utf8') : '';
        moduleFile = `import { ${strings.classify(compName)}PageComponent } from './${strings.dasherize(compName)}/${strings.dasherize(compName)}.component.ts';\n` + moduleFile;
        moduleFile = writeAtMatch('declarations: [','\t\t'+ strings.classify(compName) + 'PageComponent,',moduleFile);
        tree.overwrite(modulePath, Buffer.from(moduleFile,'utf8' ));
      } else {
        throw new SchematicsException('Source module not found. Please check the path argument.')
      }

    // update the routing file
    if (routingPath) {
      let routingBuffer = tree.read(routingPath);
      let routingFile = routingBuffer ? routingBuffer.toString('utf8') : '';
      routingFile = `import { ${strings.classify(compName)}PageComponent } from './${strings.dasherize(compName)}/${strings.dasherize(compName)}.component.ts';\n` + routingFile;
      routingFile = writeAtMatch('const routes: Routes = [',`\t{ path: '${strings.dasherize(compName)}', component: ${strings.classify(compName)}PageComponent },`,routingFile);
      tree.overwrite(routingPath, Buffer.from(routingFile,'utf8' ));
    }  else {
      throw new SchematicsException('Source Routing module not found. Please check the path argument.')
    }

    const sourceTemplates = url('./files');
    const basePath = pathFromArr(pathArray, pathArray.length - 2);
    basePath[0]
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      move(basePath),
      forEach((file: FileEntry) => {
        if (tree.exists(basePath + file.path)) {
        _context.logger.warn(`Warning: overriding ${file.path}. If This isn't intended, rollback.`);
        tree.overwrite(basePath + file.path, file.content)
        } else {
          tree.overwrite
        }
        return file;
      })
    ]);
    return chain([
      mergeWith(sourceParameterizedTemplates)
    ]);
  };
}

function pathFromArr(arr: string[], index: number) {
  if (index >= arr.length || index < 0) {
    return '';
  }
  let path = '';
  for (let i = 0; i < index; i++) {
    path += '/' + arr[i];
  }
  return path;
}

function bubbleFileFind(arr: string[], match: RegExp, searchTree: Tree) {
  let matchingPath;
  let index = arr.length -2;
  do {
    const dir = searchTree.getDir(pathFromArr(arr,index));
    for (let path in dir.subfiles) {
      if (dir.subfiles[path].match(match)) {
        matchingPath = dir.path + '/' + dir.subfiles[path];
      }
    }
    index--;
  } while (!matchingPath && index >=0);
  return matchingPath || null;
}

function writeAtMatch(insertPoint: string, insertion: string, text: string) {
  const i = text.indexOf(insertPoint)+ insertPoint.length;
  //  middle one will actually catch... other cases are just safety measures
  if( i === -1 || i === insertPoint.length-1 || !i  ) {
    return text;
  }
  return text.substring(0,i) + '\n' + insertion  + text.substring(i);
}