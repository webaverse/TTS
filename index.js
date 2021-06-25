// Imports the Google Cloud client library for Beta API
/**
 * TODO(developer): Update client library import to use new
 * version of API when desired features become available
 */
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');

(async () => {

	console.log('load 1');

	// Creates a client
	const options = {
		keyFilename: 'webaverse-gcloud-key.json',
		projectId: 'webaverse',
	};
	const client = new speech.SpeechClient(options);

	/**
	 * TODO(developer): Uncomment the following lines before running the sample.
	 */
	// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
	// const model = 'Model to use, e.g. phone_call, video, default';
	// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
	// const sampleRateHertz = 16000;
	// const languageCode = 'BCP-47 language code, e.g. en-US';

	console.log('load 2');

  const operations = [];
  for (let i = 1; i <= 48; i++) {
		const s = (i + '').padStart(2, '0');
		
		const config = {
			encoding: 'LINEAR16',
			sampleRateHertz: 22050,
			languageCode: 'en-US',
			enableWordTimeOffsets: true,
			enableAutomaticPunctuation: true,
			/* enableSpeakerDiarization: true,
			diarizationSpeakerCount: 2, */
			diarizationConfig: {
				enableSpeakerDiarization: true,
				minSpeakerCount: 2,
				maxSpeakerCount: 4,
		  },
			// model: 'video',
			model: 'default',
			useEnhanced: true,
		};
		const audio = {
			// content: fs.readFileSync('colorworld/lol.wav').toString('base64'),
			uri: `gs://webaverse/${s} - Colorworld - Rachel E. Kelly.wav`,
		};

		console.log('load ' + i + ' 3');

		const request = {
			config: config,
			audio: audio,
		};

		// Detects speech in the audio file
		// const [response] = await client.recognize(request);
		const [operation] = await client.longRunningRecognize(request);
		console.log('load ' + i + ' 4');
		operations.push(operation);
  }
	for (let i = 0; i < operations.length; i++) {
		const j = i+1;
		const s = (j + '').padStart(2, '0');
		
		const operation = operations[i];
		// Get a Promise representation of the final result of the job
		const [response] = await operation.promise();
		console.log('load ' + i + ' 5');
		fs.writeFileSync('transcript-' + s + '.json', JSON.stringify(response, null, 2));
		console.log('load ' + i + ' 6');
		const transcription = response.results
			.map(result => result.alternatives[0].transcript)
			.join('\n');
		console.log('Transcription: ', i, transcription.length);
  }
})();