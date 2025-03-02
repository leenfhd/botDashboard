import Fuse from 'fuse.js';
 
export function fuzzySearch(data: BotDetectionData[], searchTerm: string): BotDetectionData[] {
   
    
    const options = {   
        isCaseSensitive: false,
        keys: [
         
                'apiInfo.name',
                'apiInfo.parameters.websiteUrl',
                'apiInfo.runId',
                'apiInfo.result.cloudflare.detected',
                'apiInfo.result.cloudflare.isBlocking',
                'apiInfo.result.websiteUrl',
                'apiInfo.result.isStaticFile',
                'apiInfo.result.customCaptcha.detected',
                'apiInfo.result.customCaptcha.isBlocking',
                'apiInfo.result.googleCaptcha.detected',
                'apiInfo.result.googleCaptcha.isBlocking',
                'apiInfo.result.hCaptchaDetected',
                'apiInfo.result.captchaHeadersDetected',
                'apiInfo.result.captchaNetworkDetected',
                'apiInfo.result.captchaBehaviorDetected',
                'apiInfo.error.error',
                'apiInfo.error.message',
                'workspaceId',
                'project.name',
                'project.id',
                'projectJob.id',
                'projectJobRun.id'
            
        ]
        
    };
     
      
    const fuse = new Fuse(data, options);

    const results = fuse.search(searchTerm);
  
      //console.log(results);
      return  results.map(result => result.item);
}
