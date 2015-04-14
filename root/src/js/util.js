if (typeof window.console == "undefined") {
    window.console = {
        log: function() {}
    };
}

var detectProtocol = function() {
    var protocol = location.protocol;
    var el = document.getElementById('container');
    if (protocol !== "http:" && protocol !== "https:") {
        if (el) {
            el.className = 'not-http';
        }
    }
};

