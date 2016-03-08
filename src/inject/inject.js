var JiraFilterXport = function () {

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.addFilter) {
                sendResponse({status: "pong"});

                window.console.log("got new filter request, init window");
                window.console.log(request.addFilter);

            }

        });
}();

// load script
document.addEventListener('DOMContentLoaded', JiraFilterXport, false);