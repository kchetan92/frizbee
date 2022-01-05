console.log('This is the background page.');
console.log('Put the background scripts here.');

let initialState = {
    // status can be idle / recording / stopped
    status: "idle",
    screenshots: [],
    lastScreenshot: null,
    // modalView: open/close
    modalView: "open"
}

let state = {
    ...initialState
}

const updateState = (newState) => {
    state = { ...state, ...newState };
    return state;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request?.message === "bg.update" && request.data) {
        updateState(request.data);
        sendResponse('ok');
    } else if (request?.message === "bg.reset") {
        updateState(initialState);
    } else if (request?.message === "bg.getState") {
        sendResponse(state);
    } else {
        sendResponse("error")
    }
})
