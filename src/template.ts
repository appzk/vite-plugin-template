interface IHttpClient {
  hasYapi: boolean;
  apiMapping: object;
  yapiHost: string;
  spliceParm: Array<number>;
  apiGateway?: string;
  includesFilter?: string[]
}
export default (opt: IHttpClient) => {
  const { hasYapi= false, apiMapping = {}, apiGateway='/', spliceParm= [0, 2], yapiHost='http://yapi.ygego.prod', includesFilter = [],  } = opt;
  const jsonMapping = JSON.stringify(apiMapping);
  const jsonSpliceParm = JSON.stringify(spliceParm);
  const jsonIncludesFilter = JSON.stringify(includesFilter);
  return `import HttpClient, { businessMiddleware, registry, requestErrorHandler, axiosRequest } from '@ygyg/http-client';
import { message, Modal } from 'antd';  
import { openKickOffModal, openSecurity, clearAuth } from '@@/plugin-request/middlewares/auth';

registry.add('openKickOffModal', openKickOffModal);
registry.add('openSecurity', openSecurity);
registry.add('clearAuth', clearAuth);
registry.add('messageError', (msg: any)=> {
  message.error(msg);
});


// 这里必然是已经 判断了 NODE_ENV , 不需要 Gateway
HttpClient.instance.defaults.baseURL = '${apiGateway}';

const includesFilter = ${jsonIncludesFilter};
HttpClient.instance.defaults.yapi = ${hasYapi} ? {
    spliceParm: ${jsonSpliceParm},
    includesFilter: includesFilter,
    yapiHost: '${yapiHost}',
    apiMapping: ${jsonMapping},
  } : undefined;
HttpClient.use(businessMiddleware);
console.log(process.env.apiGateway, process.env.UMI_ENV);
console.log(HttpClient.instance.defaults.yapi);
  `;
};
