var canvas,
    ctx,
    brush = {
        x: 0,
        y: 0,
        color: "#000000",
        size: 10,
        down: false,
        line: false
    },
    strokes = [],
    lineStrokes = [],
    tools = null,
    currentStroke = null;

function penDraw() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function lineDraw() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (var i = 0; i < lineStrokes.length; i++) {
        var s = lineStrokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        ctx.lineTo(
            s.points[s.points.length - 1].x,
            s.points[s.points.length - 1].y
        );
        ctx.stroke();
    }
}

function init() {
    canvas = $("#draw");
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight
    });
    ctx = canvas[0].getContext("2d");

    function mouseEvent(e) {
        brush.x = e.pageX;
        brush.y = e.pageY;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y
        });

        switch (tools) {
            case "line":
                lineDraw();
                break;
            case "brush":
                penDraw();
                break;
            default:
                penDraw();
        }
        console.log(tools);
        console.log(strokes);
    }
    canvas
        .mousedown(function(e) {
            brush.down = true;

            currentStroke = {
                color: brush.color,
                size: brush.size,
                points: []
            };
            switch (tools) {
                case "line":
                    lineStrokes.push(currentStroke);

                    break;
                case "brush":
                    strokes.push(currentStroke);

                    break;
                default:
                    strokes.push(currentStroke);
            }
            mouseEvent(e);
        })
        .mouseup(function(e) {
            brush.down = false;
            mouseEvent(e);
            currentStroke = null;
        })
        .mousemove(function(e) {
            if (brush.down) mouseEvent(e);
        });
}

$("#save-btn").click(function() {
    window.open(canvas[0].toDataURL());
});
$("#undo-btn").click(function() {
    switch (tools) {
        case "line":
            lineStrokes.pop();
            break;
        case "brush":
            strokes.pop();
            break;
        default:
            strokes.pop();
    }

    penDraw();
});
$("#clear-btn").click(function() {
    strokes = [];
    lineStrokes = [];
    penDraw();
});
$("#color-picker").on("input", function() {
    brush.color = this.value;
});
$("#brush-size").on("input", function() {
    brush.size = this.value;
});
$("#line-btn").click(function() {
    tools = "line";
});
$("#brush-btn").click(function() {
    tools = "brush";
});

$(init);
