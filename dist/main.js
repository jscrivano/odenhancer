(function () {
    var IMAGE_STYLE = "max-height: 80px; max-width: 80px; padding-right: 0.5rem;";
    var isImage = function (url) {
        var low = url.toLocaleLowerCase();
        return (low.indexOf(".jpg") > 0 ||
            low.indexOf(".jpeg") > 0 ||
            low.indexOf(".png") > 0 ||
            low.indexOf(".gif") > 0) &&
            low.indexOf("icons/") < 0; // exclude the gif icons: icons/image2.gif, icons/back.gif
    };
    var isFolder = function (url) {
        var parts = url.substring(0, url.length - 2).split('/');
        return parts[parts.length - 1].indexOf(".") < 0 &&
            "/" === url.charAt(url.length - 1) &&
            url.indexOf("?") < 0 && // filter out sorting links for last modified and size '/?C=M;O=A'
            url.length > window.location.toString().length;
    };
    var inspect = function (doc) {
        var inspectionResult = {
            imageCount: 0,
            videoCount: 0,
            fileCount: 0,
            folderCount: 0
        };
        return inspectionResult;
    };
    var aElems = document.getElementsByTagName("a");
    var axs = [];
    for (var i = 0; i < aElems.length; i++) {
        axs = axs.concat(aElems.item(i));
    }
    // folder inspection
    axs.forEach(function (e) {
        var ahref = e.href;
        if (isFolder(ahref)) {
            console.log("folder: ".concat(ahref, " from ").concat(e));
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    var resp = req.responseText;
                    var imgCount = 0;
                    var respParts = resp.split("<body>");
                    respParts[respParts.length - 1].split("<a ").forEach(function (fragment) {
                        var endTagIx = fragment.indexOf("</a>");
                        if (endTagIx > 4) {
                            var hrefPart = fragment.substring(0, endTagIx);
                            if (isImage(hrefPart)) {
                                imgCount += 1;
                            }
                        }
                    });
                    console.log("images in ".concat(ahref, ": ").concat(imgCount));
                    var countSpan = document.createElement("span");
                    countSpan.innerText = " (images: ".concat(imgCount, ")");
                    e.appendChild(countSpan);
                }
            };
            req.open("GET", ahref, true);
            req.send(null);
        }
    });
    // thumbnail images
    axs.forEach(function (e) {
        var ahref = e.href;
        console.log(ahref);
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