console.log("content injected...");

var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  // recorder.onpause();

  // recorder.onresume();

  recorder.onstop = function () {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function () {
    let recordedBlob = event.data;

    let url = URL.createObjectURL(recordedBlob);

    // -------------
    // fetch(" https://backendchromeextention.onrender.com/upload", {
    //   method: "POST",
    //   body: JSON.stringify({ url }),
    //   headers: { "Content-Type": "application/json" },
    // })
    //   .then((res) => res.json())
    //   .then((json) => console.log("file sent: " + json))
    //   .catch((err) => console.log(err, +"error not sent"));

    // ------------------

    // let a = document.createElement("a");

    // a.href = url;
    // a.download = "video-recording.webm";

    // document.body.appendChild(a);
    // a.click();

    // document.body.removeChild(a);

    URL.revokeObjectURL(url);

    window.location.assign("http://localhost:3000/");

    // window.location.assign("https://help-me-out-dusky.vercel.app/captured");

    // can send to the api here
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    // getNotificationPermission() {
    // chrome.permissions.request(
    //     {
    //         permissions: ["notifications"],
    //     },
    //     function(granted) {
    //         if(granted) {
    //             startRecording();
    //         }
    //     }
    // )
    // }

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping recording");

    sendResponse(`processed: ${message.action}`);

    if (!recorder) {
      console.error("no recorder");
    }

    recorder.stop();
  }
});
