import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { CameraScreen, GeoScreen } from "@/screens";

export const BottomTab = createBottomTabNavigator({
	screens: {
		Camera: CameraScreen,
		Geo: GeoScreen,
	},
});
