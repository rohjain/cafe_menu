function showMenu(id){
    document.getElementById("categories").style.display = "none";
    document.querySelectorAll(".menu-section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(id).style.display = "block";
  }
  
  function goBack(){
    document.getElementById("categories").style.display = "grid";
    document.querySelectorAll(".menu-section").forEach(sec => {
      sec.style.display = "none";
    });
  }
  