---
title: "Data Bores"
date: "2023-11-20"
categories: 
  - "newsletter"
---

![](images/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc9ed5aa3-bc27-4e9b-981a-ebf1945b06dd_1024x1024.png)

Sampling is a method to reduce the volume of data processed and stored by observability tools. There’s a variety of methods and algorithms that can be employed to do this, and most observability practices will wind up using a blend of them, but this blog isn’t necessarily about how to implement any individual technique. No, what I’m interested in discussing is the _why_ of sampling, the outcomes that we’re looking for when we implement it, and some of the novel work that I’m seeing around the subject.

<!--more-->

## The Why's Of Sampling

So, why do we sample? “Cost” is the easy answer here, but I think it’s important to get a little nuanced. Cost isn’t just dollars and cents, although that’s often where people will start and stop their consideration. We can break down the cost knobs here a bit more finely, though.

- Egress and Ingress Costs. How much you’re spending to send and receive telemetry data. These aren’t necessarily fixed costs, either; Depending on the design of your pipelines, you may end up paying a highly variable amount at many stages as you perform ETL (extract, transform, load) steps.
- Storage Costs. A bit simpler to reason about, the actual cost to keep the bits around. These are probably the simplest costs to rationalize because they’re easy to see — storing a gigabyte of logs in S3 costs what it costs.
- Processing Costs. These are often abstracted away from you in some way, especially in your commercial analysis tools. If you’re running your own analysis stack, though, then you’re probably somewhat familiar with the tradeoffs between the amount of data you store and the resulting increase in query time/performance, especially with high-cardinality metrics.
- Human Costs. These aren’t discussed as much, but there’s a very real penalty to having _too much_ data. Increasing the amount of noise in your data set inevitably increases the complexity of navigating the data, and makes it more difficult for users to discover signal.
- Headroom Costs. Telemetry processing of any sort incurs penalties to data freshness, availability, and consistency. You need to budget some amount of overhead into your pipeline at every step, from generation to ingestion, in order to perform sampling steps and filtering. These costs tend to get bundled up with ‘instrumentation’ in a lot of people’s minds, but I think it makes more sense to amortize them as part of sampling — like jazz, it’s more about the telemetry you don’t send.

Often, our models don’t encompass all of these cost knobs — at least, not explicitly. I think this is because we tend to limit our imagination around sampling strategies, usually because our basic assumptions tend to be somewhat fixed. “It’s not possible to keep everything, so we _have_ to sample.” “Most of this data is useless, so let’s try to only keep what matters.” These are the baked-in assumptions for not only SREs and developers who use observability systems, but also the creators of those systems. They’re not necessarily wrong to assume this, either! The problem is when we make these assumptions _independently_.

Let me explain this by analogy. If you’re going on a trip somewhere, you need supplies. Fuel for your vehicle, snacks and drinks, entertainment. How do you plan what you need based on the amount of space you have? You start from your desired outcome, then work backwards from there. If you’re about to go on a multi-day trip, you could certainly fill up a bunch of extra gas cans and carry them with you, but you can probably optimize that space with things that are harder to get along the way (like luggage, or food in a cooler) and get fuel in-transit. This is how we should think about sampling from an observability perspective; Rather than aggressively trying to map to some quota or default assumption about what’s “too much” or “too little” data, figure out your ultimate goal then work backwards to see how much data you need to collect and store to get there.

## Observability - It's About Value

The destination of an observability journey should be towards the value you’re getting out of it, and the measures you have in place around that value. Much of the time, this value can be in the format of SLOs (Service Level Objectives), but that’s not the only way to conceptualize it. You can measure it in developer experience, in on-call quality of life statistics, in incident resolution time (or near-miss recording). The ultimate measure of any observability program is going to be a measurement about _humans_. With this in mind, you should ‘start from the end’ when evaluating sampling strategies — figure out what you want to measure, then experiment with what data you need to achieve those outcomes. I guarantee you that it won’t be just one type of signal — good SLOs and observability measures almost always need a stream of data that includes metrics, logs, traces, profiles, etc.

“That sounds kinda hard to do, though?” you may be asking. Well… yeah, not wrong. I’d argue that many failures in observability programs are due to misalignment around this specific topic. If you aren’t sure what you’re driving towards, then you’re not going to make great decisions about how to get there, and what you need along the way. You wind up making bad assumptions, and now you’ve got a bunch of data that is _vaguely_ useful but not really _essential_ and a poor return on investment. Sampling can’t be a “we’ll figure it out later” — especially as OpenTelemetry continues to become a built-in part of cloud-native systems. By design, it emits a ton of data! You need to have a plan in place on what matters and what doesn’t, and feedback mechanisms to understand and change that calculus over time.

This leads me to my initial point — can AI help? I think there’s promise, but we’re not quite there yet. Let’s break this down a little bit.

## Will AI Fix Our Observability Sampling Woes?

Generative AI, specifically large language models, are pretty good at guessing what should come next when prompted. The problem is that they need a pretty big corpus of inputs to help them figure out what should ‘come next’. OpenTelemetry promises to be extremely valuable here, especially as it’s adopted by research and academic computing organizations that will make their telemetry data open source. This should allow the training of neural nets that can compare what you’re doing and make suggestions about what kind of telemetry you should be creating, and what you can throw away. However, it’s not necessarily a static answer. Your needs can, and must, change in response to external conditions. During deliberate and incidental system changes, you need more telemetry, and you may need it at different levels of abstraction. Load spikes or other factors bring questions about resolution vs. throughput, and there’s not really a single ‘right’ answer. I feel like AI is part of the solution here as well, but what we’re really looking for is something more like a ‘Sampling OODA Loop’.

<figure>

![](images/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3d32e4cb-073c-44d3-8802-6b00db1ea345_1024x1024.png)



</figure>

[OODA (Observe, Orient, Decide, Act)](https://en.wikipedia.org/wiki/OODA_loop) is a decision-making strategy that comes from military strategy. You can read more in the link, but the important part of this concept is that it’s a continuous process — you never stop making these decisions, and the goal is to go through the loop faster and more accurately each time. The missing part of our sampling models is the ‘act’ part; The ability to coordinate changes to fleet sampling strategies across many hosts/nodes is challenging, requiring a high level of coordination across sampling nodes and the ability to process complex objectives. Right now, we’re capable as an industry to perform this sort of loop in a fairly narrow scope — dynamic sampling approaches for tracing allow you to adjust the rate of span ingest based on metadata. Spatial and temporal metrics re-aggregation allow for reducing complexity of timeseries post-generation but pre-query. Similarly, many security tools will perform continuous analysis of log fields for anomaly detection purposes. What we’re missing is something that brings all of this together.

The future of sampling isn’t just ensuring that all of your errors get collected, but instrumentation that can make intelligent choices about _what telemetry gets emitted_ based on system state. These decisions will be driven by the visualizations and workflows that are backed by the telemetry itself — imagine an SLO that can communicate upstream with observability sources to ask for the best type of telemetry data to measure the SLO at any given time, and modify that mix when you start to burn in order to let you debug more effectively. To do so, we’ll have to emit a lot more telemetry, yes. Just because it’s emitted, though, doesn’t mean we have to keep it all.

To wrap up, I don’t want to think just about what the future holds. There’s a lot you can do today in terms of improving your telemetry collection strategy, and most of it has to do with prioritizing your goals. Be careful of dogma around the value of specific signals. Figure out what value you’re driving towards with your observability practice, then work backwards from there to figure out which signals you should keep, and for how long. Finally, don’t be afraid of using multiple data stores — it’s pretty cheap to throw _everything_ into S3 for a month or two, after all, and it gives you options.
