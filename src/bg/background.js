// save current selection to chrome storage
var onSaveClicked = function (event) {

    var filter = event.selectionText;
    var id = CryptoJS.SHA256(filter).toString();

    window.console.log("onSaveClicked: check for hash" + id);

    chrome.storage.sync.get("jiraFilters", function (items) {

        if (Object.keys(items).length !== 0) {

            items = items.jiraFilters;
            window.console.log(items);

            for (var item in items) {
                if (item === id) {
                    window.console.log("filter already exists name:" + items[item].name);
                    return;
                }
            }

        }

        window.console.log("saving new filter");
        items[id] = {
            "id": id.toString(),
            "name": "fooBar",
            "filter": filter
        };

        window.console.log(items);
        chrome.storage.sync.set({"jiraFilters": items}, function () {
            window.console.log("all filters saved");
        });
    });
};

chrome.contextMenus.create({
    "title": "Save Filter",
    "contexts": ["editable"],
    "onclick": onSaveClicked
});
