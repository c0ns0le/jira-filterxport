var onSaveClicked = function (event, tab) {

    var filter = event.selectionText;
    var id = CryptoJS.SHA256(filter).toString();

    window.console.log("onSaveClicked: check for hash" + id);

    chrome.storage.sync.get("jiraFilters", function (items) {
        if (Object.keys(items).length !== 0) {

            items = items.jiraFilters;
            window.console.log(items);

            for (var item in items) {
                if (item === id) {
                    // if item exists send exists message and return
                    window.console.log("filter already exist, firing exist message");
                    chrome.tabs.sendMessage(tab.id, {filterAlreadyExists: items[item].name});
                    return;
                }
            }
        }

        // create new filter message and fire him to the content script
        var newFilter = {
            "id": id.toString(),
            "name": "",
            "filter": filter
        };

        window.console.log("requesting new filter name send ping...");
        chrome.tabs.sendMessage(tab.id, {addFilter: newFilter}, function (response) {
            window.console.log("message send, got... " + response.status);
        });

    });
};

chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("SaveFilter"),
    "contexts": ["editable"],
    "onclick": onSaveClicked
});

chrome.commands.onCommand.addListener(function (command) {
    window.console.log('Command:', command);
    if (command == "save_filter_shortcut") {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {getFilterForSC:"getFilterForSC"}, function (response) {
                window.console.log("message send, got... " + response.status);
            });
        });
        /*var newfilter = document.querySelector("textarea#advanced-search").text;
         window.console.log('Filter:', newfilter);*/
    }
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case 'mail-share':
                window.console.log("got mail-share request, opening tab");

                var filter = JSON.parse(atob(request.data));
                var emailUrl = "mailto:foor@bar.com?subject=Checkout my cool Jira filter: " + filter.name;

                chrome.tabs.create({url: emailUrl}, function (tab) {
                    window.console.log(tab);
                    window.setTimeout(function () {
                        chrome.tabs.remove(tab.id);
                    }, 500);
                });
                break;

            case 'delete-filter':
                window.console.log("got delete request.");

                chrome.storage.sync.get("jiraFilters", function (items) {
                    items = items.jiraFilters;
                    delete items[request.data.id];

                    chrome.storage.sync.set({"jiraFilters": items}, function () {
                        window.console.log("filter deleted");
                    });
                });
                sendResponse({status: {deleted: true}});
                break;
        }
    });
