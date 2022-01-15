(function() {
    const IMAGE_STYLE = "max-height: 80px; max-width: 80px; padding-right: 0.5rem;";

    type FolderInspection = {
        imageCount: number,
        videoCount: number,
        fileCount: number,
        folderCount: number,
    };

    const isImage = function(url : string) : boolean {
        const low = url.toLocaleLowerCase();
        return (low.indexOf(".jpg") > 0 ||
            low.indexOf(".jpeg") > 0 ||
            low.indexOf(".png") > 0 ||
            low.indexOf(".gif") > 0) && 
            low.indexOf("icons/") < 0; // exclude the gif icons: icons/image2.gif, icons/back.gif
    }

    const isFolder = function(url : string) : boolean {
        const parts = url.substring(0, url.length-2).split('/');
        return parts[parts.length-1].indexOf(".") < 0 &&
            "/" === url.charAt(url.length-1) &&
            url.indexOf("?") < 0 && // filter out sorting links for last modified and size '/?C=M;O=A'
            url.length > window.location.toString().length;
    }
 
    const inspect = function(doc : string | Document) : FolderInspection {
        const inspectionResult = {
            imageCount: 0,
            videoCount: 0,
            fileCount: 0,
            folderCount: 0,
        }

        return inspectionResult;
    }
    
    const aElems = document.getElementsByTagName("a");
    var axs : HTMLAnchorElement[] = [];
    for(var i=0; i < aElems.length; i++) {
        axs = axs.concat(aElems.item(i));
    }

    // folder inspection
    axs.forEach(function (e) {
        var ahref = e.href;
        if (isFolder(ahref)) {
            console.log(`folder: ${ahref} from ${e}`);

            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    const resp = req.responseText;
                    var imgCount = 0;

                    const respParts = resp.split("<body>");
                    respParts[respParts.length-1].split("<a ").forEach(function (fragment) {
                        const endTagIx = fragment.indexOf("</a>");
                        if (endTagIx > 4) {
                            const hrefPart = fragment.substring(0, endTagIx);
                            if (isImage(hrefPart)) {
                                imgCount += 1;
                            }
                        }
                    });

                    console.log(`images in ${ahref}: ${imgCount}`);

                    const countSpan = document.createElement("span");
                    countSpan.innerText = ` (images: ${imgCount})`;
                    e.appendChild(countSpan);
                }
            };
            req.open("GET", ahref, true);
            req.send(null);

        }
    });

    // thumbnail images
    axs.forEach((e) => {
        const ahref = e.href;
        console.log(ahref);
        if (isImage(ahref)) {
            const imgThumb = document.createElement("img");
            imgThumb.src = ahref;
            imgThumb.setAttribute('style', IMAGE_STYLE);

            const imgThumbLink = document.createElement("a");
            imgThumbLink.href = ahref;
            imgThumbLink.appendChild(imgThumb);

            e.parentElement.prepend(imgThumbLink);
        }
    });



})();