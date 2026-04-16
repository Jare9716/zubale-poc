import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BottomTab } from "./bottomTab";

export const RootStack = createNativeStackNavigator({
	screens: {
		BottomTab: {
			screen: BottomTab,
			options: {
				headerShown: false,
			},
		},
	},
});
