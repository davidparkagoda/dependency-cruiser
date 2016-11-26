"use strict";

const path    = require('path');
const _       = require('lodash');
const resolve = require('resolve');
const utl     = require('../utl');

const isRelativeModuleName = pString => pString.startsWith(".");

/*
 * resolves both CommonJS and ES6
 */
function resolveCJSModule(pModuleName, pBaseDir, pFileDir) {
    let lRetval = {
        resolved        : pModuleName,
        coreModule      : false,
        followable      : false,
        couldNotResolve : false
    };

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = path.relative(
                pBaseDir,
                resolve.sync(pModuleName, {basedir: pFileDir})
            );
            lRetval.followable = (path.extname(lRetval.resolved) !== ".json");
        } catch (e) {
            lRetval.couldNotResolve = true;
        }
    }
    return lRetval;
}

function resolveAMDModule(pModuleName, pBaseDir, pFileDir) {
    // lookups:
    // - [x] could be relative in the end (implemented)
    // - [ ] require.config kerfuffle (command line, html, file, ...)
    // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
    // - [ ] funky plugins (json!wappie, screeching-cat!saberttooth)
    const lProbablePath = path.relative(
        pBaseDir,
        path.join(pFileDir, `${pModuleName}.js`)
    );

    return {
        resolved: utl.fileExists(lProbablePath) ? lProbablePath : pModuleName,
        coreModule: Boolean(resolve.isCore(pModuleName)),
        followable: utl.fileExists(lProbablePath),
        couldNotResolve: !Boolean(resolve.isCore(pModuleName)) && !utl.fileExists(lProbablePath)
    };
}

exports.resolveModuleToPath = (pDependency, pBaseDir, pFileDir) => {
    if (isRelativeModuleName(pDependency.moduleName)){
        return resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else if (_.includes(["cjs", "es6"], pDependency.moduleSystem)){
        return resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else {
        return resolveAMDModule(pDependency.moduleName, pBaseDir, pFileDir);
    }
};
