<template>
	<v-card 
		@drop="dropHandler" 
		@dragover="dragOverHandler"
		class="bg drop-zone" 
		color=""
		height="80%"
		width="90%"
	>
		<v-card-text class="center-text-vertically" @click="getSongsUsingInput">
			<h1>Drag and Drop one or more files ....</h1>
		</v-card-text>
		
		<input 
			type="file" 
			ref="fileInput" 
			accept="audio/mp3"
			@change="sendFiles"
			multiple
			hidden
			name="inputFile"
		/>
	</v-card>
</template>

<script>
import $ from 'jquery';

export default {
  props: [
	  'config', 
	  'uploadProgress', 
	  'uploadComplete', 
	  'uploadFailed', 
	  'uploadCanceled',
	  'addToUploadingFiles'
  ],
  data () {
    return {
      fileUploaded: null
    }
  },
  methods: {
    dropHandler: function(event) {
		console.log('File(s) dropped');

		let ev = event;
		let files = [];
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();

		if (ev.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			for (var i = 0; i < ev.dataTransfer.items.length; i++) {
			// If dropped items aren't files, reject them
				if (ev.dataTransfer.items[i].kind === 'file') {
					var file = ev.dataTransfer.items[i].getAsFile();
					console.log('... file[' + i + '].name = ' + file.name);
					files.push(file);
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			for (var i = 0; i < ev.dataTransfer.files.length; i++) {
				console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
			}
		} 
		// Pass event to removeDragData for cleanup
		// this.addToUploadingFiles(files);
		this.removeDragData(ev);
		this.stratUpload(files);
	},
	dragOverHandler: function(event) {
		// Prevent default behavior (Prevent file from being opened)
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	},
	removeDragData: function(ev) {
		console.log('Removing drag data');

		if (ev.dataTransfer.items) {
			// Use DataTransferItemList interface to remove the drag data
			ev.dataTransfer.items.clear();
		} else {
			// Use DataTransfer interface to remove the drag data
			ev.dataTransfer.clearData();
		}
	},
	stratUpload: function(files) {
		files.forEach(file => {
			file.isFirst = true;
			// this.chunkFile(file, 0);
			this.readFileAndUploadInChunks(file);
		});
	},
	readFileAndUploadInChunks: function(file) {

		let reader = new FileReader();
		// let uploadChunk = this.uploadChunk;
		
		reader.onloadend = (read) => {
			file.base64String = reader.result;
			file.base64Size = file.base64String.length;
			// file.size = file.base64Size;

			this.addToUploadingFiles([file]);
			// console.log('event');
			// Ignoring First indexOf(',') + 1 chars b'coz
			// FileReader.readAsDataURL(blob) prefixes the file content with
			// "data:audio/mpeg;base64,"/ "data:audio/mp3;base64," tag which represents that the data
			// is audio ecoded in base64 format
			this.chunkFile(file, (file.base64String).indexOf(',') + 1);
			// console.log((file.base64String).slice(0, 23));
		}
		reader.readAsDataURL(file);
		
	},
	chunkFile: function(file, start) {
		// console.log(file);
		let end = start + this.config.chunkSize;
		let chunk = {
			name: file.name,
			base64Size: file.base64Size,
			type: file.type,
			base64String: (file.base64String).slice(start, end),
			isFirst: file.isFirst,
			chunkStart: start,
			chunkEnd: end
		}
		this.uploadChunk(chunk, start, end, file);
	},
	uploadChunk: function(chunk, start, end, file) {
		// console.log(chunk);
		// console.log(start + ' ' + end);
		// console.log(file.size);
		// console.log(file.base64Size);
		if(chunk) {
			
			let xhr = new XMLHttpRequest();
			/* event listners */
			xhr.addEventListener("load", (event) => {
				// var size_done = start + this.config.chunkSize;
                // var percent_done = Math.floor( ( size_done / file.size ) * 100 );
				if ( start < file.base64Size ) {
                    // Update upload progress
                    this.uploadProgress(file.name, end);
					// More to upload, call function recursively
					file.isFirst = false;
                    this.chunkFile(file, end );
                } else {
                    // Update upload progress
					this.sendCompleteRequest(file.name);
					this.uploadComplete(file.name);
                }
			}, false);
			xhr.addEventListener("error", (event) => {
				this.uploadFailed(file.name);
				console.log(event);
			}, false);
			xhr.addEventListener("abort", (event) => {
				this.uploadCanceled(file.name);
				console.log(event);
			}, false);

			// compusory for making a CORS request
			// xhr.withCredentials = true;
			
			/* Be sure to change the url below to the url of your upload server side script */
			xhr.open("POST", this.config.uploadSongURL);

			// add cors headers
			// xhr.setRequestHeader('Access-Control-Allow-Origin','*');
			// xhr.setRequestHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
			// xhr.setRequestHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

			let strigifiedChunk = JSON.stringify(chunk);
			// console.log(strigifiedFile);
			xhr.send(strigifiedChunk);
			
		}
	},
	sendCompleteRequest: function(fileName) {
		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", (event) => { console.log(event); });
		xhr.addEventListener("error", (event) => { console.log(event); });
		xhr.addEventListener("abort", (event) => { console.log(event); });

		// compusory for making a CORS request
		// xhr.withCredentials = true;
		
		xhr.open("POST", this.config.uploadCompleteURL);

		// add cors headers
		// xhr.setRequestHeader('Access-Control-Allow-Origin','*');
		// xhr.setRequestHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
		// xhr.setRequestHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

		xhr.send(JSON.stringify({
			name: fileName
		}));
	},
	getSongsUsingInput: function(event){
		this.$refs.fileInput.click();
	},
	sendFiles: function() {
		let input = this.$refs.fileInput;
		if ('files' in input) {
			let files = input.files;
			if (files.length > 0) {
				let filesArray = Array.from(files);
				// this.addToUploadingFiles(filesArray);
				this.stratUpload(filesArray);
			}
    	} 
	}
  }
}
</script>

<style scoped>
.bg {
	background-color: #9d9d9d;
}

.drop-zone {
	display: table;
	margin: 5%;
	border-radius: 2rem;
	border: 3px dashed grey;
	cursor: pointer;
}

.center-text-vertically {
	display: table-cell;
	vertical-align: middle;
}
</style>

