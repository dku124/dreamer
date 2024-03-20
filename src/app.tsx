import React from "react";
import {ConfigProvider, theme} from "antd";
import viVN from "antd/lib/locale/vi_VN";

const { defaultAlgorithm, darkAlgorithm } = theme;
const App = () => {
	
	const [isDarkMode, setIsDarkMode] = React.useState(false);
	
	
	
	return (
		
		<ConfigProvider
			theme={{
				algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
			}}
			locale={viVN}
		>
			
		</ConfigProvider>
			
	)
}

export default App