  $(document).ready(function() {
    var url = $('#vizContainer').attr('url');
    initViz(url);

    $('#pdfExport').on('click', function() {
      viz.showExportPDFDialog();
    })
    $('#csvExport').on('click', function() {
      viz.showExportCrossTabDialog();
    })
    $('#imageExport').on('click', function() {
      viz.showExportImageDialog();
    })
    $('#dataExport').on('click', function() {
      viz.showDownloadWorkbookDialog();
    })
    $('#workbookExport').on('click', function() {
      viz.showDownloadWorkbookDialog();
    })

    //console.log(data);

    var viz; //so you can access it in the console
    function initViz(vizUrl) {
      var containerDiv = document.getElementById("vizContainer"),
        url = vizUrl,
        options = {
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive: function() {
            //Run this code when the viz has finished loading
            listenToMarksSelection();

          },
          onFirstVizSizeKnown: function() {
            //console.log(viz.getVizSize());
          }
        };

      viz = new tableau.Viz(containerDiv, url, options);
      // Create a viz object and embed it in the container div.
    }


    function getUnderlyingData() {
      sheet = viz.getWorkbook().getActiveSheet();
      // If the active sheet is not a worksheet, then you can just enter:
      // viz.getWorkbook().getActiveSheet().getWorksheets();
      options = {
        maxRows: 329174,
        includeAllColumns: true
      };
      sheet.getUnderlyingDataAsync(options).then(function(rawData) {
        var cols = rawData.getColumns();
        var data = rawData.getData();
        var fieldNameMap = _.map(cols, function(col) {
          return col.$impl.$fieldName;
        });
        var dataToReturn = _.map(data, function(d) {
          return _.reduce(d, function(memo, value, idx) {
            memo[fieldNameMap[idx]] = value.value;
            return memo;
          }, {});
        });


        var nodes = _.uniq(_.pluck(dataToReturn, 'Dest'));
        var origins = _.uniq(_.pluck(dataToReturn, 'Origin'))
        nodes = nodes.concat(origins);
        var named = [];
        for (var i = 0; i < nodes.length; i++) {
          var group = 1;
          if (origins.indexOf(nodes[i]) !== -1) {
            group = "0"
          }
          named.push({
            "id": nodes[i],
            "group": group,
          })
        }
        nodes = named;

        var links = [];
        var targets = [];
        for (var i = 0; i < dataToReturn.length; i++) {
          // if (targets.indexOf(dataToReturn[i].Dest) !== -1) {
          //   continue;
          // }
          links.push({
            "source": dataToReturn[i].Origin,
            "target": dataToReturn[i].Dest
          })
          targets.push(dataToReturn[i].Dest);
        }

        var distinct = [];
        var distLinks = [];
        for (var i = 0; i < links.length; i++) {
          var concatName = links[i]["source"] + links[i]["target"];
          if (distinct.indexOf(concatName) !== -1) {
            continue;
          }
          distLinks.push(links[i]);
          distinct.push(concatName);
        }

        var d3Json = {
          "nodes": nodes,
          "links": distLinks
        }
        console.log(d3Json);
        initD3(d3Json);
        // tgt.innerHTML = "<h4>Underlying Data:</h4><p>" + JSON.stringify(table.getData()) + "</p>";
      });
    }

    function listenToMarksSelection() {
      viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
    }

    function onMarksSelection(marksEvent) {
      getUnderlyingData();
    }


    function initD3(data) {

      var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
          return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      var graph = data;

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) {
          return Math.sqrt(d.value);
        });

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) {
          return color(d.group);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      node.append("title")
        .text(function(d) {
          return d.id;
        });

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links);

      function ticked() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        node
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });

        graph.nodes[0].x = width / 2;
        graph.nodes[0].y = height / 2;
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }


  });
