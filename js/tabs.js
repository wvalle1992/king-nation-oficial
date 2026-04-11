(function(){
  const tabs = [
    {btn: document.getElementById('tab-name'),  panel: document.getElementById('panel-name')},
    {btn: document.getElementById('tab-sensi'), panel: document.getElementById('panel-sensi')}
  ];
  function select(idx){
    tabs.forEach((t,i)=>{
      const sel = i===idx;
      t.btn.setAttribute('aria-selected', sel);
      t.panel.classList.toggle('active', sel);
    });
    location.hash = idx===0 ? '#nombres' : '#sensi';
    window.scrollTo({top:0, behavior:'instant'});
  }
  tabs.forEach((t,i)=> t.btn.addEventListener('click', ()=>select(i)));
  if (location.hash === '#sensi') select(1); else select(0);
})();
