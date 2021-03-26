# Data Visualization of Monthly Global Land-Surface Temperature using a Heat Map

This is the third data visualization project of freeCodeCamp's Data Visualization using D3.js Certification. 
The monthly global land surface temperature is visualized between 1753-2015 using a heat map and it shows the trend of rising global land temperature in the recent past.


## Work Log
Here are a few obstacles I faced during working on this project.

- getting the axis set up 
- For `yAxisScale` `.domain([new Date (0, 0, 0)], new Date (0, 11, 0))` doesn't give equal number of ticks for months so had to change to `.domain([1, 12]) `
- A lot of code is recycled from the prevoius scatter plot project

[Link to github pages](https://rajdeepdev10.github.io/heat-map)