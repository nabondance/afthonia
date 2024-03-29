import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import * as fs from "fs";
import * as path from "path";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('afthonia', 'afthonia.testSuite.create');

export type AfthoniaTestSuiteCreateResult = {
  message: string;
  path: string;
};

export default class AfthoniaTestSuiteCreate extends SfCommand<AfthoniaTestSuiteCreateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    folderPath: Flags.directory({
      summary: messages.getMessage('flags.folderPath.summary'),
      char: 'p',
      required: true,
    }),
  };

  public async run(): Promise<AfthoniaTestSuiteCreateResult> {
    const { flags } = await this.parse(AfthoniaTestSuiteCreate);

    // Handle paths and prepare names
    const folderPath = flags.folderPath;
    const folderName = path.basename(folderPath);
    const testSuiteName = `${folderName}_TestSuite.testSuite-meta.xml`;
    const testSuiteFolderPath = path.join(folderPath, 'testSuites')
    const testSuitePath = path.join(testSuiteFolderPath, testSuiteName)
    let resultMessage;

    // Get the test classes in the folder and subfolders
    const testClasses = await this.getTestClasses(folderPath);

    if (testClasses.length === 0) {
      resultMessage = `No test classes found in folder or subfolders: ${folderName}`;
      this.log(resultMessage);
      return {message: resultMessage, path: null};
    }

    // Make the subfolder in which the test suite will be created
    if (!fs.existsSync(testSuiteFolderPath)) {
        fs.mkdirSync(testSuiteFolderPath);
    }

    // Create the test suite file
    const testSuiteXml = this.generateTestSuiteXml(testClasses);
    await fs.promises.writeFile(testSuitePath, testSuiteXml);

    // Prompt result
    resultMessage = `Test suite written to ${testSuitePath}`;
    this.log(resultMessage);
    return {message: resultMessage, path: testSuitePath};
  }


  public async getTestClasses(folderPath: string): Promise<string[]> {
    const testClasses: string[] = [];

    for await (const file of this.getFiles(folderPath)) {
      const contents = await fs.promises.readFile(file, "utf8");
      if (path.extname(file) === '.cls' && contents.match(/@isTest/i) ) {
        const className = path.basename(file, ".cls");
        testClasses.push(className);
      }
    }

    return testClasses;
  }

  private async* getFiles(dir: string): AsyncGenerator<string> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* this.getFiles(res);
      } else {
        yield res;
      }
    }
  }

  public generateTestSuiteXml(classNames: string[]): string {
    // Static xml for test suite
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const testSuiteOpenTag = '<ApexTestSuite xmlns="http://soap.sforce.com/2006/04/metadata">';
    const testSuiteCloseTag = '</ApexTestSuite>';

    // Add every class names
    const classTags = classNames.map(className => `    <testClassName>${className}</testClassName>`);

    // Generate the .xml content
    const testSuiteXml = `${xmlHeader}\n${testSuiteOpenTag}\n${classTags.join('\n')}\n${testSuiteCloseTag}`;

    return testSuiteXml;
  }

}
