(function() {
    function st(href) {
        var style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = href;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    st("http://websplat.bitbucket.org/piyibutton.css");
    st("http://fonts.googleapis.com/css?family=Neuton:400,700");

    document.write("<div class='piyib'><a href=\"javascript:(function(s){s=document.createElement('script');s.src='http://websplat.bitbucket.org/websplat/loader.js';document.getElementsByTagName('head')[0].appendChild(s);})()\">Needs More Ponies</a></div>");
})();
