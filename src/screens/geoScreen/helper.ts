import BackgroundGeolocation, {
	Location,
} from "react-native-background-geolocation";
import { File, Paths } from "expo-file-system";
import { shareAsync, isAvailableAsync } from "expo-sharing";
import { simpleAlert } from "@/utils/alerts";

export const GEO_CONFIG = {
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
} as const;

export function formatLocationLine(
	location: Location,
	index?: number,
	total?: number,
): string {
	const prefix =
		index !== undefined && total !== undefined
			? `[session][${index + 1}/${total}] `
			: "";
	return (
		`${prefix}${location.timestamp} | ` +
		`lat: ${location.coords.latitude}, lng: ${location.coords.longitude} | ` +
		`accuracy: ${location.coords.accuracy}m | odometer: ${location.odometer}m`
	);
}

export async function printSession(): Promise<void> {
	const locations = (await BackgroundGeolocation.getLocations()) as Location[];
	console.log(`[session] ${locations.length} locations recorded`);
	locations.forEach((loc, i) =>
		console.log(formatLocationLine(loc, i, locations.length)),
	);
	const summary =
		locations.length === 0
			? "No locations recorded."
			: locations
					.map((loc, i) => formatLocationLine(loc, i, locations.length))
					.join("\n");
	simpleAlert(`Session (${locations.length} locations)`, summary);
}

export async function clearDB(): Promise<void> {
	await BackgroundGeolocation.destroyLocations();
	simpleAlert("DB", "Database cleared.");
}

export async function toggleTracking(): Promise<boolean> {
	const state = await BackgroundGeolocation.getState();
	if (state.enabled) {
		await BackgroundGeolocation.stop();
		console.log("[stop] tracking stopped");
		return false;
	}
	await BackgroundGeolocation.start();
	console.log("[start] tracking started");
	return true;
}

export async function shareSessionAsText(): Promise<void> {
	const locations = (await BackgroundGeolocation.getLocations()) as Location[];
	if (locations.length === 0) {
		simpleAlert("Share", "No locations to share.");
		return;
	}

	const header = `Session Export — ${new Date().toISOString()}\n`;
	const separator = "─".repeat(60) + "\n";
	const lines = locations
		.map((loc, i) => formatLocationLine(loc, i, locations.length))
		.join("\n");

	const file = new File(Paths.cache, `geo-session-${Date.now()}.txt`);
	file.write(header + separator + lines + "\n");

	if (!(await isAvailableAsync())) {
		console.warn("[share] Sharing not available on this device");
		simpleAlert("Share", "Sharing is not available on this device.");
		return;
	}
	await shareAsync(file.uri, {
		mimeType: "text/plain",
		UTI: "public.plain-text",
		dialogTitle: "Share GPS Session",
	});
}
