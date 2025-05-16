import Stats from 'stats.js';
import { saveAs, FileSaverOptions } from 'file-saver';
import RecordRTC from 'recordrtc';

import { Grid } from './models/grid';
import { MarchingSquares } from './models/marching-squares';
import { captureStream } from './models/video';

const stats = new Stats();
stats.showPanel( 0 ); // fps
stats.dom.style.position = 'relative';

document.querySelector('#stats').appendChild(stats.dom);
const canvas = document.getElementById('scene') as HTMLCanvasElement;
const context = canvas.getContext('2d');
const video = document.querySelector('video') as HTMLVideoElement;
const stream = captureStream(video, 24);
// console.log('Stream:', stream);

let recorder = null;
if (stream) {
	video.srcObject = stream;
	// https://www.npmjs.com/package/recordrtc
	// recorder = RecordRTC(stream, { type: 'video' });
	// recorder = RecordRTC(canvas, { type: 'video' });
	const recorderOptions = {
		type: 'canvas',
		mimeType: 'video/webm;codecs=vp9',
		disableLogs: true
	};
	recorder = new RecordRTC(canvas, recorderOptions);
	console.log('Recorder:', recorder);	
	// recorder.setRecordingDuration(5000);
	// recorder.startRecording();
	// // setTimeout(() => {
	// // 	recorder.stopRecording();
	// // }, 5000);
}

recorder.onStateChanged = (state: string) => {
	console.log('Recorder state:', state);
};

const saveButton = document.querySelector('#save') as HTMLButtonElement;
// if (!canvas.toBlob) {
// 	saveButton.disabled = true;
// }
saveButton.addEventListener('click', event => {	
	if (canvas.toBlob) {
		canvas.toBlob(blob => {
			// saveAs(blob, 'marching-squares');
			// const file = new File([blob], 'marching-squares.jpg', { type: 'image/jpeg' })
			const file = new File([blob], 'marching-squares.png', { type: 'image/png' })
			saveAs(file);
		});
	}
});

const recordBtn = document.querySelector<HTMLButtonElement>('button#record');
const stopBtn = document.querySelector<HTMLButtonElement>('button#stop');
const downloadBtn = document.querySelector<HTMLButtonElement>('button#download');

recordBtn.onclick = event => {
	if (recorder && recorder.getState() === 'inactive') {
		stopBtn.disabled = false;
		recordBtn.disabled = true;
		downloadBtn.disabled = true;
		recorder.startRecording();
	}
};

stopBtn.onclick = event => {
	if (recorder && recorder.getState() === 'recording') {	// NOTE: recorder.state says 'inctive'
		recorder.stopRecording(() => {
			recordBtn.disabled = false;
			stopBtn.disabled = true;
			downloadBtn.disabled = false;	
		});
	}
};

downloadBtn.onclick = event => {
	if (recorder) {
		// recorder.save('marching-squares.webm');
		const blob = recorder.getBlob();
		console.log(blob);
		saveAs(blob, 'marching-squares');
	}
};

// const grid = new Grid({
// 	gridSizeX: 4,
// 	gridSizeY: 3,
// 	cellSize: 160,
// 	displacement: 1 / 3,
// 	randomize: true
// });

// const grid = new Grid({
// 	gridSizeX: 20,
// 	gridSizeY: 15,
// 	cellSize: 32,
// 	displacement: .25,
// 	randomize: false,
// 	// randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 7.5) / 15, 2) + Math.pow((j - 10) / 20, 2))
// 	// randomizer: (i: number, j: number) => (i > 0 && i < 15 && j > 0 && j < 20) ? Math.random() : 0
// 	randomizer: (i: number, j: number) => (i > 0 && i < 15 && j > 0 && j < 20) ? 1 : 0
// });

const grid = new Grid({
	gridSizeX: 40,
	gridSizeY: 30,
	cellSize: 16,
	displacement: 1 / 3,
	randomize: false,
	// randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 15) / 30, 2) + Math.pow((j - 20) / 40, 2))
	// randomizer: (i: number, j: number) => (i > 0 && i < 30 && j > 0 && j < 40) ? Math.random() : 0
	randomizer: (i: number, j: number) => (i > 0 && i < 30 && j > 0 && j < 40) ? 0 : 0
});

// const grid = new Grid({
// 	gridSizeX: 80,
// 	gridSizeY: 60,
// 	cellSize: 8,
// 	displacement: 1 / 3,
// 	randomize: false,
// 	// randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 15) / 30, 2) + Math.pow((j - 20) / 40, 2))
// 	randomizer: (i: number, j: number) => (i > 0 && i < 60 && j > 0 && j < 80) ? Math.random() : 0
// 	// randomizer: (i: number, j: number) => (i > 0 && i < 30 && j > 0 && j < 40) ? 0 : 0
// });

// const grid = new Grid({
// 	gridSizeX: 160,
// 	gridSizeY: 120,
// 	cellSize: 4,
// 	displacement: 1 / 3,
// 	randomize: false,
// 	// randomizer: (i: number, j: number) => 2 * Math.sqrt(Math.pow((i - 15) / 30, 2) + Math.pow((j - 20) / 40, 2))
// 	randomizer: (i: number, j: number) => (i > 0 && i < 120 && j > 0 && j < 160) ? Math.random() : 0
// 	// randomizer: (i: number, j: number) => (i > 0 && i < 30 && j > 0 && j < 40) ? 0 : 0
// });

grid.addBulge(10, 20, 5);
grid.addBulge(20, 15, 11);
grid.addBulge(30, 20, 5);
grid.addBulge(20, 5, 5);

const ms = new MarchingSquares(grid, { isoValue: .6 });

// ms.update();

function animate(time = 0) {
	stats.begin();

	ms.opts.isoValue = .5 *  (Math.sin(2 * Math.PI / 1e4 * time) + 1);
	ms.update();

	context.fillStyle = '#fff';
	context.fillRect(0, 0, canvas.width, canvas.height);

	grid.show(context);
	ms.show(context);

	stats.end();
	requestAnimationFrame(animate);
}

animate();
