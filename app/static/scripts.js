function post_multipart_json(path, data) {
    return post_multipart(path, data).then((response) => {
        return response.json()
    })
}

function post_multipart(path, data) {
    return window.fetch(path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: data
    });
}


var create = document.getElementById('create');
var image_prev = document.getElementById('img_prev');

create.addEventListener("click", function(evt){
	post_multipart_json("/create",new FormData(document.getElementById("form"))).then(data => {
		   img_prev.src = data.encoded;
           console.log(data)
	}).catch(err => {
	    console.log({ err })
	})
	evt.preventDefault();
});

 document.getElementById('selectfile').onchange = function() {
    var fileobj = document.getElementById('selectfile').files[0];
    start(window.URL.createObjectURL(fileobj))
};

function handleClick(evt) {
    evt.stopPropagation();
    document.getElementById('selectfile').click();
}

var btn = document.getElementById('select_file');
btn.addEventListener('click', handleClick, false);