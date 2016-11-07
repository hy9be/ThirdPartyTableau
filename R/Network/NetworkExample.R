library(networkD3)
library(htmlwidgets)
NetworkData <- data.frame(.arg1, .arg2, .arg3)

network <- simpleNetwork(Data = NetworkData, zoom = TRUE,
                         fontFamily = "sans-serif", nodeColour = "black")

saveWidget(network, "network.html")
1.0 #Tableau will error without an valid return value