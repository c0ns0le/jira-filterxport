var browserAction = function () {

    chrome.storage.sync.get("jiraFilters", function (items) {

        var content = "";
        if (Object.keys(items).length !== 0 && Object.keys(items.jiraFilters).length !== 0) {
            items = items.jiraFilters;
            window.console.log(items);
            for (var item in items) {
                content += '<div class="list-group-item">' +
                    '<span class="filterName">' + items[item].name + '</span>' +
                    '<span class="filterActions">' +
                    '<button class="share-mail share-btn glyphicon glyphicon-envelope" title="' + chrome.i18n.getMessage("ShareMail") + '" id="share_' + item + '" data-filter="' + btoa(JSON.stringify(items[item])) + '"></button>' +
                    '<button class="copy share-btn glyphicon glyphicon-duplicate" title="' + chrome.i18n.getMessage("CopyClipboard") + '" id="share_' + item + '" data-filter="' + btoa(JSON.stringify(items[item])) + '"></button>' +
                    '<button class="delete share-btn glyphicon glyphicon-trash" title="' + chrome.i18n.getMessage("DeleteFilter") + '" id="' + item + '"></button>' +
                    '</span>' +
                    '</div>'
            }

        } else {
            content = '<div class="list-group-item active">' + chrome.i18n.getMessage("NoFilters") + '</div>'
        }

        var list = document.querySelector("#item-list");
        list.innerHTML = content;

        // add mail actions
        var mailButtons = document.getElementsByClassName("share-mail");
        for (var i = 0; i < mailButtons.length; i++) {
            mailButtons[i].addEventListener('click', function (event) {
                var button = document.getElementById(event.target.id);

                //copy to clipboard
                var filter = JSON.parse(atob(button.dataset.filter));
                copyToClipboard(filter.filter);

                //open mail client
                var emailUrl = "mailto:foor@bar.com?subject=Checkout my cool Jira filter: " + filter.name;
                chrome.tabs.create({url: emailUrl}, function (tab) {
                    setTimeOut(function () {
                        chrome.tabs.remove(tab.id);
                    }, 500);
                });

            }, false);
        }

        // copy buttons
        var copylButtons = document.getElementsByClassName("copy");
        for (var i = 0; i < copylButtons.length; i++) {
            copylButtons[i].addEventListener('click', function (event) {
                var button = document.getElementById(event.target.id);

                //copy to clipboard
                var filter = JSON.parse(atob(button.dataset.filter));
                copyToClipboard(filter.filter);

            }, false);
        }

        // delete buttons
        var deleteButtons = document.getElementsByClassName("delete");
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function (event) {
                var button = document.getElementById(event.target.id);

                chrome.storage.sync.get("jiraFilters", function (items) {
                    items = items.jiraFilters;
                    delete items[button.id];

                    chrome.storage.sync.set({"jiraFilters": items}, function () {
                        window.console.log("filter deleted");
                        window.close();
                    });

                });

            }, false);
        }
    });

    // helper function
    function copyToClipboard(data) {

        var input = document.createElement('input');
        input.setAttribute("id", "copyhelper");
        document.body.appendChild(input);
        input.value = data;
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
    }

}();
// load the browserAction
document.addEventListener('DOMContentLoaded', browserAction, false);