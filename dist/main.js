(function () {
    var IMAGE_STYLE = "max-height: 80px; max-width: 80px; padding-right: 0.5rem;";
    var isImage = function (url) {
        var low = url.toLocaleLowerCase();
        return (low.indexOf(".jpg") > 0 ||
            low.indexOf(".jpeg") > 0 ||
            low.indexOf(".png") > 0 ||
            low.indexOf(".gif") > 0) &&
            low.indexOf("icons/") < 0; // exclude the gif icons: icons/image2.gif, icons/back.gif, incons/movie.gif
    };
    var isVideo = function (url) {
        var low = url.toLocaleLowerCase();
        return (low.indexOf(".mp4") > 0 ||
            low.indexOf(".avi") > 0 ||
            low.indexOf(".wmv") > 0 ||
            low.indexOf(".mpeg") > 0);
    };
    var isDocument = function (url) {
        var low = url.toLocaleLowerCase();
        return (low.indexOf(".pdf") > 0 ||
            low.indexOf(".htm") > 0 ||
            low.indexOf(".xls") > 0);
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
            documentCount: 0,
            fileCount: 0,
            folderCount: 0
        };
        var docStr = "";
        if (typeof doc === "string") {
            var parts = doc.split("<body>");
            docStr = parts[parts.length - 1];
        }
        else {
            docStr = doc.body.innerHTML;
        }
        // Inspect for media types
        docStr.split("<a ").forEach(function (fragment) {
            var endTagIx = fragment.indexOf("</a>"); // not a good way to parse html
            if (endTagIx > 4) {
                var hrefPart = fragment.substring(0, endTagIx);
                if (isImage(hrefPart)) {
                    inspectionResult.imageCount += 1;
                    inspectionResult.fileCount += 1;
                }
                else if (isVideo(hrefPart)) {
                    inspectionResult.videoCount += 1;
                    inspectionResult.fileCount += 1;
                }
                else if (isDocument(hrefPart)) {
                    inspectionResult.documentCount += 1;
                    inspectionResult.fileCount += 1;
                }
                else if (isFolder(hrefPart)) {
                    inspectionResult.folderCount += 1;
                }
                else {
                    inspectionResult.fileCount += 1;
                }
            }
        });
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
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    var folderInfo = inspect(req.responseText);
                    var folderInfoSpan = document.createElement("span");
                    folderInfoSpan.innerText = " (images: ".concat(folderInfo.imageCount, ", videos: ").concat(folderInfo.videoCount, ", documents: ").concat(folderInfo.documentCount, ")");
                    e.appendChild(folderInfoSpan);
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