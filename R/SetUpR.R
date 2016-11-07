#setup for R/JS/Tableau integration

#dependencies install.packages(c("Rserve", "servr", "htmlwidgets"))

#run the R server to handle the creation of the graphics
library(Rserve)
Rserve()

#run the httpserver at http://localhost:4321/test.html
library(servr)
httd()
