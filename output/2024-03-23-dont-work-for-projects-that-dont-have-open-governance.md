---
title: "Don't Work For Projects That Don't Have Open Governance"
date: "2024-03-23"
categories: 
  - "meta"
tags: 
  - "oss"
---

I'm going to weigh in on the [Redis thing](https://techcrunch.com/2024/03/21/redis-switches-licenses-acquires-speedb-to-go-beyond-its-core-in-memory-database/).

<!--more-->

First, I want to touch on this quote from the article I linked above:

> _“Particularly with Speedb, this is a big investment for us as a startup. If we put that in there and the cloud service providers have the ability to quickly just take and ship it to their customers — essentially without paying anything — that’s problematic for us, as you can imagine.”_

Ah yes, plucky startup Redis Labs, with over $350M in funding (most recently a G Round) and a valuation over $2B. I'd be more sanguine if Redis hadn't done this sort of shit before, or if multiple other companies hadn't taken similar tacks.

Let me get this out of the way, though -- if Redis Labs wants to re-license software that they own the copyrights and code for, that's their right. gg no re. My problem isn't that they're changing the rules of the game (and really, _everyone should have seen this coming_), my problem is that people keep getting their pants in a twist over it. We need to stop sitting back and saying "ah, the source is available, so it's open source and that's fine!" Just because something is on GitHub doesn't mean it's good, or useful, or sustainable. I think this is the generic fate of all 'open core' products, or even most of the 'open source' AI that's out in the world. The thing that matters is who gets to make the decisions, and who owns the IP and copyright.

I actually tend to believe that most 'open source' but closed governance tools would be better served by just being source available from the jump, rather than using an OSI-approved license. I want people to stop building critical parts of their system around things that can, and will, be yanked away from them at a moments notice. I think this even applies to foundation-backed projects! There's a non-zero amount of CNCF projects where the governance is controlled by a single company, more or less. Do some leg work, make sure the steering committee actually meets, see if it's legit. _Especially_ do this if you plan on becoming a contributor, because it sucks to have your work get vacuumed up to enrich someone else. I would go so far to say that if you're a company using open source but closed governance tools or libraries, just preemptively fork and don't submit patches back upstream. The only safe open source is open governance.

"But wait, that basically means we need to dedicate engineers to maintaining our fork, thus erasing the cost savings of using open source in the first place!" Well yeah. No such thing as a free lunch!
