
var perimeter = new Array();
var complete = false;
var canvas = document.getElementById("jPolygon");
var ctx = canvas.getContext("2d");
var coord = document.getElementById('json_coord');

function point(x, y){
    ctx.fillStyle="white";
    ctx.strokeStyle = "white";
    ctx.fillRect(x-2,y-2,4,4);
    ctx.moveTo(x,y);
}

function make_point(ctx,p){
    ctx.fillStyle = p.fillStyle;
    ctx.lineWidth = 0;
    ctx.fillRect(p.x-2,p.y-2,4,4);
    ctx.moveTo(p.x,p.y);
}



function clear_canvas(){
    perimeter = new Array();
    complete = false;
    document.getElementById('coordinates').value = '';
    start();
}
function init(){
    perimeter.push({'x':100,'y':10});
    perimeter.push({'x':200,'y':10});
    perimeter.push({'x':200,'y':100});
    perimeter.push({'x':100,'y':100});
}

function node_intersected(x,y,path){
    for(var j=0; j<path.length; j++){
        x_ = path[j]['x'];
        y_ = path[j]['y'];
        if( x > x_ - 10 && x < x_ +10 && y > y_ - 10 && y < y_ + 10){
            return {"j":j};
        }
    }
    return null;
}
var SelectedNode;
var SelectedNodeOriginalCoord;
var dragging = false;
function mouseDown(event){
    var rect, x, y;
    rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    var indexes = node_intersected(x,y,perimeter);
    if(indexes!=null){
        SelectedNode = perimeter[indexes["j"]];
        SelectedNodeOriginalCoord = {"x":SelectedNode.x,"y":SelectedNode.y};
        console.log("node_i: "+indexes["j"]);

        
    }
    dragging = true;
}
function mouseUp(event){
    dragging = false;
}
function mouseMove(event){
    if(dragging){
        mouseDrag(event);
    }
}
function mouseDrag(event){
    if(SelectedNode != null){
        var rect, x, y;
        rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;

        var x_diff = x - SelectedNodeOriginalCoord.x;
        var y_diff = y - SelectedNodeOriginalCoord.y;
        
        SelectedNode.x = SelectedNodeOriginalCoord.x + x_diff
        SelectedNode.y = SelectedNodeOriginalCoord.y + y_diff
        update(ctx,canvas,perimeter);
    }
}

function update(ctx,canvas,perimeter){
    console.log(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(img!=null)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    ctx.lineCap = "square";
    
    ctx.strokeStyle = "white";
    ctx.beginPath();

    if(perimeter.length > 0){
        make_point(ctx,perimeter[0]);
    }
    for(var j = 1; j < perimeter.length; j++){
        make_point(ctx,perimeter[j]);
    }
    if(perimeter.length > 0){
        ctx.moveTo(perimeter[0]['x'],perimeter[0]['y']);
    }
    ctx.lineWidth = 1;
    for(var j = 1; j < perimeter.length; j++){
        ctx.lineTo(perimeter[j]['x'],perimeter[j]['y']);
    }

        console.log("completado");
        ctx.lineTo(perimeter[0]['x'],perimeter[0]['y']);
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.strokeStyle = 'black';
        ctx.fill();
        ctx.closePath();
    ctx.stroke();
    var res = []
    for(var i = 0; i < perimeter.length; i++){
        console.log(perimeter[i])
        res.push([perimeter[i].x / ratio,perimeter[i].y / ratio])
    }
    coord.value = JSON.stringify({"values":res});
    console.log(coord.value) 
}

var ratio = 0;

function start(url){
    img = new Image();
    console.log(url)
    img.src = url; 
    img.onload = function(){
        var max_width = 500;

        ratio = (500 / img.width);
        var new_height = img.height * ratio; 
        
        console.log(img.width)
        console.log(img.height)
        canvas.setAttribute('width',max_width);
        canvas.setAttribute('height', new_height); 
        ctx.drawImage(img, 0, 0, max_width , new_height);
        init();
        update(ctx,canvas,perimeter)
    }
}
