import { resolve, join } from 'path';
import { AvhGitFlow } from '../src/avh/AvhGitFlow';
import { GitFlow } from '../src/api/GitFlow';
import { GitFlowTester } from './GitFlowTester';
import { assert } from 'chai';

const testRepoPath = resolve(join('.', 'test_repo'));

describe('Test AVH git flow implementation', function () {
  this.beforeAll(() => this.timeout(0));

  it('git flow version', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.assertVersion();
    await tester.dispose();
  });

  it('git flow init with defaults', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.assertInit();
    await tester.dispose();
  });

  it('git flow init with custom settings', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.assertInit({
      featureBranchPrefix: 'feat/',
      bugfixBranchPrefix: 'fix/',
      supportBranchPrefix: 'supp/',
      versionTagPrefix: 'v',
    });
    await tester.dispose();
  });

  it('git flow re-init', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.assertInit();
    await tester.assertInit(
      {
        featureBranchPrefix: 'feat/',
        bugfixBranchPrefix: 'fix/',
        supportBranchPrefix: 'supp/',
        versionTagPrefix: 'v',
      },
      true,
    );
    await tester.dispose();
  });

  it('git flow feature "#1"', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();
    const branch = tester.selectBranch('feature');
    const branchName = await branch.start('#1');
    assert.equal(branchName, 'refs/heads/feature/#1');
    await branch.commit('feature.txt', 'feat(scope): Added feature.txt');
    await branch.finish();
    await tester.dispose();
  });

  it('git flow bugfix "#2', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();
    const branch = tester.selectBranch('bugfix');
    const branchName = await branch.start('#2');
    assert.equal(branchName, 'refs/heads/bugfix/#2');
    await branch.commit('bugfix.txt', 'fix(scope): Added bugfix.txt');
    await branch.finish();
    await tester.dispose();
  });

  it('git flow release "1.0.0"', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();
    const branch = tester.selectBranch('release');
    const branchName = await branch.start('1.0.0');
    assert.equal(branchName, 'refs/heads/release/1.0.0');
    await branch.commit('release_bugfix.txt', 'fix(scope): Added release_bugfix.txt');
    await branch.finish('1.0.0', '1.0.0');
    await tester.dispose();
  });

  it('git flow hotfix "1.0.1"', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();
    const branch = tester.selectBranch('hotfix');
    const branchName = await branch.start('1.0.1');
    assert.equal(branchName, 'refs/heads/hotfix/1.0.1');
    await branch.commit('hotfix_bugfix.txt', 'fix(scope): Added hotfix_bugfix.txt');
    await branch.finish('1.0.1', '1.0.1');
    await tester.dispose();
  });

  it('git flow support "1.0.0-lts"', async function () {
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();
    const branch = tester.selectBranch('support');
    const branchName = await branch.start('1.0.0-lts', 'master');
    assert.equal(branchName, 'refs/heads/support/1.0.0-lts');
    await branch.commit('support_feature.txt', 'feat(scope): Added support_feature.txt');
    await tester.dispose();
  });

  it('git flow integration run', async function () {
    this.timeout(0);
    const tester = new GitFlowTester(createGitFlow(), testRepoPath);
    await tester.init();

    const feature1 = tester.selectBranch('feature');
    await feature1.start('#1');
    await feature1.commit('feature.txt', 'feat(scope): Added feature.txt');

    const bugfix1 = tester.selectBranch('bugfix');
    await bugfix1.start('#2');
    await bugfix1.commit('bugfix.txt', 'fix(scope): Added bugfix.txt');

    await feature1.finish('#1');
    await bugfix1.finish('#2');

    const release = tester.selectBranch('release');
    await release.start('1.0.0');
    await release.commit('release_bugfix.txt', 'fix(scope): Added release_bugfix.txt');
    await release.finish('1.0.0', '1.0.0');

    const support = tester.selectBranch('support');
    await support.start('1.0.0-lts', 'master');
    await support.commit('support_feature.txt', 'feat(scope): Added support_feature.txt');

    await tester.dispose();
  });
});

function createGitFlow(): GitFlow {
  return new AvhGitFlow(testRepoPath);
}
