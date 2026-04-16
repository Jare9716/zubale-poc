import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import BackgroundGeolocation, {
	Subscription,
} from "react-native-background-geolocation";

function GeoScreen() {
	const subscriptions = useRef<Subscription[]>([]);
	const [isTracking, setIsTracking] = useState(false);

	useEffect(() => {
		const subs = subscriptions.current;

		// Register event listeners *before* calling ready()
		subs.push(
			BackgroundGeolocation.onLocation((location) => {
				console.log("[onLocation]", location);
			}),
		);

		// ready() configures the SDK and restores persisted state.
		// It does NOT start tracking — call start()/stop() separately.
		BackgroundGeolocation.ready({
			geolocation: {
				desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
				distanceFilter: 10,
			},
			app: {
				stopOnTerminate: false,
				startOnBoot: true,
			},
			logger: {
				debug: true,
				logLevel: BackgroundGeolocation.LogLevel.Verbose,
			},
		})
			.then((state) => {
				setIsTracking(state.enabled);
				console.log("[ready] SDK configured, enabled:", state.enabled);
			})
			.catch((error) => {
				console.error("[ready] error:", error);
			});

		return () => subs.forEach((s) => s.remove());
	}, []);

	const onToggleTracking = async () => {
		try {
			const state = await BackgroundGeolocation.getState();
			if (state.enabled) {
				await BackgroundGeolocation.stop();
				setIsTracking(false);
				console.log("[stop] tracking stopped");
			} else {
				await BackgroundGeolocation.start();
				setIsTracking(true);
				console.log("[start] tracking started");
			}
		} catch (error) {
			console.error("[toggleTracking] error:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.status}>Tracking: {isTracking ? "ON" : "OFF"}</Text>
			<Button
				title={isTracking ? "Stop Tracking" : "Start Tracking"}
				onPress={onToggleTracking}
			/>
		</View>
	);
}

export default GeoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	status: {
		fontSize: 18,
		fontWeight: "600",
	},
});
