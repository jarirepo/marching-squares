# marching-squares
Implements the [marching squares][marching-squares] algorithm (animated).

<video controls autoplay muted width="500" src="screenshots/marching-squares-01.webm" type="video/webm"></video>

## Features
- Marching squares visualization
- Save recording
- Save canvas as image

## Serving index.html

First, install Yarn package manager globally

```bash
$ npm i -g yarn
```
Next, install all dependencies with the command
```bash
$ yarn install
```
Now, you should be able to start the server with
```bash
$ yarn start
```
Open your browser at http://localhost:3000


## Examples
<img src="screenshots/marching-squares-example-01.png">
<img src="screenshots/marching-squares-example-02.png">

[marching-squares]: https://en.wikipedia.org/wiki/Marching_squares
[parcel]: https://parceljs.org/
[file-saver]: https://ghub.io/file-saver
[recordrtc]: https://github.com/muaz-khan/RecordRTC
[RecordRTC-web]: https://recordrtc.org
[html-video]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
[html-video-recording-tutorial]: https://medium.com/@amatewasu/how-to-record-a-canvas-element-d4d0826d3591
