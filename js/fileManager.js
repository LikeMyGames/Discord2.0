export function readDirectory(directory) {
	let dirReader = directory.createReader();
	let entries = [];
  
	let getEntries = () => {
	  dirReader.readEntries(
		(results) => {
		  if (results.length) {
			entries = entries.concat(toArray(results));
			getEntries();
		  }
		},
		(error) => {
		  /* handle error — error is a FileError object */
		},
	  );
	};
  
	getEntries();
	return entries;
}

const servers = []
	fetch("myText.txt")
  		.then((res) => res.text())
  		.then((text) => {
			server.add(text);
   		})
  		.catch((e) => console.error(e));
