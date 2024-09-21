---
title: "Deploying on Friday the 13th"
date: "2023-10-30"
categories: 
  - "newsletter"
---

![](images/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd49e148f-7451-465e-b370-b4f6f19589fe_1024x1024.png)

“I wasn’t trained to do that.”

I looked at the significantly more senior engineer sitting across from me in the white-and-startup-blue offices of a former job. Scarcely three years out of college, but with a decade of IT experience under my belt, I dug deep, searching for the endless well of patience that I previously administered to passionate but confused administrative assistants panicking about the location of a Powerpoint file. “Come again?” was the best I could muster.

This was the big leagues, right? I was a Software Engineer now, and I did DevOps, and I was leading a Cloud Transformation – this is what we’re supposed to be doing! Here I was, being yanked back down to earth by a man with over twenty years of professional development experience, balking at learning how YAML worked because… “I wasn’t trained to do that.” In the moment, I demurred, gently guiding him back to the repository of Powershell scripts my team had built to aid in the new workflows we were pushing.

The statement haunted me, though, and it does to this day. I had labored under the impression that developers and engineers were a cut above; The new philosophers of our information age, capable of making these hunks of silicon and glass sing using their minds. The notion that one of them would balk from something like… well, a different configuration file format, in this case, was almost unthinkable. It stuck in the recesses of my mind, like a stray popcorn kernel.

While I can’t admit to knowing exactly what was going on in his mind that day, over time I believe that I’ve identified a ground truth about most people in software, and most teams; It is that, deep down, we are _afraid_.

<!--more-->

## Sinners in the hands of an angry kernel

Technology is fundamentally kinda scary. If you don’t know what it’s doing, then its outcomes are a quite literal _deus ex machina_; God from the machine. The only thing worse than ignorance, however, is knowledge. You may not be obsessed with the exact technical details of how I’m writing this blog post, but if you went back in time thirty years and told me that one day I’d be writing a blog post into a laptop that weighed five pounds, into an application that wasn’t actually running on my computer, and each keystroke was being transmitted to a server god knows where in the world to be saved _instantly_, I’d have probably assumed you were way too into Star Trek. It is amazing, though, if you think about it! The lived experience of Moore’s Law is far more mind-blowing (yet banal) than the mind wonders.

While I know how this works, I do not know how it _works._ I’m aware of the individual parts and components, the various systems that are working in concert, but I don’t really _know_. I can’t see each bit, and really, I don’t know if I’d even want to.

It is, in a word, scary. It’s terrifying, in the way that a biblically accurate angel might be – daily, we accomplish things that were literal science fiction decades ago. We stand in awe of the chariot of Helios, unable to escape the very real terror that without him, all would be lost.

Thus I return to my quandary – “I wasn’t trained to do this.” It is not indolence, or ignorance, that drives this statement, but fear. How can you be expected to learn to face your fears when there’s no pause in your work? Your tickets won’t wait for you, your manager won’t get off your ass, and in this case some upstart is telling you about how great YAML and the Cloud is and you don’t quite see what the _benefit_ is to _you_. How can you embrace change that you don’t understand, that you aren’t given the space to understand, and you don’t have the luxury of time to comprehend?

## Understanding through observation

We fear what we do not know, what we cannot perceive. Masters of horror cinema understand this, building tension by limiting what the audience sees in full light, layering soundscapes in such a way to play with your perception of the scene, and disorienting you with rapid cuts between angles. A slasher film shot in flat lighting in a single, unmoving frame would be much less unsettling – you would be able to see everything that’s going on.

Being able to see what’s happening is only half of understanding, though. It is necessary, but not sufficient. Understanding requires context, and the ability to ask questions. It requires learning, and an active pursuit of _meaning_.

Bear with me, because I’m still going somewhere with all this. Let’s step back for a second and ask an important question, one that I should have asked myself originally when I took on this project all those years ago. What is it that we’re trying to accomplish here, exactly?

To set the scene, our product had been plagued by what could only be described as ‘cruft’. An on-premises enterprise PaaS product tends to accumulate a bunch of band-aids over time, little one-off features that only one customer used (but was absolutely essential for their use case), and a growing number of them. The challenge this model presented is that these features were all, for the most part, somewhat mutually exclusive. Testing one permutation meant disregarding others. In order to test _enough_ things on a daily cadence to ensure that we weren’t completely breaking _something_, a complex series of integration tests had been created. These integration tests ran on servers that were pets – specifically configured to match the deployment environments we expected, and not even imaged; Just restored to ‘known good’ through scripts. Unfortunately, this was not a terribly scalable solution, nor a terribly reliable one. In the year and a half I had been there, I spent many a sleepless night trying to un-stick stuck restoration scripts, diagnose faulty deployments, and desperately try to catalog what _exactly_ made these servers so special in order to document _anything_.

The public cloud seemed like the perfect solution to this problem, to be honest. On-demand infrastructure, configuration as code, reproducible and infinitely scalable hosts? Finally, no more manual janitoring of integration test runs over the weekend in order to get a release out – heck, developers could just request an environment and spin it up in order to reproduce errors and bug reports discovered in specific configuration permutations! Dreams of getting my evenings and weekends back dancing in my head, I set forth, building out a proof of concept. Management, unsurprisingly, loved it. My slides claiming ‘improved developer productivity’ and ‘faster releases’ were just what they wanted to hear, and the project was greenlit with nary a second thought.

Observant readers may start playing the scary music in their head right about now, as there were _multiple_ red flags about this project, but we’ll get to those later.

## Rising action, falling behind

In almost every horror movie I can think of, knowledge is the most important currency. Knowing that a survivor was bitten by the zombies, knowing that going into the basement alone is a bad idea, knowing the weakness of the serial murderer hot on your trails – these make the difference between living to see the credits, or an untimely demise.

If only our professional lives were so candid, so easy to interrogate! Alas, if there is an audience to the travails of my life, I remain blissfully unaware of them. It is only through hindsight that we gain the sort of voyeuristic knowledge that the audience receives; We must avail ourselves of wisdom during the moment. With that in mind, what went wrong with my project?

In many ways, very little – it was a success, in the sense that the initial objectives were achieved. We automated the creation and provisioning of test environments in the cloud, and dramatically increased the speed and reliability of our integration testing. Rather than spending long weekends attending to the finicky manual test environments, developers could spin up arbitrary test clusters on-demand.

However, _we didn’t release faster_, and _developers didn’t get more productive_.

In fact, development speed went _down_ slightly! Why?

There’s three reasons, clear in retrospect –

1. There were a lot of undocumented workflows that more or less relied on the ‘pet-like’ nature of the test environments. In a proactive cost-saving measure, the new test environments were truly ephemeral; If there were failures, everything outside of the immediate output would be deleted. Turns out since nobody ever planned for logging in an environment where things got deleted on failure _or_ success, teams would lose access to anything but extremely granular pass/fail metrics about tests – forcing a re-run of a suite, which _might_ pop the error again, assuming it wasn’t a transient one…
2. The team hadn’t been adequately prepared for ‘the cloud’ in any way, shape, or form. Conventions that made sense to the DevOps team were unfamiliar to the more senior engineers, who had been working on more-or-less the same stack for ten years at that point. A lot of time was spent trying to fit square pegs into round holes in order to fit the new cloud workflows into existing, non-cloud workflows as a _replacement_ rather than an _addition_. The semantics were just too different, though, and developers had a hard time adapting when what they expected and what they got didn’t match up.
3. We didn’t do a lot of research or fact-finding with what wound up being the key stakeholders; Namely, the developers themselves. Our bet at the time was that they wouldn’t really care, and that they didn’t like the status quo either – we needed to convince “”the business”” to make the OpEx spend. For the reasons above, this turned out to be a miscalculation, as developers were far more involved in the actual use of test environments than “the process” would otherwise indicate.

There were many smaller cuts, of course; Poor attitudes, resistance to change, apathy, you name it. Some might argue that the _actual_ problem here was that we needed such a convoluted system at all, and that sufficient amounts of quality unit tests would fix most of the problems at build time. Indeed, when I started we had single-digit percentages of unit test coverage; Adding more sure as hell couldn’t _hurt_.

## Seeing the light

I learned a lot from this experience, as you may be able to tell. However, most of my learning didn’t come immediately. Like I said earlier, this anecdote stuck in my craw, and I puzzled over it for a while. I got stuck on, well, the lack of imagination? The inflexibility, the inability to adapt, the apparent lack of interest in what, to me, what a cool new thing.

It’s that latter revelation that led me to my realization – this isn’t the exception, it’s the rule. There’s a vanishingly small number of people whose jobs involve the word “software developer” that actually really _care_ about any of this. Most people want to get in, do their job, and go home.

That’s fine! Like, honestly, that’s good. We should all aspire to a job that we can walk away from at the end of the day. If you want to do more than that, OK, great – but when we talk about topics like _observability_ and _accessibility_ then we should keep in mind that most people don’t really care about the details, and they just want answers to their questions. They don’t want to be the friend that walks into the basement, they want to be the audience. They know that knowledge will terrify them, so they don’t dive all the way in – they want curated, opinionated, and responsive insights. If anyone in the industry wonders why New Relic still exists, it’s because in large part they nail that specific workflow. Datadog covers the other half; They present a bunch of information, more than you can reasonably be expected to understand or comprehend, and tell you to figure it out. Both are ways you can do things, I don’t think either is that great.

If you’ve read this far hoping for one easy trick that solves these problems, that lets you jump out of the screen and into the theater to watch your system as a dispassionate observer, I don’t have one. This shit’s a journey, not a destination. That said, I do have some takeways on how you should conceptualize observability, especially as you are thinking about new systems or migrations.

### The best way to understand is to know

Don’t rely on other people to just explain things to you, or on pre-published dashboards. You really want to understand something new, instrument it – see what it does in production.

### Don’t neglect the people

If you’re building a new system, or rolling out a new internal tool, your first step should be the actual users of the existing system. Document _everything._ Do it twice. There’s a lot of implicit workflows you may have missed the first time. If you can help it, don’t replace; Do a gradual cut-over, or run both old and new simultaneously with links connecting them.

### Change is always scary; Bring a flashlight

Even in a highly effective team, people are going to resist change. It might be subconscious, it might be deliberate, but someone coming in to push the new exciting whatever is almost _always_ going to get some level of pushback. This is one reason that a strong observability practice is so fundamental to every organization, because the more you can see and understand what’s going on in your system, the more comfortable you can be with change of _any_ sort.

## In summary

At the end of the seminal zombie film “Night of the Living Dead”, the main character has survived the night. He looks out the window to see help arrive.

I won’t spoil it, but I will say that it’s a shocking ending.

More often than not, we avoid shocking endings in our professional lives. Projects tend to wither, rather than explode. The debt piles up, though, and it eventually comes due. I don’t think it necessarily has to be this way, though. We expect that we’re going to solve our problems forever and ever, and we tend to build with that in mind – end-to-end solutions, with very specific and narrow goals, rather than a holistic understanding of our system and what influences it, as well as what it influences.

I believe this is somewhat of a backwards methodology. Our goal, especially when it comes to observability, should be to _describe our intent_ through telemetry, then _use observability to build confidence_ in reality. If we can accomplish this task, then we can remove the fear, the uncertainty, and the hesitation that comes from being a character in the movie, and even start to shift the genre from horror to something more pleasant, less scary, and less tense.
