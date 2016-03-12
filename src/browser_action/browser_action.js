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

                //open mail client
                chrome.runtime.sendMessage({type: "mail-share", data:button.dataset.filter});

            }, false);
        }

        // copy buttons
        var copylButtons = document.getElementsByClassName("copy");
        for (var i = 0; i < copylButtons.length; i++) {
            copylButtons[i].addEventListener('click', function (event) {
                var button = document.getElementById(event.target.id);
                var filter = JSON.parse(atob(button.dataset.filter));
                var input = document.createElement('input');

                //copy to clipboard
                input.setAttribute("id", "copyhelper");
                document.body.appendChild(input);
                input.value = filter.filter;
                input.focus();
                input.select();
                document.execCommand('Copy');
                input.remove();

            }, false);
        }

        // delete buttons
        var deleteButtons = document.getElementsByClassName("delete");
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function (event) {
                var button = document.getElementById(event.target.id);

                //deleting filter
                chrome.runtime.sendMessage({type: "delete-filter", data:{id:button.id}},function(response){
                    if(response.status.deleted === true){
                        window.close();
                    }
                });

            }, false);
        }
    });
}();
// load the browserAction
document.addEventListener('DOMContentLoaded', browserAction, false);