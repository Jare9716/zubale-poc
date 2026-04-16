import { createStaticNavigation } from "@react-navigation/native";

import { RootStack } from "./rootStack";

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
