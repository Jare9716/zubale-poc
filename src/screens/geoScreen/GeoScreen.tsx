import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

import BackgroundGeolocation, {
	Subscription,
} from "react-native-background-geolocation";

import { simpleAlert } from "@/utils/alerts";

import {
	GEO_CONFIG,
	formatLocationLine,
	printSession,
	clearDB,
	toggleTracking,
	shareSessionAsText,
} from "./helper";

import { FilledButton } from "@/components/button";

function GeoScreen() {
	const subscriptions = useRef<Subscription[]>([]);
	const [isTracking, setIsTracking] = useState(false);

	useEffect(() => {
		const subs = subscriptions.current;

		subs.push(
			BackgroundGeolocation.onLocation((location) => {
				console.log(`[onLocation] ${formatLocationLine(location)}`);
			}),
		);

		BackgroundGeolocation.ready(GEO_CONFIG)
			.then((state) => {
				setIsTracking(state.enabled);
				console.log("[ready] SDK configured, enabled:", state.enabled);
			})
			.catch((error) => simpleAlert("[ready] error:", error));

		return () => subs.forEach((s) => s.remove());
	}, []);

	const onPrintSession = async () => {
		try {
			await printSession();
		} catch (e) {
			console.error("[printSession] error:", e);
		}
	};

	const onClearDB = async () => {
		try {
			await clearDB();
		} catch (e) {
			console.error("[clearDB] error:", e);
		}
	};

	const onToggleTracking = async () => {
		try {
			setIsTracking(await toggleTracking());
		} catch (e) {
			console.error("[toggleTracking] error:", e);
		}
	};

	const onShareSession = async () => {
		try {
			await shareSessionAsText();
		} catch (e) {
			console.error("[shareSession] error:", e);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.status}>Tracking: {isTracking ? "ON" : "OFF"}</Text>
			<FilledButton
				title={isTracking ? "Stop Tracking" : "Start Tracking"}
				onPress={onToggleTracking}
				style={styles.button}
			/>
			<FilledButton
				title="Print Session"
				onPress={onPrintSession}
				style={styles.button}
			/>
			<FilledButton
				title="Share Session"
				onPress={onShareSession}
				style={styles.button}
			/>
			<FilledButton
				title="Clear DB"
				onPress={onClearDB}
				style={[styles.button, styles.dangerButton]}
			/>
		</View>
	);
}

export default GeoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		gap: 16,
		paddingHorizontal: 16,
		backgroundColor: "white",
	},
	status: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "600",
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
	dangerButton: {
		backgroundColor: "darkred",
	},
});
