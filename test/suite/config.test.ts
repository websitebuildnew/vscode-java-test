// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

'use strict';

import * as assert from 'assert';

import { TestController, TestRunRequest, tests, workspace } from 'vscode';
import { JUnitRunner } from '../../src/runners/junitRunner/JunitRunner';
import { resolveLaunchConfigurationForRunner } from '../../src/utils/launchUtils';
import { generateTestItem, setupTestEnv } from './utils';
import { TestKind, IRunTestContext } from '../../src/java-test-runner.api';

// tslint:disable: only-arrow-functions
// tslint:disable: no-object-literal-type-assertion
suite('JUnit Runner Analyzer Tests', () => {

    let testController: TestController;

    suiteSetup(async function() {
        await setupTestEnv();
    });

    setup(() => {
        testController = tests.createTestController('testController', 'Mock Test');
    });

    teardown(() => {
        testController.dispose();
    });

    test("test launch configuration", async () => {
        const testItem = generateTestItem(testController, 'junit@junit4.TestAnnotation#shouldPass', TestKind.JUnit, undefined, '=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit4{TestAnnotation.java[TestAnnotation~shouldPass');
        const testRunRequest = new TestRunRequest([testItem], []);
        const testRun = testController.createTestRun(testRunRequest);
        const runnerContext: IRunTestContext = {
            isDebug: false,
            kind: TestKind.JUnit,
            projectName: 'junit',
            testItems: [testItem],
            testRun: testRun,
            workspaceFolder: workspace.workspaceFolders?.[0]!,
        };
        const junitRunner =  new JUnitRunner(runnerContext);
        const configuration = await resolveLaunchConfigurationForRunner(junitRunner, runnerContext, {
            classPaths: [
                "/a/b/c.jar",
                "/foo/bar.jar"
            ],
            env: {
                test: "test",
            },
            envFile: "${workspaceFolder}/.env",
            javaExec: "/usr/bin/java",
            modulePaths: [
                "/test/module.jar",
            ],
            postDebugTask: "test",
            preLaunchTask: "test",
            sourcePaths: [
                "/a/b/c.jar"
            ]
        });
        assert.strictEqual(configuration.env.test, "test");
        assert.strictEqual(configuration.envFile, "${workspaceFolder}/.env");
        assert.strictEqual(configuration.sourcePaths[0], "/a/b/c.jar");
        assert.strictEqual(configuration.preLaunchTask, "test");
        assert.strictEqual(configuration.postDebugTask, "test");
        assert.strictEqual(configuration.modulePaths[0], "/test/module.jar");
        assert.strictEqual(configuration.classPaths[0], "/a/b/c.jar");
        assert.strictEqual(configuration.classPaths[1], "/foo/bar.jar");
        assert.strictEqual(configuration.javaExec, "/usr/bin/java");
    });

    test("test launch encoding", async() => {
        const testItem = generateTestItem(testController, 'junit@junit4.TestEncoding#latin1IsSet', TestKind.JUnit, undefined, '=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit4{TestAnnotation.java[TestEncoding~latin1IsSet');
        const testRunRequest = new TestRunRequest([testItem], []);
        const testRun = testController.createTestRun(testRunRequest);
        const runnerContext: IRunTestContext = {
            isDebug: false,
            kind: TestKind.JUnit,
            projectName: 'junit',
            testItems: [testItem],
            testRun: testRun,
            workspaceFolder: workspace.workspaceFolders?.[0]!,
        };
        const junitRunner =  new JUnitRunner(runnerContext);
        const configuration = await resolveLaunchConfigurationForRunner(junitRunner, runnerContext, {
            classPaths: [
                "/a/b/c.jar",
                "/foo/bar.jar"
            ],
            env: {
                test: "test",
            },
            envFile: "${workspaceFolder}/.env",
            encoding: "ISO-8859-1",
            javaExec: "/usr/bin/java",
            modulePaths: [
                "/test/module.jar",
            ],
            postDebugTask: "test",
            preLaunchTask: "test",
            sourcePaths: [
                "/a/b/c.jar"
            ]
        });
        assert.strictEqual(configuration.encoding, "ISO-8859-1");
    });
});
