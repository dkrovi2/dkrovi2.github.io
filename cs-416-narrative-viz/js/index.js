var scenes = ["scene-0", "scene-1", "scene-2", "scene-3", "scene-4"];
var current_scene = 0;

function activateLinkNav(linkId) {
  d3.select("#scene-0-link").attr("class", "nav-link")
  d3.select("#scene-1-link").attr("class", "nav-link")
  d3.select("#scene-2-link").attr("class", "nav-link")
  d3.select("#scene-3-link").attr("class", "nav-link")
  d3.select("#scene-4-link").attr("class", "nav-link")

  d3.select("#" + linkId).attr("class", "nav-link active")
}

function enablePageNav(pageNavId) {
  d3.select("#page-nav-home").attr("class", "page-item disabled")
  d3.select("#page-nav-prev").attr("class", "page-item disabled")
  d3.select("#page-nav-next").attr("class", "page-item disabled")

  d3.select("#" + pageNavId).attr("class", "page-item")
}

function disablePageNav(pageNavId) {
  d3.select("#page-nav-home").attr("class", "page-item")
  d3.select("#page-nav-prev").attr("class", "page-item")
  d3.select("#page-nav-next").attr("class", "page-item")

  d3.select("#" + pageNavId).attr("class", "page-item disabled")
}

function enableAllPageNav() {
  d3.select("#page-nav-home").attr("class", "page-item")
  d3.select("#page-nav-prev").attr("class", "page-item")
  d3.select("#page-nav-next").attr("class", "page-item")
}

function showScene(sceneId) {
  d3.select("#div-scene-0").style("display", "none")
  d3.select("#div-scene-1").style("display", "none")
  d3.select("#div-scene-2").style("display", "none")
  d3.select("#div-scene-3").style("display", "none")
  d3.select("#div-scene-4").style("display", "none")

  d3.select("#div-" + sceneId).style("display", "")
}

function moveTo(scene) {
  switch (scene) {
    case 0:
      activateLinkNav("scene-0-link")
      showScene("scene-0")
      enablePageNav("page-nav-next")
      d3.selectAll("#scene-0 > *").remove();
      renderScene0()
      break;
    case 1:
      activateLinkNav("scene-1-link")
      showScene("scene-1")
      enableAllPageNav()
      d3.selectAll("#scene-1 > *").remove();
      renderScene1()
      break;
    case 2:
      activateLinkNav("scene-2-link")
      showScene("scene-2")
      enableAllPageNav()
      d3.selectAll("#scene-2 > *").remove();
      renderScene2()
      break;
    case 3:
      activateLinkNav("scene-3-link")
      showScene("scene-3")
      enableAllPageNav()
      d3.selectAll("#scene-3 > *").remove();
      renderScene3()
      break;
    case 4:
      activateLinkNav("scene-4-link")
      showScene("scene-4")
      disablePageNav("page-nav-next")
      d3.selectAll("#scene-4 > *").remove();
      renderScene4()
      break;
  }
}

moveTo(current_scene)
d3.select("#scene-0-link").on("click", function (d) {
  current_scene = 0;
  moveTo(current_scene)
});
d3.select("#scene-1-link").on("click", function (d) {
  current_scene = 1;
  moveTo(current_scene)
});
d3.select("#scene-2-link").on("click", function (d) {
  current_scene = 2;
  moveTo(current_scene)
});

d3.select("#scene-3-link").on("click", function (d) {
  current_scene = 3;
  moveTo(current_scene)
});

d3.select("#scene-4-link").on("click", function (d) {
  current_scene = 4;
  moveTo(current_scene)
});

d3.select("#page-nav-home").on("click", function (d) {
  current_scene = 0;
  moveTo(current_scene)
});

d3.select("#page-nav-prev").on("click", function (d) {
  switch (current_scene) {
    case 1:
      current_scene = 0;
      moveTo(current_scene)
      break;
    case 2:
      current_scene = 1;
      moveTo(current_scene)
      break;
    case 3:
      current_scene = 2;
      moveTo(current_scene)
      break;
    case 4:
      current_scene = 3;
      moveTo(current_scene)
      break;
  }
});


d3.select("#page-nav-next").on("click", function (d) {
  switch (current_scene) {
    case 0:
      current_scene = 1;
      moveTo(current_scene)
      break;
    case 1:
      current_scene = 2;
      moveTo(current_scene)
      break;
    case 2:
      current_scene = 3;
      moveTo(current_scene)
      break;
    case 3:
      current_scene = 4;
      moveTo(current_scene)
      break;
  }
});

