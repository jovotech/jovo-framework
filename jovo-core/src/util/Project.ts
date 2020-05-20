import * as fs from 'fs';
import * as path from 'path';

export class Project {
  static getInstance() {
    if (!Project.instance) {
      Project.instance = new Project();

      if (process.env.JEST_WORKER_ID) {
        Project.instance.projectPath = process.cwd();
      } else if (process.cwd().endsWith(path.sep + 'dist' + path.sep + 'src')) {
        Project.instance.projectPath = process
          .cwd()
          .replace(path.sep + 'dist' + path.sep + 'src', '');
      } else if (process.cwd().endsWith(path.sep + 'src')) {
        Project.instance.projectPath = process.cwd().replace(path.sep + 'src', '');
      }

      if (fs.existsSync(path.join(Project.instance.projectPath, 'src', 'index.ts'))) {
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
    return process.env.JOVO_STAGE || process.env.STAGE || process.env.NODE_ENV;
  }

  getConfigPath() {
    if (process.env.JOVO_CONFIG) {
      return process.env.JOVO_CONFIG;
    }

    if (this.isTypescript()) {
      return path.join(this.projectPath, 'dist', 'src', 'config.js');
    }

    return path.join(this.projectPath, 'src', 'config.js');
  }

  getProjectJsPath() {
    return path.join(this.projectPath, 'project.js');
  }

  isTypescript() {
    return this.isTypescriptProject;
  }
}
