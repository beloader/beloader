function wrap() {
  var w = document.createElement('section');
  w.className = "content-wrapper";
  
  document.body.insertBefore(w, document.getElementsByTagName('nav')[0]);
  w.appendChild(document.getElementsByTagName('nav')[0]);
  w.appendChild(document.getElementsByClassName('content')[0]);
  
  document.querySelector('img[src="./image/github.png"]').title = 'View repository';
  document.querySelector('img[src="./image/github.png"]').src = './assets/octocat.png';
  
  document.querySelector('img[src="./image/search.png"]').title = 'Search';
  document.querySelector('img[src="./image/search.png"]').src = './assets/search.png';
}

if (document.readyState === 'interactive' || document.readyState === 'complete') wrap();
else document.onreadystatechange = function() {
  if (document.readyState === 'interactive') wrap();
}