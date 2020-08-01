/**
 * @el video element
 * @fps framerate
 */
export function captureStream(el: HTMLVideoElement, fps: number): MediaStream {
	if (el instanceof HTMLVideoElement) {
		if ('captureStream' in el) {
			return (el['captureStream'] as Function)(fps);
		}
		if ('mozCaptureStream' in el) {
			// Firefox (experimental)
			// https://stackoverflow.com/questions/48623376/typeerror-capturestream-is-not-a-function	
			return (el['mozCaptureStream'] as Function)(fps);
		}
	}
	return null;
}
