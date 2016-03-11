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

