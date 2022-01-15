(function() {
    const IMAGE_STYLE = "max-height: 80px; max-width: 80px";

    const isImage = function(url : string) : boolean {
        const low = url.toLocaleLowerCase();
        return low.indexOf(".jpg") > 0 ||
            low.indexOf(".jpeg") > 0 ||
            low.indexOf(".png") > 0 ||
            low.indexOf(".gif") > 0;
    }
    
    const aElems = document.getElementsByTagName("a");
    var axs = [];
    for(var i=0; i < aElems.length; i++) {
        axs = axs.concat(aElems.item(i));
    }

    // thumbnail images
    axs.forEach((e) => {
        const ahref = e.href;
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