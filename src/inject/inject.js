var JiraFilterXport = function () {

    var Overlay = function () {
        this.overlay = null;
        this.overlayClass = "jira-filter-xport-overlay";
        this.overlayId = "jira-filter-xport-overlay";
    };

    Overlay.prototype = {
        /**
         * generates the basic overlay
         */
        generateOverlay: function () {

            this.overlay = document.createElement("div");
            this.overlay.setAttribute("class", this.overlayClass);
            this.overlay.setAttribute("id", this.overlayId);

            document.body.appendChild(this.overlay);

            /*
            @TODO Move to an x button
            this.overlay.addEventListener('click', function () {
                // doesn't work with this.overlayId maybe a fancy lifetime bug
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay"));
            }, false);
             */
        },
        /**
         * generates the new filter form
         * @returns {Element|*}
         */
        generateAddNewFilterForm: function () {
            this.generateOverlay();

            /*
             @TODO codify
             */
            var form = '<div id="overlay-form"><div class="inner-form"><span>Add new Filter</span></div></div>';

            var overlay = document.getElementById(this.overlayId);
            overlay.innerHTML = form;

            document.getElementById("overlay-form").addEventListener('click', function (event) {
                event.preventDefault();
                window.console.log('clicked');
            }, false);
        }
    };

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.addFilter) {
                sendResponse({status: "pong"});

                window.console.log("got new filter request, init window");
                window.console.log(request.addFilter);

                var newFilterForm = new Overlay();
                newFilterForm.generateAddNewFilterForm();

            }
        });
}();

// load script
document.addEventListener('DOMContentLoaded', JiraFilterXport, false);