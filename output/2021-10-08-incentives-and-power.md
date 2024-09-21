---
title: "Incentives and Power"
date: "2021-10-08"
---

<figure>

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1797b933-ec6d-48bd-9109-12fc4c02a597_512x512)



</figure>

I wrote a post a little while ago about [how SRE is really just sneaky anarchism](/the-commodification-of-devops), and this is somewhat of a followup.

Let's briefly synthesize that earlier blog post. Essentially, my argument is that there exists a vicious cycle in software engineering which derives its power from radical ideas on how to apportion power in the workplace between "labor and management", for lack of a better word. Labor - developers, operators, whoever - chafe under the strictures and taylorized systems implemented by a slate of managers. These strictures and systems exist, primarily, to justify the value of the managers to the productive enterprise. Over time, radical elements of the labor pool will band together and codify some of their values into a term like 'agile', 'DevOps', or 'site reliability engineering' in order to claw back the power to organize their productive labor in a way that makes more sense to them. As these codes crystallize into movements, they are commodified and credentialed, then repackaged and sold to managers at other firms who seek to reap the procedural benefits. Meanwhile, the radicals have been fridged and the fruits of their labor firmly divested into a hundred eager consultant pockets.

I think this is interesting if you view problems from that context. The problem isn't, after all, that "developers don't know how to code" -- given our industry's attachment to whiteboard interviews I think we can discount that possibility -- but that developers don't have ownership. Not necessarily ownership over their code, but ownership over the _results_ of their code. Your individual labor is rather atomized and packaged into Jira tickets so that managers can justify their role in the delivery of software.

"Wait, we need tickets and acceptance criteria and so on in order to coordinate and maintain a record of changes!" Well, no shit, that's not the problem. The problem is the disconnect you have from the productive work that you perform. Think about a feature you worked on, maybe even the first feature you worked on at your current job. Do you still maintain that code? Do you even know if that code is still running? I'd suspect the answer is no, especially if you've been somewhere for a couple of years. You've probably been re-orged at least once, maybe even several times, and the "thing that you do" has long stopped mattering. It's all just an endless set of tickets and feature requests, prioritization and sprints. You're a part of a larger whole, because the system is too complex and unwieldly for anyone to carry it all on their back anyway.

This doesn't have to be the case, I'd argue. Your individual contribution has been deliberately divorced from its productive value to the whole, because that's a "more efficient" way of doing things. What if we didn't optimize for efficiency to shareholders, however? What would a truly responsive product look like?

<!--more-->

This, I think, is the interesting question, and one that might piss some people off. A closely held software product would almost certainly be less "accessible" than one designed and built by committee, unless such accessibility was core to the product itself. It's also not necessarily true that such a closely held product would be more performant, or that it would have virtuous product management or goals, than other such tools. The only thing you could really guarantee would be that the people who built the product would have true ownership over it, and it would succeed or fail on those merits.

_Note: I'm picking this up after like 3 months of sitting on it because I just figured out where to go with the piece._

There was, very recently, a [global Facebook/WhatsApp/Instagram outage](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/) where BGP got whoopsie'd bad enough to knock all of their servers off the internet entirely. Beyond the jokes you might make about this, it's a perfect story because it can prove or disprove anything you'd like about our modern software hellscape. Maybe you're worried about the increasing concentration of power into the hands of private corporations, maybe you're worried about the increasing concentration of the internet into private un-federated platforms, maybe you're worried about how automation makes things more and less resilient, etc.

That said, the purpose of systems is what they do and what Facebook and other very-large-scale systems do is act as a replacement for things that normally a government would do. As an example, this [story about Afghanistan rescue efforts being hampered by the WhatsApp outage](https://www.militarytimes.com/flashpoints/2021/10/04/whatsapp-outage-a-nightmare-for-group-working-to-rescue-afghans-american-citizens/) illustrates exactly how much we've allowed extremely large systems to completely subsume functions that arguably shouldn't be held in private. Think about it; if Twilio went away for 24 hours, how much would break? What about Datadog, or GitHub, or New Relic, or any number of other developer-focused systems. We have both first and second order effects to consider here. Very large private social networks are running some of the primary communication systems we use every day. These very large private companies are also dependent on other very large companies. There's no practical check on their power, because growth is incentivized over everything else. A different world might react to Facebook's 3 billion global users with horror rather than applause.

Let's go back to the start. Who actually is responsible for _anything_ anymore? Depending on your ideological or conspiratorial bent, there's a lot of answers here, but I think the real creeping terror at all of our hearts is the knowledge that _nobody_ is responsible for _anything_. We're all trapped in the carcass of a machine, and the machine is bleeding to death. Our attempts to create a better world within our reach by optimizing processes, or by creating little anarchic practices inside multi-trillion dollar companies, these feel like reactions to the implicit realization that we can't actually automate our way out of the end of all things. Similar to the rogue AI, Durandal, of _Marathon_ fame we flail against the closing of the universe. Escape, we believe, will make us god.

You can't actually escape, though, can you?

There's a lot of people a lot smarter than I am who've proposed a variety of solutions to this quandry, so I'm not gonna go through them here. If you're reading this, you might already have a few in mind. What I want to leave you with is the following points -

- You can't really divorce what happens in 'business' from ideology. Agile, DevOps, SRE, Observability, whatever -- these movements are all rooted in fundamentally liberatory ideologies.
- A big reason that we pursue these is that we're very divorced from the products of our labor. We program computers to do things, but the actual result of that work is very abstract.
- We could organize ourselves and our labor differently; We could make things for ourselves, or for our group, but this wouldn't necessarily make them "better" -- and in some ways, would almost certainly make them less "accessible".
- The unfortunate reality is that 'growth' is one of the only things that's incentivized, so our systems must become larger and larger, encompassing more and more functions and factors.
- We tell ourselves the lie that this growth is good, that it makes things better, than we can purge ourselves of impurity and automate away all the pain.
- The endless pursuit of perfection elides a cold truth -- we have built systems so large and unwieldly and horrifying that we have to tell ourselves we can make them perfect with more computers, more tools, more processes, more everything.

This has turned into a bit of a treatise, I suppose. I'm not sure how to make it anything but -- if you want boring writing, go find something I write about observability or programming or whatever. Really, I don't want to overly propose solutions because I'm not sure there's any that aren't trite, and I hate trite.

Really, what I want to emphasize that it's important to think about stuff like this. Think about your work, think about what you contribute to. There's one thing I know for sure, and it's that giving up isn't really an option, even if it's easy. Be a part of what matters to you, form communities there, and strive to be intentional in your words and deeds. Don't settle for "that's how it's always been done" both personally and professionally. The world exists in the way it does because that's where we've put it; The world can change, if we so will it and put in the work.
