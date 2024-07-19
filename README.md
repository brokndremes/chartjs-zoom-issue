# chartjs-zoom-issue

Repo Demoing ChartJS zoom bugs

As configured, Pan and Zoom are enabled when holding down shift

Points can be removed by clicking on them while holding alt, or added by clicking the plot while holding shift

The background has a series of red dots - these should line up with the red dots that are drawn by Chart.js, however when the plot is zoomed in and/or panned, the image stays static.