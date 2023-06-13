import type { Plugin } from 'vite'
import { createPluginName } from './shared/create'
import requestTemplate from './template';
import axios from 'axios';
import qs from 'qs';
import path, { join, dirname } from 'path';
import ora from "ora";
import fs from 'fs';

interface Options {}

async function generateFile() {
  try {
    const query = qs.stringify(
      {
        sort: ['basepath', 'ypid'],
        pagination: {
          page: 1,
          pageSize: 500,
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const spinner = ora('Fetching data').start();
    // add request time to spinner
    const start = Date.now();
    // strapi v4 data: {id (number) attributes (object) meta (object)}
    // const {
    //   data: { data },
    // } = await axios.get(`http://ygfish.ygego.alpha/api/yapis?${query}`);
    // const requestTime = Date.now() - start;
    // spinner.text = `Fetching data (${requestTime}ms)`;

    // const result = Object.fromEntries(data.map((item: any) => [item.attributes['basepath'], `/mock/${item.attributes['ypid']}${item.attributes['basepath']}`]));
	const result = [''];
    // console.log(JSON.stringify(result));
    spinner.succeed('Data fetched');

    const yapiHost = 'http://yapi.ygego.prod';
    const isDev = true;
    const { YGYG_ONLY_CUBE_SITE } = process.env;

    const openYapi = isDev;
    const apiGateway: string = 'hahah';
    console.log('apiGateway=', apiGateway);

    writeTmpFile({
      path: path.resolve(process.cwd(), 'src/HttpClientRuntime.ts'),
      content: requestTemplate({
        hasYapi: YGYG_ONLY_CUBE_SITE === 'site' ? true : Boolean(openYapi),
        apiMapping: result,
        yapiHost: yapiHost,
        apiGateway: apiGateway,
        includesFilter: [],//import.meta.env.includesFilter,
        spliceParm: [0,2],
      }),
    });
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
}


function writeTmpFile({ path, content }: any) {
  try {
    fs.writeFileSync(path, content);
    console.log('临时文件写入成功:', path);
  } catch (err) {
    console.error('临时文件写入失败:', err);
  }
}

const useName = createPluginName(false)

const usePlugin = (options?: Partial<Options>): Plugin => {
	return {
		name: useName('vite-plugin-httpclient'),
		// pre 会较于 post 先执行
		enforce: 'pre', // post

		// 指明它们仅在 'build' 或 'serve' 模式时调用
		apply: 'build', // apply 亦可以是一个函数
	
		// configResolved(resolvedConfig) {
		// 	console.log(
		// 	  'vite 独有的钩子：在解析 vite 配置后调用:resolvedConfig=',
		// 	  resolvedConfig
		// 	);
		// 	generateFile();
		//   },
		buildStart() {
			console.log('这里是 buildStart 钩子');
			generateFile();
		},
		configureServer() {
			console.log('这里是 configureServer 钩子');
			generateFile();
		},
		
	
	}
}

export default usePlugin
