var processor = {
  framenum : 0,
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.fp = document.getElementById("fingerprint");
    //this.c1 = document.createElement("c1");
    //this.c1.setAttribute('width',480);  
    //this.c1.setAttribute('height',270);

    this.ctx1 = this.c1.getContext("2d");
    this.ctxfp = this.fp.getContext("2d");

    this.cb1 = document.getElementById("cb1");
    var self = this;
    this.video.addEventListener("play", function() {
        self.width = self.video.width; // self.video.videoWidth;
        self.height = self.video.height; // self.video.videoHeight;
        self.timerCallback();
      }, false);
  },

  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
  	var l = frame.data.length / 4;
    var totalR = 0, totalG = 0, totalB = 0;


    for (var i = 0; i < l; i++) {
      var grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

      totalR += frame.data[i * 4 + 0];
      totalG += frame.data[i * 4 + 1];
      totalB += frame.data[i * 4 + 2];
    }
    //this.ctx1.putImageData(frame, 0, 0);

    var averageR = Math.floor(totalR/l);
    var averageG = Math.floor(totalG/l);
    var averageB = Math.floor(totalB/l);

    //console.log("R = "+averageR+", G = "+averageG+", B = "+averageB);

    //console.log(this.framenum);

    this.ctxfp.strokeStyle = "rgb("+averageR+","+averageG+","+averageB+")"; 
    //this.ctxfp.moveTo(this.framenum,0);  
    //this.ctxfp.lineTo(this.framenum,48); 
    this.ctxfp.strokeRect(this.framenum,0,1,48);

    document.body.style.backgroundColor="rgb("+averageR+","+averageG+","+averageB+")";

    this.framenum++;
    return;
  }
};
