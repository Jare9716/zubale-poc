import { Alert } from "react-native";

export function simpleAlert(title: string, message: string) {
	Alert.alert(title, message, [
		{
			text: "Cerrar",
			style: "cancel",
		},
	]);
}
