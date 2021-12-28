newscop =[];
news =[];
myrow = document.getElementById('myrow');
modalcont = document.getElementById('modcont');
modal = document.getElementById("myModal");
searchbutton = document.getElementById("srhbtn");
sortbutton = document.getElementById("sortbtn");
currentpage = 1;
window.addEventListener("load", function(){
  LoadDataFromJson();
  alert(getCookie('name'));
});

function LoadDataFromJson(){
  let requestURL = 'jsons/news.json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    news = request.response;
    newscop = request.response;
    var myCookie = getCookie('name');
    if(myCookie == null || myCookie == ""){
      renderNews(currentpage);
      ToPag();
    }
    else{
      findNews(myCookie, true);
      ToPag();
    }
  }
}
function renderNews(n) {
  let html = '';
  for (let i = 5*currentpage-5; i < Math.min(news.length, 5*currentpage); i++) {
      let htmlSegment = `<div class="mydiv">
                          <h1 class="newshead">${news[i].title}</h1>
                          <img class ="newsimg responsive-img" width=400 src="${news[i].image}">
                          <p class="newsdisc">${news[i].shortdesc}</p>
                          <a class="newsmore" data-index="${i}">More Info</a>
                      </div>`;

      html += htmlSegment;
  };
  myrow.innerHTML = html;
  ToMore();
}

function ToMore(){
  var btns = document.querySelectorAll('.newsmore');
  btns.forEach(function(elem) {
    elem.addEventListener("click", function() {
        modalcont.innerHTML = '';
        var index = elem.getAttribute('data-index');
        let htmlSegment = `<span class="close1" onclick="closeModal()">&times;</span>
        <h1 class="newshead">${news[index].title}</h1>
        <img src="${news[index].image}" class="newsimg">
        <p class="fulldesc">${news[index].fulldesc}</p>`
        modalcont.innerHTML = htmlSegment;

        modal.style.display = "block";
      });
  });
}
function SetActiveLink(element){
  Array.from(document.querySelectorAll('.pagination a.page-link')).forEach((el) => el.classList.remove('active'));
  element.classList.add('active');
}

function ToPag(){
  var p = document.getElementById('pagination');
  var pbuttons = p.querySelectorAll('.page-link');
  pbuttons.forEach(function(elem) {
    elem.addEventListener("click", function() {
        currentpage = elem.innerHTML;
        SetActiveLink(elem);
        renderNews(currentpage);
      });
  });
  pbuttons = p.querySelectorAll('a');
  pbuttons[pbuttons.length-1].addEventListener("click", function(){
    currentpage = Number(currentpage)+1;
    if(currentpage>6){
      currentpage=6;
    }
    SetActiveLink(pbuttons[Number(currentpage)]);
    renderNews(currentpage);
  });
  pbuttons[0].addEventListener("click", function(){
    currentpage = Number(currentpage)-1;
    if(currentpage<1){
      currentpage=1;
    }
    SetActiveLink(pbuttons[Number(currentpage)]);
    renderNews(currentpage);
  });
}

function findNews(keywords){
  var wordsarray = keywords.split(" ");
  var result = newscop.filter(x => wordsarray.some(v => x.shortdesc.toLowerCase().includes(v)));
  news = result;
  currentpage = 1;
  SetActiveLink(document.querySelectorAll('.page-link')[Number(currentpage-1)]);
  renderNews(currentpage);
}
searchbutton.addEventListener("click", function(){
  var myinput = document.getElementById("filterby");
  findNews(myinput.value.toLowerCase());
  document.cookie = "name="+myinput.value.toLowerCase()+";"+"max-age=2629743";
});

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

sortbutton.addEventListener("click", function(){
  news.sort((a, b) => {
    let l = a.shortdesc.toLowerCase(),
        r = b.shortdesc.toLowerCase();

    if (l < r) {
        return -1;
    }
    if (l > r) {
        return 1;
    }
    return 0;
  });
  renderNews(currentpage);
});