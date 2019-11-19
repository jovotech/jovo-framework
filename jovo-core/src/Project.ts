import * as fs from 'fs';
import * as path from 'path';

export class Project {
  static getInstance() {
    if (!Project.instance) {
      Project.instance = new Project();

      if (fs.existsSync(path.join(process.cwd(), '..', 'project.js'))) {
        const parsedPath = path.parse(path.join(process.cwd(), '..'));
        Project.instance.projectPath = path.join(parsedPath.dir, parsedPath.base);
      } else if (fs.existsSync(path.join(process.cwd(), '..', '..', 'project.js'))) {
        const parsedPath = path.parse(path.join(process.cwd(), '..', '..'));
        Project.instance.projectPath = path.join(parsedPath.dir, parsedPath.base);
        Project.instance.isTypescriptProject = true;
      }

      if (process.argv.includes('--stage')) {
        process.env.JOVO_STAGE = process.argv[process.argv.indexOf('--stage') + 1].trim();
      }
    }
    return Project.instance;
  }

  private static instance: Project;

  private isTypescriptProject = false;
  private projectPath = process.cwd();

  getProjectPath() {
    return this.projectPath;
  }

  getModelsPath() {
    return process.env.JOVO_MODELS_PATH || path.join(this.getProjectPath(), 'models');
  }

  getCwd() {
    return process.cwd();
  }

  getStage() {
    return process.env.JOVO_STAGE;
  }

  isTypescript() {
    return this.isTypescriptProject;
  }
}
