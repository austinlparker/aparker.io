---
title: "Stop Trying To Make Observability Happen"
date: "2022-10-16"
categories: 
  - "newsletter"
---

 

![](images/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27a37953-2bf3-438f-9569-f32977803ca5_1440x806.png)

"It's not going to happen."

A friend of mine ([@mononcqc](https://twitter.com/mononcqc?lang=en)) turned me on to an essay titled ['Unruly Bodies of Code in Time'](https://www.jstor.org/stable/j.ctv1xcxr3n.14#metadata_info_tab_contents) the other day, and skimming through it made me consider a phrase I like to use when introducing observability concepts to folks. I give a talk every week or so to new cohorts of employees at Lightstep, talking them through our concept of what observability is, why it matters, etc.

If you're familiar with my work at all, it shouldn't surprise you that it takes about 30 minutes until the word 'trace', 'log', or 'metric' ever escapes my lips in these talks. Over time, my understanding of observability has matured and grown into something that, frankly, is rather disjoint from the innumerable 'observability solutions' that are marketed and sold to software developers.

> Observability isn't a product, it's not any type of data or combinations thereof, and it's not something you can buy. Observability is an _organizational substrate_.
> 
>  

<!--more-->

## Everything Decays

Any system, even ones maintained by a single individual over time, tips towards entropy and decay. Organizations act to ossify systems through encoding processes and practices in an attempt to stymie this natural entropy. History is littered with examples of this in practice; We instinctually understand, however, that this organizational inertia towards stasis eventually provides opportunities for insurgents to storm the castle and throw down its masters, inspiring radical change. We can also see how concepts such as [pace layering](https://jods.mitpress.mit.edu/pub/issue3-brand/release/2) come into play by allowing for the diffusion of shocks to these systems.

In plainer terms, we build teams because we know we'll go further than we could alone, and then we build companies or organizations around those teams to 'spread out' our risk of unrecoverable systemic failure. You can probably look around your own company and find examples of this -- there's things that move quick (insultingly quick!) and things that move glacially slowly.

I would suggest that this generally holds in software organizations regardless of purpose or size, but tends to become more pronounced the larger the supporting organization is, and the amount of "legacy" software it has produced and operates.

So-called "legacy" systems (perhaps better referred to as "systems that make the company money") are the biggest beneficiaries of the ossification trend. Any software system is reflexively shaped by the time it was built, the idiosyncracies of its authors, the constraints and limitations of prevailling technology, and so forth. Onboarding to these systems requires significant amounts of defined processes and practices in order for the newcomer to avoid hazards that experienced personnel are intuitively aware of. To quote from 'Unruly Bodies':

> Chris seems simultaneously a bit abasehd but also in awe of the fact that by virtue of being new and knowing less and doing something "wrong" … he actually lead to a kind of discovery of an anomaly hidden in the depths of the software system, something no one knew was there.

In this quote, Chris is (quite literally) a rocket scientist who started working at NASA on the Cassini mission straight out of a Masters program, and was required to learn the 'legacy' system that powered it. In his learning efforts, he regularly discovered unexpected or emergent system behavior due to his lack of experience with the system. Keep in mind, the system Chris is working with was over 40 years old at the time! The world of its architects, designers, and implementors was vastly different than the one that we inhabit today.

His, and our, ability to perform almost any task on an established system is the result of significant amounts of defined processes, documentation, 'best practices', and other _organizational dynamics_.

## Systems You Can Touch And Feel

Let's jump back a bit. I mentioned earlier that when I introduce observability, I don't talk about data for a while. What I _do_ talk about is organizations, and how they build and operate software systems. Over the past couple of decades, the replacement rate of software has increased exponentially thanks to the ubitquity of broadband internet, the commercial viability of free and open source software, and the popularity of the "X-as-a-Service" model. Systems evolve and change more rapidly than ever before.

However, we do ourselves a disservice if we limit our thinking about "what's changing in a system?" to the code, or architectural patterns, or deployment infrastructure. I characterize it as follows - a software system is an accretion disc, like the rings of a planet. It's the result of countless small decisions made over a long period of time.

Systems have parts you can "touch", and parts you can "feel". The parts you can touch -- yes, that's the code, that's the API. It's also the fake data you bootstrap your development environment with, or the SSL certificates, or the ability of a queue server to not fall over under load. The parts you can feel are gauzier, but they're arguably even more important. Code can tell you the 'what' of a system, but to understand why there's a comment that says 'Don't change this - FB', you need to understand who 'FB' is, and why they matter. You need organizational context and history that `git log` can't provide. Why is the API designed this way? Who designed the bootstrap data, and what were their biases around architecture?

The things you can feel are about power and authority, about who gets to make decisions and why. You can't understand a system without knowledge of _both_.

## Bringing It Together

This is where our diverging lines of inquiry come together. Observability is mostly pitched as a _tool_ that helps you understand systems and how they fit together. I think this is a disservice, a malapropism of out-of-control marketing. We need to consider observability in the context of processes and practices more than data or tooling. If we build organizations to be resistant to shocks, then that means we need resiliency throughout the different layers of that organization. One outgrowth of this is, obviously, building resilient software. I would suggest that the largest contributor to fragile software _isn't actually the software_ though, it's inability of _organizations to prioritize software reliability_ due to poor linkage between the 'purpose of the organization' and the 'purpose of the software operators'. Think back to Chris, who was mystified by how his inexperienced hands could create novel failures in what _should_ be a battle-tested and hardened system; What need did NASA have of resilient software when it had veterans and defined processes and practices, just as long as you don't screw anything up, everything will be fine?

Observability needs to help connect these divergent threads and spin them together. Resilient software can only be built by resilient organizations; Our tools need to help bridge these gaps between layers and effectively allow different groups to understand and value each other's work and how it fits together. This isn't to say that we're somehow on the 'wrong track' as an industry, I simply think we're getting too caught up in the observability trees to see the observability forest, as it were. I believe there's a lot of work to be done in understanding how observability can lead to more elastic and fault-tolerant policies and processes, how open data standards can help connect discrete performance and analytic telemetry, and how we can more effectively encode and preserve the parts of the system we feel in history so that we can learn from our legacies.
