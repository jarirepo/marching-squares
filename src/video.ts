/**
 * @el video element
 * @fps framerate
 */
export function captureStream(
	el: HTMLVideoElement,
	fps: number
): MediaStream | null {
	if (el) {
		if ("captureStream" in el) {
			return (el["captureStream"] as Function)(fps);
		}
		if ("mozCaptureStream" in el) {
			// Firefox (experimental)
			// https://stackoverflow.com/questions/48623376/typeerror-capturestream-is-not-a-function
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream#Browser_compatibility
			return (el["mozCaptureStream"] as Function)(fps);
		}
	}
	return null;
}
