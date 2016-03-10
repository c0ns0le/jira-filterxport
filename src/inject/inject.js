var JiraFilterXport = function () {

    //create overlay and form
    var FilterXportInterface = function () {
        this.overlay = null;
    };
    FilterXportInterface.prototype = {
        /**
         * generates the basic overlay
         */
        generateOverlay: function () {

            this.overlay = document.createElement("div");
            this.overlay.setAttribute("class", "jira-filter-xport-overlay");
            this.overlay.setAttribute("id", "jira-filter-xport-overlay");

            document.body.appendChild(this.overlay);

        },
        /**
         * generates the new filter form
         * @param filterData
         */
        generateAddNewFilter: function (filterData) {
            this.generateOverlay();

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

                        items = Object.keys(items).length !== 0? items.jiraFilters: {};

                        var newItem = JSON.parse(atob(filterData));
                        newItem.name = filterName;
                        items[newItem.id] = newItem;

                        window.console.log(items);
                        chrome.storage.sync.set({"jiraFilters": items}, function () {
                            window.console.log("new filter saved");
                        });

                    });
                }

                document.body.removeChild(document.getElementById("jira-filter-xport-overlay"));
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay-form"));
            }, false);


        },
        /**
         * generates the filters exists windows
         * @param filterName
         */
        generateFilterExists: function(filterName){
            this.generateOverlay();

            var form = document.createElement("div");
            form.setAttribute("id", "jira-filter-xport-overlay-form");
            form.innerHTML = '<div class="inner-form">' +
                '<span>This filter already exists in your storage.</span><br/>' +
                '<span>Take a look a your <strong>'+filterName+'</strong> filter.</span>' +
                '<br/><button id="jira-filter-xport-new-filter-name-close" class="jira-filter-xport-btn close">Close</button>' +
                '</div>';

            document.body.appendChild(form);

            //Cancel
            document.getElementById("jira-filter-xport-new-filter-name-close").addEventListener('click', function () {
                window.console.log("close clicked, remove overlay");
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay"));
                document.body.removeChild(document.getElementById("jira-filter-xport-overlay-form"));
            }, false);
        }
    };

    //wait for context event
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            sendResponse({status: "pong"});
            var filterFormInterface = new FilterXportInterface();

            if (request.addFilter) {
                window.console.log("got new filter request, init window");
                window.console.log(request.addFilter);

                //passing filter to form
                filterFormInterface.generateAddNewFilter(btoa(JSON.stringify(request.addFilter)));
            }else if (request.filterAlreadyExists){
                window.console.log("got filter exists request, init window");
                window.console.log(request.filterAlreadyExists);

                //init filter exists windows
                filterFormInterface.generateFilterExists(request.filterAlreadyExists);
            }
        });
}();

// load script
document.addEventListener('DOMContentLoaded', JiraFilterXport, false);