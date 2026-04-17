import {
	Pressable,
	Text,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from "react-native";

import { applyOpacity } from "@/utils/pressablesFeedback";

type ButtonProps = {
	title: string;
	onPress: () => void;
	style: StyleProp<ViewStyle>;
};

export function FilledButton({ title, onPress, style }: ButtonProps) {
	return (
		<Pressable style={applyOpacity(style)} onPress={onPress}>
			<Text style={styles.filledButtonText}>{title}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	filledButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
	},
});
