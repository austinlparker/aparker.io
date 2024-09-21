---
title: "Observability and the Decentralized Web"
date: "2023-08-22"
categories: 
  - "newsletter"
---

![flocks of flamingo](https://images.unsplash.com/photo-1494426793932-d42e434f469e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMDAzMzh8MHwxfHNlYXJjaHwyOXx8cGluayUyMGZsYW1pbmdvc3xlbnwwfHx8fDE2OTI3MTM0MjZ8MA&ixlib=rb-4.0.3&q=80&w=1080 "flocks of flamingo")

It’s probably still too early to write the obituary for centralized social media and ‘Web 2.0’ — but if you squint, you can see it on the horizon. Ongoing [regulatory pressures](https://www.reuters.com/legal/legalindustry/us-data-privacy-laws-enter-new-era-2023-2023-01-12/) and the slow burn of Twitter at the hands of Elon Musk aside, there’s an increasing body of evidence that courts and governments will take a more active hand in the moderation and control of user-generated content. [This piece on the draft deal between TikTok and the US Government](https://www.forbes.com/sites/emilybaker-white/2023/08/21/draft-tiktok-cfius-agreement/?sh=2f0aa42a112a) to avoid a ban of the former is, I fear, broadly indicative of what the future holds for social platforms.

<!--more-->

While reasonable people can disagree on the correctness or morality of these interventions, I feel like it’s more interesting to think about what this means not only for the future of social media (and indeed, the web itself) and how we think about performance and user experience.

Broadly, let’s define the ‘decentralized web’ as something that looks a lot more like Mastodon or Bluesky than Reddit or Twitter. The key distinctions I would lay out are -

- User generated content is not stored[1](#footnote-1) on a server controlled by the entity that provides a view of that content.
- User identity isn’t controlled by a central server — users decide who they are based on protocols.
- There are far more WAN links rather than LAN links between content stores and viewers.

This is, admittedly, an overly simplified version of the concepts at play. However, you should see three things pop out at you that are extremely important from a performance standpoint: data stores (and queries), authorization, and networking. These also happen to be common optimization areas in distributed systems, and that’s where observability comes into play.

I tend to describe observability as a way to understand systems. Cloud-native and distributed systems in general are fiendishly complicated as it stands; Observability gives you the ability to model that system and ask questions about it. Decentralization doesn’t reduce the need for observability, but it does present some novel challenges.

In a decentralized system, certain signals become much more important than others. Log aggregation, for example, is a lot harder to do when many of the logs you care about don’t exist on servers you control. However, the increased amount of WAN links means that space and time are both at a greater premium. While this seems to be an argument in favor of more metrics (it kinda is), I would argue we need to focus more on how to model these systems via distributed tracing _and_ how we can more efficiently compress and ship that data. We also need to think very carefully about clocks, and when things happen. Identity is a good example here — changes in authorization scope or permissions (bans, mutes, visibility, etc.) will need to be tracked not only over time but also presented in context of other operations, especially in decentralized systems with automated reputation management.

It’s also incumbent on us to educate end-users about how performance profiles are expected to differ from what they may be used to. If you’re a Bluesky user, you may be familiar with [custom feeds](https://blueskyweb.xyz/blog/7-27-2023-custom-feeds) — they’re a list of pointers to posts on the network that meet some criteria. However, feeds are hosted by individual users on their own hardware or cloud provider. Compared to a Twitter list, this results in not just a less timely response, but one that can vary wildly based on not just geographic factors, but also implementation differences between feed generators.

Over time, these differences will become more pronounced as more parts of the network federate and decentralize. The ATProto model that Bluesky is built on promises to separate moderation, feed generation, indexing, search, and aggregation into separate services that you can choose. The more spread out all of these are, the slower things get.

I don’t believe that this will become unusable, but I do think it will be different enough that we will need to engage with end-users to help educate them about the expected difference in performance; We also must help them understand why it’s different, and why it’s an acceptable difference. It’s not enough to simply stand on the sidelines and say “It’s better”, we need to demonstrate this through our actions.

[1](#footnote-anchor-1)

For the purposes of discussion, let’s imagine that ‘stored’ in this case refers to the origin of a post, and not any cached content. A pointer isn’t necessarily storage.
