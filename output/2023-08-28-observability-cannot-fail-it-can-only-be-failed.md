---
title: "Observability Cannot Fail, It Can Only Be Failed"
date: "2023-08-28"
categories: 
  - "newsletter"
---

Being between jobs is a great time to step back, do some self-critique, and engage in light home improvement for fun and or profit. It’s this last pursuit that’s convinced me that if this whole computer thing doesn’t work out, I’m screwed — I don’t have the spirit of a tradesperson in my body. This revelation was prompted by my journey to install laminate flooring in my office, which has until now simply had a bare concrete floor. Originally, I had my heart set on some ‘Luxury Vinyl Planks’ (or LVP), which was not only recommended to me by industrious flooring salespeople, but was available in a variety of delightful colors and patterns.

Sadly, LVP commands a significant price premium, which was unattractive for what’s meant to be, ultimately, a temporary job. We’re going to get the basement finished eventually, with consistent flooring throughout, so why waste the money? Thus, I chose what seemed to be the ‘best’ laminate I could find, purchased all of the accessories and tools that I could find to aid in the installation, and spent hours reading and watching tutorials about it. Thus armed, I cleared out the office, cleaned the floor, and started to place the flooring.

Reader, it may surprise you to learn that this plan went to _shit_.

<!--more-->

The second plank went in fairly easily, but issues started to crop up with the third. The walls weren’t quite as straight as I thought they were, which lead to some small alignment issues. The material for the laminate, I found, was significantly less durable than I hoped and began to crack and chip; This led to planks that didn’t lock together properly, or damage as I tapped them into place. Undaunted, I continued, figuring that a couple of small errors wouldn’t really impact the end product; After all, this is all temporary!

Halfway through, problems were coming further and faster. While I had gotten better at the basic process, the small irregularities were causing larger and larger downstream problems. If only I had known the cost of my lack of attention to detail! An entire row of planks failed to join, thus leaving me with two roughly independent floating floors. I was in too deep, I just needed to get the damn project done with, so I summoned up my gumption and pushed through. I can always put a rug over the gaps, right? I’ve got other things to do, and going back to a bare floor would be a huge setback… and they won’t take the opened cartons of flooring back for return, anyway.

If this situation sounds familiar, then you’ve either worked in software or _also_ engaged in home improvement. It’s a common pattern, right? Get into something that you kinda understand because it's gonna solve a problem, do your research, hit some footguns and dodge some others… but all of those glancing blows and near misses multiply. By the time you’re feeling the pain, you’re in too deep. You can’t just go back down to studs and re-do the whole thing, so to speak. So, you ship, and you ship, and you keep shipping and throwing patches on the whole mess while telling yourself that you’ll go back and re-do the whole thing right one of these days.

While this happens literally all of the time, I’ve noticed it’s extremely common in observability implementations. Tracing, continuous profiling, log analysis, whatever technology you turn to as a panacea to your performance problems seem to wind up as costly and maintenance-heavy boondoggles. Transformative success stories seem to be the exception, rather than the rule. Developers fall back on good ol’ metrics and grepping through logs - why, though?

## Open Source Is Laminate Flooring

I believe there’s really two fundamental problems here. The first has to do with telemetry and it’s associated tooling, and the second has to do with workflows.

Telemetry data (traces, metrics, logs, profiles, events, _whatever_) is necessary, but not sufficient, for observability. However, _telemetry quality_ is the real distinction between successful and failed observability initiatives. OpenTelemetry (and other open source tools) seek to bring up the standards here, but it can be misleading. There’s a tradeoff you’re making when you use open source, the same tradeoff I made when I went with cheaper laminate floors. A master can take poor materials and make them sing, but an amateur cannot. This is the advantage of, say, Datadog, in a nutshell: you install the agent and it pretty much _just works_. They’ll give you dashboards and data that might not actually _help_ (from an observability point of view), but will give you enough indicators of ‘things going wrong’ that you can fall back to traditional workflows to diagnose and pinpoint failures. Choosing OpenTelemetry is a bet on your ability to master and integrate it at a pretty deep level!

This mastery, obviously, brings benefits - no vendor lock-in, more control, the ability to leverage the open source ecosystem. Crucially, this mastery flows into solving the second problem, that of _workflows_.

Observability workflows aren’t characterized by how great your dashboards are, how smart your alerts are, or how much data you can store. In short, the _only important question_ is “Do I have enough high-quality data about my system for a broad query to return semantically useful results?” While a simple question, it’s fiendishly difficult. It implies that you have mastery of a query language in order to map your question into th

e lexicon of your analysis tools. It implies that the _right_ data is available for query, and that it hasn’t been sampled out. It presupposes that everyone involved in writing telemetry has done an equally good job of it, that everything has the right metadata, and that the telemetry accurately models the system in question.

These are linked problems; poor telemetry tooling leads to less-than-useful workflows. The best database in the world doesn’t help if everything you need got sampled out. Accurate metadata doesn’t matter if it’s not consistent across a set of telemetry inputs. Having the right type of signal doesn’t matter if you’ve lost too much resolution on it due to temporal re-aggregation. None of it matters if you’ve got a bunch of engineers that have no clue how to use the query engine, or if the analysis tools and dashboards aren’t connected and made a part of existing workflows.

Here’s a story I’ve seen play out at too many organizations — leadership, responding to systemic performance challenges, bring in a new vendor or observability stack to solve

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F241e94be-3c02-4810-af22-e16f836d73a6_512x512)

the problems. Implementation falls to a small team who go out and somewhat blindly instrument broad parts of the system in an attempt to ‘see everything’. This team usually struggles to master the underlying instrumentation and integrate it into existing service frameworks, but finally roll out a MVP… and it mostly lays fallow. So much time was invested in just _getting the telemetry_ that nobody stopped to ask about the _observability._ Internal marketing kicks off, training is held, and usage ticks up somewhat… but not convincingly. A few die-hards that spend the time to build mastery get stuck in, and increase their bus factor by a ridiculous amount. Ultimately, though, the transformative potential of observability is never realized - most people still grep through logs and page through endless metric dashboards. Obviously this isn’t _observability’s_ fault, though. How could it be? Nobody really tried.

## Flipping The Script

What should you walk away from this piece with? Depends on who you are, really. I believe we should re-think our approach to observability implementations, though. We tend to focus heavily on telemetry-first (which makes sense, gotta have the data, right?) but I’m increasingly convinced that we should first analyze our _workflows_ in order to drive instrumentation.

Starting at the end, as it were, has some advantages. You can take an inventory of how work is done, rather than just how it’s imagined. You can find the places where

observability should be integrated, and the people who need the data. You can understand the needs around queries, dashboards, alerting, and so forth. Once you know these things, it becomes much easier to ask what telemetry you need to satisfy these workflows, and prioritize it.

It also means that the telemetry creation and instrumentation process needs to be more responsive to this sort of workflow-driven approach. Rather than spewing a firehose of data, we should focus on providing a tailored stream (or streams) in an easy-to-comprehend and ingest way. OpenTelemetry has a role to play here, clearly, especially as work on configuration and management continues.

Finally, observability practitioners should consider their messaging and methods. We spend a lot of time sharing success, but failure is so much more interesting to learn from, don’t you think? Let’s do more to talk about what _doesn’t_ work and figure out better ways to move our organizations forward.
