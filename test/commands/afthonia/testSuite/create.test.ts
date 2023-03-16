
import { expect, test } from '@oclif/test';

describe('afthonia testSuite create', () => {
  test
    .stdout()
    .command(['afthonia testSuite create'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world');
    });

  test
    .stdout()
    .command(['afthonia testSuite create', '--name', 'Astro'])
    .it('runs hello --name Astro', (ctx) => {
      expect(ctx.stdout).to.contain('hello Astro');
    });
});
