import { expect, test } from '@salesforce/command/lib/test';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import AfthoniaTestSuiteCreate from '../../../../src/commands/afthonia/testSuite/create';

describe('afthonia:testSuite:create', () => {
  const folderPath = 'test/fixtures/testClasses';
  const testSuiteFolderPath = path.join(folderPath, 'testSuites');
  const testSuiteName = `${path.basename(folderPath)}_TestSuite.testSuite-meta.xml`;
  const testSuitePath = path.join(testSuiteFolderPath, testSuiteName);

  let existsSyncStub: sinon.SinonStub<any[], any>;
  let mkdirSyncStub: sinon.SinonStub<any[], any>;
  let writeFileStub: sinon.SinonStub<any[], any>;

  beforeEach(() => {
    existsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
    mkdirSyncStub = sinon.stub(fs, 'mkdirSync');
    writeFileStub = sinon.stub(fs.promises, 'writeFile');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
    .do(() => {
      existsSyncStub.withArgs(testSuiteFolderPath).returns(true);
    })
    .do(() => {
      return AfthoniaTestSuiteCreate.run(['--folderPath', folderPath]);
    })
    .it('creates test suite file in existing folder', () => {
      sinon.assert.calledWithExactly(mkdirSyncStub, testSuiteFolderPath);
      sinon.assert.calledWithExactly(writeFileStub, testSuitePath, sinon.match.string);
    });

  test
    .do(() => {
      return AfthoniaTestSuiteCreate.run(['--folderPath', folderPath]);
    })
    .it('creates test suite file in new folder', () => {
      sinon.assert.calledWithExactly(mkdirSyncStub, testSuiteFolderPath);
      sinon.assert.calledWithExactly(writeFileStub, testSuitePath, sinon.match.string);
    });

  test
    .do(() => {
      existsSyncStub.withArgs(testSuiteFolderPath).returns(true);
      writeFileStub.rejects(new Error('Permission denied'));
    })
    .command(['afthonia:testSuite:create', '--folderPath', folderPath])
    .catch((error) => {
      expect(error.message).to.equal('Permission denied');
    })
    .it('handles file write errors', () => {
      sinon.assert.calledWithExactly(mkdirSyncStub, testSuiteFolderPath);
      sinon.assert.calledWithExactly(writeFileStub, testSuitePath, sinon.match.string);
    });
});
