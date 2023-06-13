import HttpClient, { businessMiddleware, registry, requestErrorHandler, axiosRequest } from '@ygyg/http-client';
import { message, Modal } from 'antd';  
import { openKickOffModal, openSecurity, clearAuth } from '@@/plugin-request/middlewares/auth';

registry.add('openKickOffModal', openKickOffModal);
registry.add('openSecurity', openSecurity);
registry.add('clearAuth', clearAuth);
registry.add('messageError', (msg: any)=> {
  message.error(msg);
});


// 这里必然是已经 判断了 NODE_ENV , 不需要 Gateway
HttpClient.instance.defaults.baseURL = 'hahah';

const includesFilter = [];
HttpClient.instance.defaults.yapi = true ? {
    spliceParm: [0,2],
    includesFilter: includesFilter,
    yapiHost: 'http://yapi.ygego.prod',
    apiMapping: [""],
  } : undefined;
HttpClient.use(businessMiddleware);
console.log(process.env.apiGateway, process.env.UMI_ENV);
console.log(HttpClient.instance.defaults.yapi);
  