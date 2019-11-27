const Promise = require('bluebird');
const fileSystem = Promise.promisifyAll(require('fs'));
const path = require('path');

export {
    fileSystem, path
}

export default function common() {
    this.getReadableTime = function(duration, format) {
        let seconds = duration, minutes = 0, hours = 0;
        while(seconds > 60) {
            minutes ++;
            seconds -= 60;
        }
        while(minutes > 60) {
            hours ++;
            minutes -= 60;
        }
  
        seconds = Math.round(seconds);
  
        let hourSuffix = ':', minuteSuffix = ':', secondSuffix = '';
        if(format == "text") {
            hourSuffix = "h ";
            minuteSuffix = "m ";
            secondSuffix = "s";
        }
        return ( 
        `${hours ? hours + hourSuffix : ''}` +
        `${minutes ? (hours ? (minutes >= 10 ? minutes : '0' + minutes) : minutes) : '0'}${minuteSuffix}` +
        `${seconds ? (seconds > 9 ? seconds: '0' + seconds) : '00'}${secondSuffix}`
        );
    }

    this.fitImageToContainer = function (imageContainer, image) {
        let containerProps = imageContainer.getBoundingClientRect();
        let containerAspectRatio = containerProps.width / containerProps.height;
        let img = document.createElement("img");
        img.src = image.src;
        img.onload = function () {
            if (this.width / this.height < containerAspectRatio)
                image.style.height = "100%";
            else
                image.style.width = "100%";
        };
    }

    this.truncateText = function (maxLineCount, targetElement) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let computedStyle = window.getComputedStyle(targetElement);
        let font = computedStyle.getPropertyValue('font-size') + " '" + computedStyle.getPropertyValue('font-family') + "'";
        ctx.font = font;

        let text = targetElement.textContent.trim();
        let targetWidth = parseFloat(computedStyle.getPropertyValue('width')) * maxLineCount;
        if (ctx.measureText(text).width > targetWidth) {
            while(ctx.measureText(text).width > targetWidth) {
                text = text.substring(0, text.length - 3);
            }
            text = text.substring(0, text.length - 2) + "...";
            targetElement.textContent = text;
        }
        // targetElement.setAttribute("title", fullText);
        this.getWidth = function (txt) {
            return ctx.measureText(txt).width;
        };
    }
}