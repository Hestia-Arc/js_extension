console.log("connected...");

document.addEventListener("DOMContentLoaded", () => {
  //   -----------------------------
  //SELECTORS
  // -----------------------------------
  const startVideoButton = document.getElementById("start_record");
  const stopVideoButton = document.getElementById("stop_record");

  //   -----------------------------
  // START BUTTON
  // -----------------------------------
  startVideoButton.addEventListener("click", () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "request_recording" },
          function (response) {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError, "error line 14");
            }
          }
        );
      }
    );
  });

  //   ---------------------------------------
  // STOP BUTTON
  // -----------------------------------------
  stopVideoButton.addEventListener("click", () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "stopvideo" },
          function (response) {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError, "error line 52");
            }
          }
        );
      }
    );
  });

  //   ---------------------------------------
  // PAUSE BUTTON
  // -----------------------------------------

  //   ---------------------------------------
  // STOP BUTTON
  // -----------------------------------------
});
