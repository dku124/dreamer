import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
	server: {
	  port: 3001,
	},
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/common/styles/variables.scss";`, // Import your SCSS variables or other global styles
      },
		less: {
		  	javascriptEnabled: true,
			modifyVars: {
				'primary-color': '#1DA57A',
				'link-color': '#1DA57A',
				'border-radius-base': '2px',
			},
		}
    },
  },
	optimizeDeps: {
		exclude: ['chartjs-plugin-datalabels']
	},
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@components", replacement: "/src/components" },
      { find: "@layouts", replacement: "/src/common/layouts" },
      { find: "@styles", replacement: "/src/common/styles" },
      { find: "@providers", replacement: "/src/common/providers" },
      { find: "@hooks", replacement: "/src/common/hooks" },
      { find: "@utils", replacement: "/src/common/utils" },
      { find: "@store", replacement: "/src/common/store" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@services", replacement: "/src/services" },
      { find: "@types", replacement: "/src/types" },
      { find: "@hook", replacement: "/src/common/hooks" },
      { find: "@assets", replacement: "/src/assets" }
    ],
  },
  build: {
    copyPublicDir: true,
	  
  },
  
})
