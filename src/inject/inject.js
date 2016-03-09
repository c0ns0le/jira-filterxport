var JiraFilterXport = function () {

    //create overlay and form
    var FilterXportInterface = function () {
        this.overlay = null;
    };
    FilterXportInterface.prototype = {
        /**
         * generates the basic overlay
         */
        generateMain: function () {

            this.overlay = document.createElement("div");
            this.overlay.setAttribute("class", "jira-filter-xport-overlay");
            this.overlay.setAttribute("id", "jira-filter-xport-overlay");

            document.body.appendChild(this.overlay);

        },
        /**
         * generates the new filter form
         * @returns {Element|*}
         */
        generateAddNewFilter: function (filterData) {
            this.generateMain();

            //grep new filter name
            var filterName = document.querySelector('section#content header.saved-search-selector h1.search-title').innerHTML;
            /*
             @TODO codify form
             */
            var form = document.createElement("div");
            form.setAttribute("id", "jira-filter-xport-overlay-form");
            form.innerHTML = '<div class="inner-form">' +
                '<h5>Save new Filter</h5>' +
                '<input type="text" id="jira-filter-xport-new-filter-name" class="filter-input" value="' + filterName + '">' +
                '<input type="hidden" id="jira-filter-xport-new-filter-data" class="filter-input" value="' + filterData + '">' +
                '<button id="jira-filter-xport-new-filter-name-save" class="jira-filter-xport-btn save">Save</button>' +
                '<button id="jira-filter-xport-new-filter-name-cancel" class="jira-filter-xport-btn cancel">Cancel</button>' +
                '</div>';

            document.body.appendChild(form);

            //Cancel
            document.getElementById("jira-filter-xport-new-filter-name-cancel").addEventListener('click', function () {
                window.console.log("cancel clicked, remove overlay");
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay"));
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay-form"));
            }, false);

            //Save
            document.getElementById("jira-filter-xport-new-filter-name-save").addEventListener('click', function () {
                window.console.log("save clicked, save the filter");

                var filterData = document.getElementById("jira-filter-xport-new-filter-data").value;
                var filterName = document.getElementById("jira-filter-xport-new-filter-name").value;

                if (filterData && filterName) {
                    chrome.storage.sync.get("jiraFilters", function (items) {
                        items = items.jiraFilters;

                        window.console.log( JSON.parse(atob(filterData)));

                        /*
                        var newItem = JSON.parse(atob(filterData));

                        newItem.name = filterName;
                        items[newItem.id] = newItem;

                        window.console.log(items);
                        chrome.storage.sync.set({"jiraFilters": items}, function () {
                            window.console.log("new filter saved");
                        });
                        */
                    });
                }

                document.body.removeChild(document.getElementById("jira-filter-xport-overlay"));
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay-form"));
            }, false);


        }
    };

    //wait for context event
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.addFilter) {
                sendResponse({status: "pong"});

                window.console.log("got new filter request, init window");
                window.console.log(request.addFilter);

                var newFilterInterface = new FilterXportInterface();
                //passing filter to form
                newFilterInterface.generateAddNewFilter(btoa(JSON.stringify(request.addFilter)));
            }
        });
}();

// load script
document.addEventListener('DOMContentLoaded', JiraFilterXport, false);