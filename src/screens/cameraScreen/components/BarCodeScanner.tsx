import { useRef } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { CameraView } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

interface Props {
	onClose: () => void;
}

export function BarCodeScanner({ onClose }: Props) {
	const scannedRef = useRef(false);
	const insets = useSafeAreaInsets();

	function handleBarcodeScanned({
		type,
		data,
	}: {
		type: string;
		data: string;
	}) {
		if (scannedRef.current) return;
		scannedRef.current = true;

		Alert.alert("Barcode scanned", `Type: ${type}\nData: ${data}`, [
			{
				text: "OK",
				onPress: () => {
					scannedRef.current = false;
				},
			},
		]);
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<Pressable onPress={onClose}>
					<MaterialIcons name="close" size={24} color="darkblue" />
				</Pressable>
			</View>

			<CameraView
				style={styles.camera}
				barcodeScannerSettings={{
					barcodeTypes: ["qr", "ean13", "code128"],
				}}
				onBarcodeScanned={handleBarcodeScanned}
				autofocus="on"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	header: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "white",
	},
	closeButton: {
		fontSize: 16,
		fontWeight: "600",
		color: "darkblue",
	},
	camera: {
		flex: 1,
	},
});
