var gEnzymeRefragmented = [];
var ucEnzymeRefragmented = [];
var singleFragments = [];
var interiorEB = [];
var nonSingleFragments = [];
var abFragments = [];
var nodes = [];
var nodeInfo = [];
var begNode;
var endNode;
var nodesWeightedArcs = [];
var graph;
var path = [];
var circuit = [];
let curr_vertex;
var adjacents = [];

// Function that takes user input
var takesInput = function () {
  let gSet = $("#G-enzyme-set").val(); 
  let ucSet = $("#UC-enzyme-set").val(); 

  $("#g-enzyme").text("G-enzyme: " + gSet);
  $("#uc-enzyme").text("U.C-enzyme: " + ucSet);

  refragsInput(gSet, ucSet);
};

// Function that refragments the user input
function refragsInput(gSet, ucSet) {
  let gSetRefragmented = ""; // Applies UC enzyme
  let ucSetRefragmented = ""; // Applies the G enzyme

  // Loop through the gSet user input string
  for (let i = 0; i < gSet.length; i++) {
    if (
      (gSet[i] == "U" || gSet[i] == "C") &&
      gSet[i + 1] !== " "
    ) {
      gSetRefragmented = gSetRefragmented + gSet[i] + "/";
    }
    else {
      gSetRefragmented = gSetRefragmented + gSet[i];
    }
  }

  $("#refragmented-g-set").text("Result of applying U.C-enzyme to G-enzyme input: " + gSetRefragmented);

  // Loops through uc enzyme input
  for (let i = 0; i < ucSet.length; i++) {
    if (ucSet[i] == "G" && ucSet[i + 1] !== " ") {
      ucSetRefragmented = ucSetRefragmented + ucSet[i] + "/";
    }
    // if base is not G
    else {
      ucSetRefragmented = ucSetRefragmented + ucSet[i];
    }
  }

  $("#refragmented-uc-set").text("Result of applying G-enzyme to U.C-enzyme input: " + ucSetRefragmented);

  checkForAbnormalFragments(gSetRefragmented, ucSetRefragmented);
  findExtendedBases(gSetRefragmented, ucSetRefragmented);
}


function findExtendedBases(gSetRefragmented, ucSetRefragmented) {

  let gSetArray = gSetRefragmented.split(" ");
  let ucSetArray = ucSetRefragmented.split(" ");

  gEnzymeRefragmented = gSetArray;
  ucEnzymeRefragmented = ucSetArray;

  for (let i = 0; i < gSetArray.length; i++) {
    if (gSetArray[i].includes("/")) {
      continue;
    }
    else {
      singleFragments.push(gSetArray[i]);
    }
  }

  for (let i = 0; i < ucSetArray.length; i++) {
    if (ucSetArray[i].includes("/")) {
      continue;
    }
    else {
      singleFragments.push(ucSetArray[i]);
    }
  }

  $("#single-fragments").text("Single (consisting of exactly one e.b) fragments from applying enzymes above: " + singleFragments.join(" "));


  // Interior base
  for (let i = 0; i < gSetArray.length; i++) {
    //split / 

    let dashFragment = gSetArray[i].split("/");

    if (dashFragment.length >= 3) {
      for (let j = 1; j < dashFragment.length - 1; j++) {
        interiorEB.push(dashFragment[j]);
      }
    }
  }

  // Go through ucSetArray
  for (let i = 0; i < ucSetArray.length; i++) {

    let dashFragment = ucSetArray[i].split("/");

    if (dashFragment.length >= 3) {
      for (let j = 1; j < dashFragment.length - 1; j++) {
        interiorEB.push(dashFragment[j]);
      }
    }
  }


  $("#interior-extended-bases").text("Interior extended bases from applying enzymes above: " + interiorEB.join(" "));


  // Non single fragments here
  // Loops through gSetArray
  for (let i = 0; i < gSetArray.length; i++) {
    if (gSetArray[i].includes("/")) {
      nonSingleFragments.push(gSetArray[i]);
    }
  }

  // Loops through ucSetArray
  for (let i = 0; i < ucSetArray.length; i++) {
    if (ucSetArray[i].includes("/")) {
      nonSingleFragments.push(ucSetArray[i]);
    }
  }


  $("#non-single-fragments").text("All non-single fragments from applying enzymes above: " + nonSingleFragments.join(" "));

  nodesandEdges();
}

// Abnormal fragments that dont follow rule check
function checkForAbnormalFragments(gSetRefragmented, ucSetRefragmented) {
  let gSetArray = gSetRefragmented.split(" ");
  let ucSetArray = ucSetRefragmented.split(" ");

  // Loop through the g array
  for (let i = 0; i < gSetArray.length; i++) {
    let examine_last_char_in_fragment = gSetArray[i];
    let fragment_length = examine_last_char_in_fragment.length;
    if (examine_last_char_in_fragment[fragment_length - 1] != "G") {
      abFragments.push(gSetArray[i]);
    }
  }

  // Loop through the uc array
  for (let i = 0; i < ucSetArray.length; i++) {
    let examine_last_char_in_fragment = ucSetArray[i];
    let fragment_length = examine_last_char_in_fragment.length;

    if (examine_last_char_in_fragment[fragment_length-1] != "U" && examine_last_char_in_fragment[fragment_length-1] != "C") {
      abFragments.push(ucSetArray[i]);
    }
  }

  let fragPiece = abFragments[0].split("/");
  endNode = fragPiece[fragPiece.length - 1];


}


function nodesandEdges() {
  for (let i = 0; i < nonSingleFragments.length; i++) {
    let fragPiece = nonSingleFragments[i].split("/");
    if (nodes.includes(fragPiece[0])) {
      continue;
    }

    else {
      nodes.push(fragPiece[0]);
    }
  }

  $("#nodes").text("Graph Nodes: " + nodes.join(" "));

  begNode = nodes[0];

  let finish = 1;
  for (let i = 0; i < nonSingleFragments.length; i++, finish++) {
    let fragPiece = nonSingleFragments[i].split("/");
    let abnormal_pieces = abFragments[0].split("/");

    if (fragPiece.length === 2) {
      if (fragPiece.includes(abnormal_pieces[abnormal_pieces.length - 1])) {
        let nodes_and_their_edges = {
          firstNode: fragPiece[0],
          secondNode: begNode,
          weightArc: abnormal_pieces[abnormal_pieces.length - 1],
        };
        nodesWeightedArcs.push(nodes_and_their_edges);
      }
      else {
        let nodes_and_their_edges = {
          firstNode: fragPiece[0],
          secondNode: fragPiece[1],
          weightArc: null,
        };
        nodesWeightedArcs.push(nodes_and_their_edges);
      }
    }

    else if (fragPiece.length === 3) {
      let nodes_and_their_edges = {
        firstNode: fragPiece[0],
        secondNode: fragPiece[2],
        weightArc: fragPiece[1],
      };
      nodesWeightedArcs.push(nodes_and_their_edges);
    }

    else {
      let completeEdge = "";
      for (let i = 1; i < fragPiece.length - 1; i++) {
        if (i + 1 === fragPiece.length - 1) {
          completeEdge = completeEdge + fragPiece[i];
        }
        else {
          completeEdge = completeEdge + fragPiece[i] + "/";
        }
      }

      let nodes_and_their_edges = {
        firstNode: fragPiece[0],                          
        secondNode: fragPiece[fragPiece.length - 1],    
        weightArc: completeEdge,
      };
      nodesWeightedArcs.push(nodes_and_their_edges);
    }
  }


  for(let i = 0; i < nodesWeightedArcs.length; i++){
    $("#nodes-and-arcs").append("<li>"+ nodesWeightedArcs[i].firstNode + " goes to " + nodesWeightedArcs[i].secondNode + (nodesWeightedArcs[i].weightArc != null ? " on weight " + nodesWeightedArcs[i].weightArc : "") + "</li>");
  }
  makeNodeInfo(nodesWeightedArcs);
}



function makeNodeInfo(nodesWeightedArcs){
  for(let i = 0; i < nodes.length; i++){
    let current_node = {
      node: nodes[i],
      information:[]
    };
    for(let j = 0; j < nodesWeightedArcs.length; j++){
      if(nodes[i] == nodesWeightedArcs[j].firstNode){
        current_node.information.push(
          {
            outgoingArc: nodesWeightedArcs[j].secondNode,
            weightArc: nodesWeightedArcs[j].weightArc,
            visited: false 
          }
        )
      }
    }
    nodeInfo.push(current_node)
  }

  createGraph();

  multidigraph();
}

//----------------------------------------------------------------------------------------------------------
async function resetVisited(){
  for(let i = 0; i < nodeInfo.length; i++){
    for(let j = 0; j < nodeInfo[i].information.length; j++){
      nodeInfo[i].information[j].visited = false;
    }
  }
  return true;
}

async function seeminglyRepeating(allPaths,index,n,w){
  let frequency_repeat = 0;
  let seemingly_repeated;
  if(nodeInfo[n].information[w].weightArc==null){
    seemingly_repeated = allPaths[index] + "/" + nodeInfo[n].information[w].outgoingArc;
  }
  else{
    seemingly_repeated = allPaths[index] + "/" + nodeInfo[n].information[w].weightArc + "/" + nodeInfo[n].information[w].outgoingArc;
  }

    for(let i = 0; i < allPaths.length; i++){
      if(allPaths[i].includes(seemingly_repeated)){
        return true;
      }
    }
  return false;
}


async function multidigraph() {
  let allPaths = [];
  let startnode_frequency = 0;
  let starting_paths = [];
  let all_fragments = gEnzymeRefragmented.concat(ucEnzymeRefragmented);
  for (let i = 0; i < all_fragments.length; i++) {
    let fragPiece = all_fragments[i].split("/");
    if (fragPiece[0] == begNode) {
      startnode_frequency++;
      starting_paths.push(all_fragments[i]); // 
    }
  }

  starting_paths[2] = starting_paths[0];
  starting_paths[3] = starting_paths[1];


  for (let i = 0; i < startnode_frequency; i++) {
    let finish_reset = await resetVisited();
    allPaths.push(starting_paths[i]);


    if (finish_reset === true) {
      for (let j = 0; j < 6; j++) {
        let fragPiece = allPaths[i].split('/');

        if (fragPiece.length > 1) {
          for (let n = 0; n < nodeInfo.length; n++) {
            if (fragPiece[0] == nodeInfo[n].node) {
              for (let w = 0; w < nodeInfo[n].information.length; w++) {

                if (fragPiece.length == 2) {
                  if (null === nodeInfo[n].information[w].weightArc &&
                    fragPiece[1] == nodeInfo[n].information[w].outgoingArc) {
                    nodeInfo[n].information[w].visited = true;
                    break;
                  }
                }

                else {
                  if (fragPiece[1] == nodeInfo[n].information[w].weightArc &&
                    fragPiece[2] == nodeInfo[n].information[w].outgoingArc) {
                    nodeInfo[n].information[w].visited = true;
                    break;
                  }
                }

              }
            }
          }
        }

        let currentEndNode = fragPiece[fragPiece.length - 1];
        let nodeNext;
        for (let n = 0; n < nodeInfo.length; n++) {
          if (currentEndNode == nodeInfo[n].node) {
            for (let w = 0; w < nodeInfo[n].information.length; w++) {
              if (nodeInfo[n].information[w].visited == false) {
                let repeated = await seeminglyRepeating(allPaths, i, n, w);
                if (repeated == false) {
                  nodeInfo[n].information[w].visited = true;
                  nodeNext = nodeInfo[n].information[w];
                  break;
                }
              }
            }
            break;
          }
        }

        if (nodeNext.weightArc == null) {
          allPaths[i] += "/" + nodeNext.outgoingArc;
        }
        else {
          allPaths[i] += "/" + nodeNext.weightArc + "/" + nodeNext.outgoingArc;
        }

      }
    }
  }

  // Remove the initial "/" if it exists
  for (let i = 0; i < allPaths.length; i++) {
    allPaths[i] = allPaths[i].replace(/^\//, '');
  }

  for (let i = 0; i < allPaths.length; i++) {
    $("#all-possible-paths").append("<li>" + allPaths[i] + "</li>");
  }

}


function createGraph() {
  graph = new jsnx.MultiDiGraph();

  graph.addNodesFrom(nodes);

  for (let i = 0; i < nodesWeightedArcs.length; i++) {
    graph.addEdge(
      nodesWeightedArcs[i].firstNode,
      nodesWeightedArcs[i].secondNode,
      { weight: nodesWeightedArcs[i].weightArc }
    );
  }

  jsnx.draw(graph, {
    element: "#canvas",
    withLabels: true,
    nodeAttr: {
      r: 15,
    },
    stickyDrag: true,
  });
}