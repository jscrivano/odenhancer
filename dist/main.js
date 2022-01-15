(function () {
    var IMAGE_STYLE = "max-height: 80px; max-width: 80px";
    var isImage = function (url) {
        var low = url.toLocaleLowerCase();
        return low.indexOf(".jpg") > 0 ||
            low.indexOf(".jpeg") > 0 ||
            low.indexOf(".png") > 0 ||
            low.indexOf(".gif") > 0;
    };
    var aElems = document.getElementsByTagName("a");
    var axs = [];
    for (var i = 0; i < aElems.length; i++) {
        axs = axs.concat(aElems.item(i));
    }
    // thumbnail images
    axs.forEach(function (e) {
        var ahref = e.href;
        if (isImage(ahref)) {
            var imgThumb = document.createElement("img");
            imgThumb.src = ahref;
            imgThumb.setAttribute('style', IMAGE_STYLE);
            var imgThumbLink = document.createElement("a");
            imgThumbLink.href = ahref;
            imgThumbLink.appendChild(imgThumb);
            e.parentElement.prepend(imgThumbLink);
        }
    });
})();
//# sourceMappingURL=main.js.map