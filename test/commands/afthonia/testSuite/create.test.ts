import { expect } from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import * as path from 'path';
import AfthoniaTestSuiteCreate from '../../../../src/commands/afthonia/testSuite/create';
import { Config } from '@oclif/core/lib/config';

describe('AfthoniaTestSuiteCreate', () => {
  let plugin: AfthoniaTestSuiteCreate;
  let sandbox: sinon.SinonSandbox;
  const tempDir = path.resolve(__dirname, 'temp');

  beforeEach(async() => {
    // Setup: create temporary directory structure with dummy test classes...
    sandbox = sinon.createSandbox();
    const config = new Config({ root: path.resolve(__dirname, '../../package.json') });
    plugin = new AfthoniaTestSuiteCreate([`--folderPath=${tempDir}`], config);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    sandbox.restore();
    // Cleanup: delete temporary directory structure...
    fs.rmdirSync(tempDir, { recursive: true });
  });

  it('should identify test classes correctly', async() => {
    // Create some dummy test classes and non-test classes
    fs.writeFileSync(path.join(tempDir, 'Test1.cls'), '@isTest\nclass Test1 {}');
    fs.writeFileSync(path.join(tempDir, 'Test2.cls'), '@isTest\nclass Test2 {}');
    fs.writeFileSync(path.join(tempDir, 'NotATest.cls'), 'class NotATest {}');

    const testClasses = await plugin.getTestClasses(tempDir);
    expect(testClasses).to.deep.equal(['Test1', 'Test2']);
  });

  it('should generate test suite XML correctly', () => {
    const classNames = ['Test1', 'Test2'];
    const expectedXml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<ApexTestSuite xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
      '    <testClassName>Test1</testClassName>\n' +
      '    <testClassName>Test2</testClassName>\n' +
      '</ApexTestSuite>';
    const xml = plugin.generateTestSuiteXml(classNames);
    expect(xml).to.equal(expectedXml);
  });

  it('should create test suite folder and XML file correctly', async () => {
    // Create some dummy test classes
    fs.writeFileSync(path.join(tempDir, 'Test1.cls'), '@isTest\nclass Test1 {}');
    fs.writeFileSync(path.join(tempDir, 'Test2.cls'), '@isTest\nclass Test2 {}');

    // Stub the log method to prevent console output during testing
    const logStub = sandbox.stub(plugin, 'log');

    await plugin.run();

    const testSuiteFolderPath = path.join(tempDir, 'testSuites');
    const testSuitePath = path.join(testSuiteFolderPath, 'temp_TestSuite.testSuite-meta.xml');
    expect(fs.existsSync(testSuiteFolderPath)).to.be.true;
    expect(fs.existsSync(testSuitePath)).to.be.true;

    // Restore the log method
    logStub.restore();
  });

  it('should handle no test classes', async() => {
    // Create some dummy non-test classes
    fs.writeFileSync(path.join(tempDir, 'NotATest.cls'), 'class NotATest {}');

    // Stub the log method to prevent console output during testing
    const logStub = sandbox.stub(plugin, 'log');

    await plugin.run();

    const testSuiteFolderPath = path.join(tempDir, 'testSuites');
    const testSuitePath = path.join(testSuiteFolderPath, 'temp_TestSuite.testSuite-meta.xml');
    expect(fs.existsSync(testSuiteFolderPath)).to.be.false;
    expect(fs.existsSync(testSuitePath)).to.be.false;

    // Restore the log method
    logStub.restore();
  });
});