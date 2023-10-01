console.log("content injected...");


let htElement = document.createElement("div");
  let label = document.createElement("h2");

//// ==================================
// VIDEO CONTROLS
// ====================================
function controlContainer() {
  
  label.textContent = "hello welcome";

  htElement.style.position = "absolute";
  htElement.style.top = "500px";
  htElement.style.left = "500px";

  htElement.style.border = "5px solid yellow";
  htElement.setAttribute("draggable", true);
  htElement.appendChild(label);

  document.body.appendChild(htElement);

  // ====
  var posX = 0,
    posY = 0,
    mouseX = 0,
    mouseY = 0;
  function moveElement(e) {
    mouseX = e.clientX - posX;
    mouseY = e.clientY - posY;
    htElement.style.left = mouseX + "px";
    htElement.style.top = mouseY + "px";
  }
  function mouseDown(e) {
    e.preventDefault();
    posX = e.clientX - htElement.offsetLeft;
    posY = e.clientY - htElement.offsetTop;
    window.addEventListener("mousemove", moveElement, false);
  }

  function mouseUp() {
    window.removeEventListener("mousemove", moveElement, false);
  }

  htElement.addEventListener("mousedown", mouseDown, false);
  window.addEventListener("mouseup", mouseUp, false);

  // ===
  sendResponse(`result: ${message.action}`);
}


// ==================================
// GETTING RECORDING TRACKS
// ====================================

var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  // recorder.onpause();

  // recorder.onresume();

  //   ===========================orignal

  recorder.onstop = function () {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();

        htElement.style.display = "none";
      }
    });
  };

  // ------------------------------------

  const chunks = [];

  recorder.ondataavailable = function (event) {
    // let recordedBlob = event.data;
    chunks.push(event.data);
    let result = "";

    const blob = new Blob(chunks, { type: "video/webm" });

    const vidURL = window.URL.createObjectURL(blob);

    console.log(vidURL);

    // ---------------------------------------

    var formData = new FormData();
    formData.append("video", recordedBlob);

    var requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    const sendBlob = async () => {
      try {
        const dataFetch = await fetch(
          "https://backend",
          requestOptions
        );

        const detail = await dataFetch.json();

        console.log(detail);
        result = detail;

        console.log(result.filename + "returned...");
        window.location.assign(
          `http://localhost:3000/captured/${result.filename}`
        );
      } catch (error) {
        console.log("Error:", error);
      }
      //   .then((result) => console.log(result))
      //   .catch((err) => console.log(err + "error"));
    };

    sendBlob();

    // ----------------------------------------

    // fetch("https://backendchromeextention.onrender.com/upload", requestOptions)
    //   .then((res) => res.text())
    //   .then((result) => console.log(result))
    //   .catch((err) => console.log(err + "error"));

    // let a = document.createElement("a");
    // a.style.display = "none";

    // window.location.assign(`http://localhost:3000/captured/${result.filename}`);

    // a.href = `http://localhost:3000/captured/${result.filename}`;
    // a.target = "_blank";
    // document.body.appendChild(a);
    // a.click();

    // -------------------------------------------

    // let url = URL.createObjectURL(recordedBlob);

    // let a = document.createElement("a");

    // a.href = url;

    // // console.log(url, + "video");
    // a.download = "video-recording.webm";

    // document.body.appendChild(a);
    // a.click();

    // document.body.removeChild(a);

    // URL.revokeObjectURL(url);

    // window.location.assign("http://localhost:3000/");

    // window.location.assign("https://help-me-out-dusky.vercel.app/captured");

    // can send to the api here
  };
}



// ==================================
// RUNTIME
// ====================================
chrome.runtime.onMessage.addListener(
  (message, request, sender, sendResponse) => {
    if (message.action === "request_recording") {
      console.log("requesting recording");

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

          // -----------

          console.log(request.command);

          controlContainer();

          // sendResponse(`processed: ${message.action}`);
        });

      

      //   ------------------------------------------------
    //   REQUESTING PERMISSION
    //   navigator.mediaDevices.getUserMedia({
    //       audio: true,
    //       video: true
    //       // video: {
    //       //   width: 9999999999,
    //       //   height: 9999999999,
    //       // },
    //   }).then((stream) => {

    //       onAccessApproved(stream);
    //     });
      //   --------------------------------------------------
    }


    // ========================================
    // STOPPING RECORDING
    // ========================================
    if (message.action === "stopvideo") {
      console.log("stopping recording");

      sendResponse(`processed: ${message.action}`);

      if (!recorder) {
        console.error("no recorder");
      }

      recorder.stop();
    }
  }
);

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
