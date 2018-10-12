
// GROUPS:  0 Web | 1: Adobe | 2: hybrid
d3.json("/data/pak1SecDegNetwork.json", function(data){
	var data = data.nodes;
	var links = data.links;

	//var links = network.links;
	//console.log(linkdata);

	//console.log(data);
var width = window.innerWidth,
    height = 2000;

var fill = d3.scale.category20();

var nodes = [], labels = [],
// links=[
// 	// { "source":1,"target":2,"weight":1},
// // 	{ "source":1,"target":30,"weight":100}
// ],
    foci = [{x: width/16, y: height/16}, {x: width/2, y: height/16}, {x: 15*width/16, y: height/16},
		    {x: width/16, y: height/2},{x: 15*width/16, y: height/2},
	        {x: width/16, y: 15*height/16},{x: width/2, y: 15*height/16},{x: 15*width/16, y: 15*height/16}];


var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    //.attr("domflag", '');


	//console.log(link);

var force = d3.layout.force()
    .nodes(nodes)
	.links([])
    .charge(-200)
    //.chargeDistance(200)
    .gravity(0.1)
    .friction(0.8)
    .size([width, height])
    .on("tick", tick)


//var node = svg.selectAll("circle");
var node = svg.selectAll("g");

// var link = svg.selectAll(".link")
//     .data(links)
//     .enter()
//     .append("line")
//     .attr("class", "link");

var counter = 0;

function tick(e) {
  var k = .1 * e.alpha;

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[o.group-1].y - o.y) * k;
    o.x += (foci[o.group-1].x - o.x) * k;
  });


  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}


var timer = setInterval(function(){

  if (nodes.length > data.length-1) { return;}

  var item = data[counter];
  nodes.push({name: item.id, group: item.group, neighbour: item.neighbour});
  force.start();

  node = node.data(nodes);

  var n = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('cursor', 'pointer')
      .on('mousedown', function() {
         var sel = d3.select(this);
         sel.moveToFront();
      })
      .call(force.drag);



  n.append("circle")
      .attr("r",  function(d) { return 50; })
      .style("fill", function(d) { return fill(d.neighbour-1); })

  n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 1) + "px";
       })
      .attr("dy", ".35em")



  counter++;
}, 0);


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
   this.parentNode.appendChild(this);
  })
  };



function resize() {
  width = window.innerWidth;
  force.size([width, height]);
  force.start();
}

d3.select(window).on('resize', resize);
})
