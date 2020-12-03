navigator.mediaDevices.getUserMedia({ audio: true})
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        document.querySelector('#start').addEventListener('click', function(){

            mediaRecorder.start();
            document.querySelector('#start').disabled = true;
            document.querySelector('#stop').disabled = false;
            document.querySelector('#record-status').innerHTML = "Recording..";
        });
        let audioChunks = [];
        mediaRecorder.addEventListener("dataavailable",function(event) {
            audioChunks.push(event.data);
        });

        document.querySelector('#stop').addEventListener('click', function(){
            mediaRecorder.stop();
        });

        mediaRecorder.addEventListener("stop", function() {
            document.querySelector('#start').disabled = false;
            document.querySelector('#stop').disabled = true;
            document.querySelector('#record-status').innerHTML = "";

            const audioBlob = new Blob(audioChunks, {
                type: 'audio/wav'
            });
            
            sendVoice(audioBlob);
            audioChunks = [];
        });
    });

async function sendVoice(audioBlob) {
    current_audio_file = audioBlob
    createDownloadLink(current_audio_file)
}

function createDownloadLink(blob) {  
    createAudio(blob);
}
