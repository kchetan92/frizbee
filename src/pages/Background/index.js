console.log('This is the background page.');
console.log('Put the background scripts here.');

let initialState = {
    // status can be idle / recording / stopped
    status: "idle",
    screenshots: [],
    lastScreenshot: null,
    // modalView: open/close
    modalView: "close"
}

chrome.storage.local.get(['modalView'], function(result) {
    debugger;
    if(Object.keys(result).length === 0) {
        console.log("save");
        chrome.storage.local.set(initialState)
    }
})




chrome.action.onClicked.addListener(
    async () => {
        console.log("clicked background22");
        chrome.storage.local.get(['modalView'], function(result) {
            const nextToggle = result["modalView"] === "open" ? "close" : "open";
            chrome.storage.local.set({ modalView: nextToggle }, () => {});
        })

        let url = chrome.runtime.getURL("index.html");
        let tab = await chrome.tabs.create({url});

    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        debugger;
        if (request.message === 'add_picture') {
            const store = indexedDB.open("shotStore", 1);
            
            store.onupgradeneeded = function(event) {
                debugger;
                if(event.oldVersion === 0) {
                    const db = store.result;
                    db.createObjectStore('picsStore', {autoIncrement: true})
                }
            }

            store.onsuccess = function(event) {
                debugger;
                const db = store.result;
                const thisTransaction = db.transaction("picsStore", "readwrite");
                const picFrame = thisTransaction.objectStore("picsStore");
                const operation = picFrame.add(request.data);
                operation.onsuccess = function() {
                    sendResponse("success");
                    db.close();
                }
            }
        }
      });



    
//   )

//   chrome.action.onClicked.addListener((tab) => {
//       console.log("clicked background");
//     chrome.tabs.sendMessage(tab.id, { message: 'show_modal' },
//     function (response) {
//       console.log(response);
//     });
//   });
