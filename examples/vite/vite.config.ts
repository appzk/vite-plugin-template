import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import template from 'vite-plugin-httpclient';


export default defineConfig({
	plugins: [
		Vue({
			template: {
			  compilerOptions: {
				// ...
			  },
			  transformAssetUrls: {
				// ...
			  },
			},
		  }), 
		Inspect(), 
		template()
	]
})
