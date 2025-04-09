# Audio Chopper

A simple and intuitive web application for splitting audio files into multiple clips. Built with Next.js, TypeScript, and the Web Audio API.

## Features

- Upload audio files
- Visual waveform display
- Play/pause controls
- Split audio at any point
- Download individual clips in WAV format
- All processing happens in the browser (your files stay private)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/digitalRM/audio-chopper.git
cd audio-chopper
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Upload Audio File" to select an audio file
2. Use the play/pause button to control playback
3. Click "Split at Current Position" to create a split point
4. Download individual clips using the download buttons

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- wavesurfer.js
- Web Audio API
- Lucide Icons

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Ruslan Mukhamedvaleev - [ruslan.in](https://www.ruslan.in)

## Acknowledgments

- [wavesurfer.js](https://wavesurfer-js.org/) for the audio visualization
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for audio processing
