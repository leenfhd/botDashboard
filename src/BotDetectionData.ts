
interface CaptchaInfo {
    detected: boolean;
    isBlocking: boolean;
}

interface ApiError {
    error: string;
    message: string;
}

interface ApiResult {
    cloudflare: CaptchaInfo;
    websiteUrl: string;
    isStaticFile: boolean;
    customCaptcha: CaptchaInfo;
    googleCaptcha: CaptchaInfo;
    hCaptchaDetected: boolean;
    captchaHeadersDetected: boolean;
    captchaNetworkDetected: boolean;
    captchaBehaviorDetected: boolean;
}

interface ApiInfo {
    name: string;
    parameters: {
        websiteUrl: string;
    };
    runId: string;
    result: ApiResult;
    error: ApiError;
}

interface Project {
    name: string;
    id: string;
}

interface ProjectJob {
    id: string;
}

interface ProjectJobRun {
    id: string;
}

interface BotDetectionData {
    apiInfo: ApiInfo;
    workspaceId: string;
    project: Project;
    projectJob: ProjectJob;
    projectJobRun: ProjectJobRun;
}