export declare class Project {
    static getInstance(): Project;
    private static instance;
    private isTypescriptProject;
    private projectPath;
    getProjectPath(): string;
    getModelsPath(): string;
    getCwd(): string;
    getStage(): string | undefined;
    getConfigPath(): string;
    getProjectJsPath(): string;
    isTypescript(): boolean;
}
