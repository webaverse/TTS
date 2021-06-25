const fs = require("fs");
const {toWords} = require("number-to-words");
const Ciseaux = require("ciseaux/node");

(async () => {
  const _date = t => {
		const secs =
			`${t.seconds || 0}` +
			'.' +
			(t.nanos || 0) / 100000000;
		return parseFloat(secs);
	};

  const metadatas = [];
	let totalDuration = 0;
  for (let k = 1; k <= 48; k++) {
    const s1 = (k + '').padStart(2, '0');
		
		const wavPath = `mp3/wav/${s1} - Colorworld - Rachel E. Kelly.wav`;
		const transcriptPath = `transcript-${s1}.json`;

    console.log('start new file pair', [wavPath, transcriptPath]);

    const tape = await Ciseaux.from('./' + wavPath);

		const transcript = require('./' + transcriptPath);
		const {results} = transcript;
		const sentences = results;

		const rs = [];
		for (const sentence of sentences) {
			const {alternatives: [alternative]} = sentence;
			// const alternative = alternatives[0];
			const {words} = alternative;
			let lastSpeakerTag = words[0].speakerTag;
			if (lastSpeakerTag) {
				let ws = [];

				const _shiftWords = () => {
					// if (ws.length >= 8) { // filter out short phrases
						const firstWord = ws[0];
						const lastWord = ws[ws.length - 1];
						/* if (!firstWord.startTime) {
							console.warn();
							throw new Error('fail');
						} */
						const startTime = _date(firstWord.startTime);
						const endTime = _date(lastWord.endTime);
						const duration = endTime - startTime;
						if (duration >= 5) {
							rs.push({
								s: ws.map(w => {
									const match = w.word.match(/([0-9]+)/);
									if (match) {
										return toWords(match[1]);
									} else {
										return w.word;
									}
								}).join(' '),
								startTime,
								endTime,
								duration,
								speakerTag: lastSpeakerTag,
							});
  				  }
				  // }
					ws = [];
				};
				for (let i = 0; i < words.length; i++) {
					const word = words[i];
					const {speakerTag} = word;
					ws.push(word);
					if (speakerTag !== lastSpeakerTag) {
						// console.log('shift speaker', {word, speakerTag, lastSpeakerTag});
						_shiftWords();
					}
					lastSpeakerTag = speakerTag;
				}
				if (ws.length > 0) {
					_shiftWords();
				}
			} else {
				continue;
			}
		}
		for (let i = 0; i < rs.length; i++) {
			const r = rs[i];
			const s2 = (i + '').padStart(2, '0');
			
			totalDuration += r.duration;
			
			const sentenceTape = tape.slice(r.startTime, r.duration);
			let buffer = await sentenceTape.render();
			buffer = new Uint8Array(buffer);
			// console.log('got buffer', r, buffer.length);
			const name = `out-${s1}-${s2}-${r.speakerTag}`;
			const text = r.s;
			const metadata = [
				name,
				text,
			];
			metadatas.push(metadata);
			console.log(name + '|' + text.slice(0, 80) + '|' + totalDuration);
			fs.writeFileSync('./inputs/' + name + '.wav', buffer);
		}
		fs.writeFileSync('./inputs/metadata.json', metadatas.map(m => m.join('|')).join('\n'));
  }
})();