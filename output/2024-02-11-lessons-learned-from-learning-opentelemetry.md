---
title: "Lessons Learned from Learning OpenTelemetry"
date: "2024-02-11"
categories: 
  - "newsletter"
  - "opentelemetry"
---

![](images/Stable-Diffusion.png)

I'm knee-deep in production for _[Learning OpenTelemetry](https://learningopentelemetry.com)_, releasing in just over a month. This is my second book, so I figured it was a good time to sit down and write up a couple of things I learned while writing this one, if only so when the writing bug gets me again in a year or so I can look back at this post and ask myself if it was really worth it.

Mostly joking, but writing is hard! There's a real balance you need to strike, especially when doing technical-but-not-documentation content.

<!--more-->

## The First Stage Of Writing A Book Is Denial

After _Distributed Tracing in Practice_, I was pretty sure I didn't want to write another book. That project wound up being an absolute pain for a couple of reasons. One, it was my first book and I had absolutely no clue what I was doing. My assumption going in is that a book was pretty much like a really long paper, or thesis, or some other form of long-form writing. I figured that my skills there would translate pretty naturally. What I realized over the course of several years is that the most valuable skill in writing is actually project management. Sure, I could sit down and crank out a bunch of words, but the words are honestly the smallest part of writing. I had four co-authors on _Distributed Tracing_, and ensuring that all of our work fit together into a cohesive whole was extremely challenging -- especially given my co-authors busy schedules! There's a lot of reading, re-reading, and small edits that need to happen to make sure that things flow naturally from one section to the next, that concepts are built up gradually over time, and that readers don't get lost in the weeds as authors change.

The second big challenge was overcoming my own nerves, to be honest. I had never taken on a project of this size and scope, and I was easily the least experienced and well-known person on the book. While my co-authors had, between them, decades of academic and real-world experience in the field of distributed tracing, I was a relative newcomer. To say I had a bit of imposter syndrome would be understating things slightly.

With those two points in mind, it shouldn't be a surprise that the schedule for _Distributed Tracing_ slipped as much as it did. However, we powered through and got everything wrapped up at the beginning of 2020, just in time for... a global pandemic. Can't predict everything, I suppose. Truthfully, this was a pretty big gut punch to any hope I had of the title being really commercially successful (even though I wasn't standing to make a dime off the book anyway; We had decided to donate all royalties to charity) as everyone suddenly had greater priorities.

There were a million little things that I learned along the way as well -- the importance of spending more time on figures and illustrations earlier in the process, writing sections and subsections as composable chunks, being more aggressive in editing to reduce needless repetition, striking the right balance between verbosity and terseness -- but in the immediate aftermath of writing my first book, the only thing I could say to myself was "not gonna do _that_ again!"

## Doing That Again

Aside from being able to tell people "I've written books, _you know_," there's not a lot of great reasons to get into writing. The money isn't great unless you're very _very_ good, it's rather time consuming, and just because you write something down doesn't mean anyone is gonna read it. That said, it does scratch a certain itch. Someone told me once the best reason to write a book is because you're tired of explaining the same thing over and over again, but I'd put some nuance on that statement. The best reason to write a book is because you want to _remember_ why you're explaining something over and over again.

I'd like to think that this is a pretty common pattern for any non-fiction author. Writing requires you to think about something that you probably know a lot about from a lot of different angles, in a really thorough way. It's not enough to just regurgitate the facts as you understand them, you're creating a point-in-time record of _what_ you think, _how_ you think about it, and _why_ your thoughts matter. Nothing is really ever frozen in time, even history, right? The perspectives we use to reflect upon historical events are just as important to understanding those events as the factual record is. Books exist to _analyze_ a topic as much as they exist as a way to learn facts.

Technical books aren't immune to this tendency. _Learning OpenTelemetry_ exists not just to help people, well, learn OpenTelemetry, but as a way to stitch together years of history and trends into an overarching narrative about how and why OpenTelemetry works the way it does. This is important because that knowledge and analysis is becoming harder and harder to find, especially for new contributors to the project. If you haven't been around since the beginning, it's increasingly hard to grok why things work the way they do, or what our motivations are for certain decisions.

So, why'd I decide to write another book? Mostly to scratch this particular itch. There's a gap in the record around OpenTelemetry today. We've got ok-to-decent user documentation, and fairly exhaustive developer documentation, and a completely public historical record of every decision we've made... but it's scattered and disjointed. It's unreasonable to ask people to comb through five years of GitHub history to understand decisions, especially if they're volunteering their time!

The other major motivation is that OpenTelemetry is pretty opaque to a lot of developers and other people outside the 'observability community'. I think this is a problem, especially as we look to make OpenTelemetry ubiquitous for developers. If it's truly gonna be a built-in part of software, then it needs to be accessible to the people writing software, which means we need to explain our motivations and why they matter. I wanted an opportunity to tell people not just what the project does, but why what it does matters.

## Advice To Future Me

In no particular order, here's some of the things that I think went much better this time.

- **Don't be precious about the outline**.  
    I feel like we overfit the chapters to the outline presented to the publisher in _Distributed Tracing_. Some of this is due to my lack of confidence, some of it was not having a great feel for what mattered and didn't matter to readers. In _Learning OpenTelemetry_, we quickly pivoted away from 'stuff that didn't make sense' when drafting chapters and even re-wrote large parts of the book to avoid needless repetition. I think the overall product is much stronger for it!

- **Code is great, but use it sparingly.**  
    The best argument might be running code, but the amount of effort that needs to go into explaining it is often mismatched. It's tempting to plop a function on the page and then dive into it, line-by-line, but it's usually better to focus on the primitives and concepts that the code is eliding. Especially in the case of OpenTelemetry, where there's still parts of the project in-flight, we focused on things that are unlikely to change and only dip down into walking you through code when it's critical to make a point or build understanding.

- **A picture really is worth a thousand words**.  
    One of the things I feel like I've really come to appreciate is the value of an effective figure or illustration. I spent more time considering the value of the figures I was drawing, rather than just seeing them as a way to fill up the page. Figures can pack a lot of useful information in a pretty compact way, especially with anything that needs to be reasoned about spatially, and they make a huge difference in helping readers understand the impact of what you're writing about.

- **You don't know how much you have left to do until you're halfway done.**  
    When working with a co-author especially, you need to reserve time at the end of the writing process to stitch the parts together into a cohesive whole, but it's hard to know how much time you'll need until you've done a bunch of the initial work. We had nearly 75% of the book completed before deciding that major revisions were needed in order to take the best parts of each of our chapters and align them. I think, even if you're a solo author, you should still consider taking time at the end to perform this alignment step and not do it in the middle of the writing process.

- **You'll miss dates; Don't beat yourself up over it.**  
    We missed so many deadlines (although less than with _Distributed Tracing_) due to any number of factors. Life gets in the way. With _Learning OpenTelemetry_, we easily lost six months to a variety of unexpected factors such as job changes, illnesses in the family, emergency travel, and so forth. Open communication with your editor is key -- it's usually not a huge deal to miss deadlines _as long as people can plan around it_.

- **Pre-writing is 80% of writing.**  
    My english and composition teachers would probably be smirking to hear me admit it, but one of the most valuable takeaways I have now is that it's totally OK to throw things away. Honestly, between drafts and research notes and async conversations, there's probably half again as much writing that went into the book that got deleted or wasn't included.

- **The hardest part of writing is the conclusion.**  
    This is something I'm just not good at yet, I think! It seems like it should be easy, just restate your conclusions and set people up for the next chapter or section, but I feel like I can dial this in a lot better. I think it's probably worse on my blogs than in the book, but I also feel like it's less of an issue in a blog post where you can just scroll back up easily?

If I had to summarize it, I feel like the biggest lesson I've learned between this book and the last one is around confidence. I'm more confident as a writer, I couch what I say less, and I'm more direct and prescriptive where I need to be. Rather than qualifying everything, I'm better at pointing out the happy path and giving pointers on where my advice might not be applicable. I've become more authoritative, in short. While some of this is certainly due to spending more time with the subject over the past several years, a lot of it is just becoming more confident as a person.

I think this is most apparent in my own reaction to the book being done. After _Distributed Tracing_, I felt a deep sense of relief. It felt like a weight off my shoulders. Now, I'm energized by wrapping up this project, and with an eye towards what the next one will be. I'd like to keep writing about observability, so we'll see where the industry goes and what sort of things I spend the next year or two explaining to folks.

All that said, I'd like to wrap this up by asking for a [pre-order of _Learning OpenTelemetry_](https://learningopentelemetry.com). It really would mean a lot, and pre-orders and sales in general make it possible for me to continue writing independently of my employer. This book is really written for everyone whose job involves software, not just operations or IT professionals. If you're writing, running, or building a business around software -- especially cloud-native software -- then this is a book for you. You'll learn about the next generation of observability frameworks from the ground-up in a holistic manner, not just what it is or how it works, but why it's built the way it is, and the kind of problems it's solving today and the kinds of problems it can solve in the future. I think you'll love it.
