# ThirdPartyTableau
Examples of how to integrate third party graphics into Tableau Dashboards

This repo demonstrates how to extend Tableau's data visualizations with third party open source data visualization tools.

Tools like PowerBI and Microstrategy can integrate R and JavaScript d3 charts into dashbaords. These examples show how similar functionality is possible in Tableau.

Goals
- 

## R integration
R examples require Tableau's R integration. Get started here:
https://onlinehelp.tableau.com/current/pro/desktop/en-us/r_connection_manage.html

R integration uses R packages (htmlwidgets, networkD3) to make d3 JavaScript code that is embedded into Tableau dashboard as a web page. Tableau's R integration sends data to an R session that creates the html file to embed. An http server serves this file back to the web page embedded in the dashboard.

Benefits:
- The R graphics can be subject to the filters and action in the Tableau dashboard

Limitations:
- Web part does not refresh automatically
- Need two run and rserve and serveR on the localhosts, not easy to publish to the web

## JavaScript Integration

The JavaScript example shows how the Tableau Server JavaScript API can extend dashboards to include third party JavaScript charts using the same data.

The app is built in node.js

