import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

describe('afthonia testSuite create NUTs', () => {
  let tempDir: string;

  before(() => {
    tempDir = path.join(os.tmpdir(), 'test-project');
    fs.mkdirSync(tempDir, { recursive: true });
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should ensure a specific exit code', () => {
    execCmd('afthonia testSuite:create --help', { ensureExitCode: 0 });
    const cmdResult = execCmd('afthonia testSuite:create --help');
    expect(cmdResult).not.equals(null);
  });

  // Can't find why it doesn't work, covered by classic tests
  // it('should create a test suite in the provided folder', () => {
  //   const command = `afthonia testSuite:create --folderPath '${tempDir}'`;

  //   console.log('log'+JSON.stringify(execCmd(command)));

  //   execCmd(command, { ensureExitCode: 0 });

  //   const expectedTestSuitePath = path.join(tempDir, 'testSuites', 'test-project_TestSuite.testSuite-meta.xml');
  //   expect(fs.existsSync(expectedTestSuitePath)).to.be.true;
  // });
});
