import { useState } from "react";
import { Modal, StyleSheet, Text, View, Pressable } from "react-native";

import { useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "./components/BarCodeScanner";

import { FilledButton } from "@/components";

function CameraScreen() {
	const [permission, requestPermission] = useCameraPermissions();

	const [openBarCodeScanner, setOpenBarCodeScanner] = useState(false);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<View style={styles.buttonsContainer}>
					<FilledButton
						title="Grant Permission"
						onPress={requestPermission}
						style={styles.button}
					/>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.buttonsContainer}>
				<FilledButton
					title="Bar Code Scanner"
					onPress={() => setOpenBarCodeScanner(true)}
					style={styles.button}
				/>
			</View>
			<Modal
				animationType="fade"
				visible={openBarCodeScanner}
				presentationStyle="overFullScreen"
				statusBarTranslucent={true}
				transparent={true}
			>
				<BarCodeScanner onClose={() => setOpenBarCodeScanner(false)} />
			</Modal>
		</View>
	);
}

export default CameraScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "white",
	},
	buttonsContainer: {
		paddingHorizontal: 16,
		gap: 16,
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		height: 48,
		backgroundColor: "darkblue",
		borderRadius: 8,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
});
