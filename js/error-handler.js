window.addEventListener('error', function(e){
  var el = document.getElementById('err'); if(!el) return;
  el.style.display='block'; el.textContent = 'Error: ' + (e.message || e.toString());
});
