const fs = require('fs');

// const wavFileNames = fs.readdirSync('./wavs/')
const wavFileNames = fs.readdirSync(`/mnt/c/Users/avaer/Documents/Image-Line/FL Studio/Audio/Rendered`)
  .filter(l => /\.wav$/.test(l))
  .map(l => {
	  const match = l.match(/^(tale)([0-9]+)( - Track )([0-9]+)(\.wav)$/);
	  if (match) {
			const sortName =
				match[1] +
				match[2].padStart(3, '0') +
				match[3] +
				match[4].padStart(3, '0') +
				match[5];
			return {
				l,
				sortName,
			};
	  } else {
		  return null;
		}
	})
	.filter(l => !!l)
	.sort((a, b) => a.sortName.localeCompare(b.sortName))
	.map(o => o.l);

const s = fs.readFileSync('./mp35/manuscript.txt', 'utf8');
const ls = s.replace(/\r\n/g, '\n')
  .split('\n')
	.filter(l => /\S+/.test(l))
	.map(l => {
		/* const k = l
		  .replace(/’/gi, `'`)
		  .replace(/“/gi, `"`)
		  .replace(/”/gi, `"`)
		  .replace(/[^a-zA-z0-9\.,:;"'\(\)\/ ]+/g, '')
	  console.log('got', {l, k}); */
		
		return l
		  .replace(/’/gi, `'`)
		  .replace(/“/gi, `"`)
		  .replace(/”/gi, `"`)
		  .replace(/[^a-zA-z0-9\.,:;"'\(\)\/ ]+/g, ' ')
	})
const acc = [];
const results = [];
const _shiftAcc = () => {
  if (acc.length > 0) {
		const wavFileName = wavFileNames[results.length];
		if (wavFileName) { 
			const s = 
				wavFileName.replace(/\.wav$/, '') +
				'|' +
				acc.join(' ');
			results.push(s);
	  }
		acc.length = 0;
  } else {
	  console.warn('could not shift');
	}
};
for (let i = 0; i < ls.length; i++) {
	const l = ls[i];
  if (/^\/\//.test(l)) {
	  _shiftAcc();
	} else {
	  acc.push(l);
	}
}
_shiftAcc();

console.log('got file names', wavFileNames.length, results.length);

const result = results.join('\n');
fs.writeFileSync('./metadata4.csv', result);