import { ViewStyle, PressableStateCallbackType, StyleProp } from "react-native";

type PressableStyle =
	| StyleProp<ViewStyle>
	| ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

function opacityValue(state: PressableStateCallbackType): ViewStyle {
	const opacity = state.pressed ? 0.84 : 1;
	return { opacity };
}

/**
 * Hight order function that takes the pressable state and returns a style object with the opacity property.
 * Returns a function that takes the pressable state and returns a style object.
 */
export function applyOpacity(style: PressableStyle) {
	return (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
		const base = typeof style === "function" ? style(state) : style;

		return [base, opacityValue(state)];
	};
}
