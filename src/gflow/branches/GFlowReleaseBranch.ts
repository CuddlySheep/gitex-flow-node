import { GitFlowBranch, BranchType } from '../../api/branches/GitFlowBranch';
import { GitFlowSemVers } from '../../ver/GitFlowSemVers';

/**
 * This class extending a release branch with some helpful functionality.
 */
export class GFlowReleaseBranch implements GitFlowBranch {
  public readonly type: BranchType = 'release';

  private readonly gitFlowBranch: GitFlowBranch;
  private readonly repoPath: string;

  /**
   * Initializes a new instance of this class.
   *
   * @param gitFlowBranch - Git flow branch to be wrapped.
   * @param repoPath - Path of the git repository.
   */
  constructor(gitFlowBranch: GitFlowBranch, repoPath: string) {
    this.gitFlowBranch = gitFlowBranch;
    this.repoPath = repoPath;
  }

  /**
   * Lists all branches of the type '[[type]]'.
   */
  public async list(): Promise<string[]> {
    return await this.gitFlowBranch.list();
  }

  /**
   * Creates and starts a new branch of the type '[[type]]'.
   *
   * @param name - Name of the branch to be started.
   * @param base - Base of the branch should be started from.
   */
  public async start(name?: string, base?: string): Promise<string> {
    const semVer = new GitFlowSemVers(this.repoPath);
    let version: string;
    if (!name) {
      version = await semVer.getBranchVersion('release');
    } else {
      version = name;
    }
    const branch = await this.gitFlowBranch.start(version, base);
    await semVer.commitVersion(version);
    return branch;
  }

  /**
   * Merges and finishes the branch of the branch type '[[type]]'.
   *
   * @param name - Name of the branch to be finished.
   * @param msg - Message to be set for finishing the branch.
   */
  public async finish(name?: string, msg?: string): Promise<void> {
    await this.gitFlowBranch.finish(name, msg);
  }
}
