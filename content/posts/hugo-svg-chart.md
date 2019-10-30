---
title: "Dynamic SVG Charts in Hugo"
date: 2019-09-26T15:26:46-04:00
anchor: "Dynamic SVG Charts in Hugo"
type: "post"
---

![image](/images/chart.jpg)

As part of my work on [OpenTelemetry](https://opentelemetry.io), I had the opportunity to work on some changes for the project's website. For quite some time, I had bemoaned the lack of a 'one-stop shop' to view overall progress towards release for all of the project SIGs, but hadn't really had the opportunity to do much about it. Over the past couple of days, I rebuilt a static chart image into a dynamic, data-driven [Hugo](https://gohugo.io) template. If you're interested in learning how to this yourself, read on!

<!--more-->

# Initial Concept

Originally, my concept for the table was simple HTML with project dates and names, supplied by a Hugo data template. This was quickly redrawn into a more visually pleasing form, such as you can see here -

![image](/images/static_otel_timeline.png)

I quickly realized that the challenge in maintaining this chart would be the changing requirements, not only of the potential SIGs but also of the changing completion dates and rates. Midway through the process of making the chart dynamic, I realized that the milestones themselves were changing as well. While it would be theoretically possible to just update the chart on a weekly basis, 

