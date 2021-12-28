item = [];
itemcop = [];
mylist = document.getElementById("mylist");
myloadbutton = document.getElementById("loadmore");
searchbtn = document.getElementById("getitem");
currentcount = 0;

window.addEventListener("load", function(){
    LoadNamesFromJson();
  });

function LoadNamesFromJson(){
    let requestURL = 'jsons/search.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      item = request.response;
      itemcop = request.response;     
      populateNames(currentcount);   
    }
}

function populateNames(count){
    listdata = "";
    for(let i =count; i<Math.min(item.length, count+10);i++){
        listdata+="<li>" + item[i].Name +"</li>"
    }
    mylist.innerHTML += listdata;
    currentcount+=10;
    if(currentcount>=item.length){
        RemoveLoadMore();
        return;
    }
    if(!document.getElementById("loadmore")){
        AddLoadMore();
    }
}
function AddLoadMore(){
    mya = document.createElement('a');
    mya.id = "loadmore";
    mya.textContent = "loadmore";
    mya.classList.add("addmorelink");
    mya.addEventListener("click", function(){
        populateNames(currentcount);
    });
    document.getElementById("ajaxser").appendChild(mya);
}

function RemoveLoadMore(){
    document.getElementById("ajaxser").removeChild(document.getElementById("loadmore"));   
}

searchbtn.addEventListener("click", function(){
    var myinput = document.getElementById("finditem");
    var result = itemcop.filter(x => x.Name.toLowerCase().includes(myinput.value.toLowerCase()))
    item = result;
    currentcount = 0;
    mylist.innerHTML = '';
    populateNames(currentcount);
  });