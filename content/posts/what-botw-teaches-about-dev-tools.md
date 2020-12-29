---
title: "Everything Breaks: Dev Tools and Breath of the Wild"
date: 2020-12-28T09:00:00-04:00
anchor: "Everything Breaks: Dev Tools and Breath of the Wild"
type: "post"
---

The Legend of Zelda: Breath of the Wild is Nintendo's most recent main-line game in the long-running Legend of Zelda series, launched on the Nintendo Entertainment System in 1986. To say that it's a departure from the norm for the series is somewhat of an understatement -- in lieu of a crafted series of puzzle dungeons that require specific tools, techniques, and resources presented in a fairly linear fashion, it instead offers an open world after a short introductory section, allowing for massive amounts of freedom and flexibility in exactly how players choose to engage with the game. As you may expect, this has lead to several unintended side-effects.

{{< tweet 1296950875907399681 >}}

<!--more-->

Breath of the Wild (BotW) isn't the first open-world action-adventure game, and nor is it necessarily the first to offer the amount of intended or unintended flexibility presented due to its design. The glitches and physics interactions that speed runners use to quickly beat the game aren't an inherent aspect of the game design, after all -- but they're also rather similar to the sort of organic interactions between tools that players can encounter through normal gameplay.

{{< tweet 1337534258622177280 >}}

Now, before I lose you, what does any of this have to do with developer tools? Heck, what am I even talking about when I talk about 'developer tools'? In general, I'm speaking of the vast landscape of tooling and services that exist to support a software development lifecycle -- everything from the IDE you use to write code, to the servers and scripts that build and deploy that code, the cloud services that the code runs on, the myriad utilities and services that help you observe the performance of that code, and even the hundreds of various programs and services that support the organizational process of writing code like task managers and communication applications. To be reductive and tautological, a developer tool is a tool a developer uses that isn't their own brain. With that in mind, I think there's a lot that the people who build, use, and operate these tools can learn from BotW -- and that these lessons form a useful rubric and intellectual model for evaluating tools and our decisions around them.

## The Breadth of the Wild

For those who aren't terribly familiar, let me give you a brief overview of the tools that Link (that's the guy you control in BotW) has at his disposal, and their purpose. At the beginning of his adventure, Link receives a Sheikah Slate, which is a sort of fantasy iPad. The slate gains four main abilities in short order -- **Magnesis**, **Cryonis**, **Stasis**, and **Bomb**. Magnesis allows for the manipulation of metallic objects, Cryonis can create and destroy pillars of ice from a water source, Stasis can briefly stop the flow of time for a specific physical object, and Bomb is... well, it's a bomb. They can't all have clever names. In addition to these special abilities, Link is able to find and equip a variety of weapons and armor scattered throughout the land which he can employ to defeat enemies -- everything from a sturdy branch to a finely-wrought halberd. Indeed, one of the more unique characteristics of BotW is this; In prior entries to the series, Link's weapons were fairly limited. In BotW, Link can amass an impressive arsenal of blades, boomerangs, axes, clubs, bows, shields, and more.

![Link's weapon inventory, maxed out](/images/botw-inventory.jpg)

There's a rationale for why you would need to carry hundreds of swords in Link's inventory, however. Weapons and shields will degrade over time, until eventually breaking.

{{< tweet 1335260257476628483 >}}

The equipment degradation is one of the more interesting features, because it's such a drastic departure from prior entries into the series. Even the Master Sword can "break" (it has an energy gauge that, when depleted, makes the sword useless for a period of time), along with various other legendary or difficult-to-acquire weapons. I, personally, hate this feature, but I think it's critical to the actual gameplay loop; You see, BotW is less of an adventure game, and more of a resource management game.

![Link climbing a column](/images/botw-climbing.jpg)

Link has two main forms of 'energy' -- health, and stamina. Health is kinda what it sounds like; if you lose it all, then it's Game Over. You lose health by getting hit by enemies, falling from a great height, getting set on fire, things like that. Stamina (the green ring in the above screenshot) is expended by climbing, running quickly, or flying on a glider. You can increase these resource pools -- for example, one activity in the open world involves discovering Shrines, which are small puzzle or combat dungeons, and using the currency found by completing them to increase either your health or stamina -- or temporarily modify them by engaging with the cooking system, granting short-term buffs to health or stamina by cooking dishes using ingredients discovered in the world. Link's weapons, then, are another resource pool that must be managed. You can't ignore it or work around it -- after all, even the Best Sword in the Game 'breaks' -- and you can't win without using some sort of weapon. Thus, the basic gameplay loop emerges. Link is presented with an open world of varied tasks which can be accomplished in pretty much any order by careful and clever usage of the tools he has at his disposal, while simultaneously managing the resources of health, stamina, and durability.

It's important to note that this is, as they say, "it". You can put literally hundreds of hours into BotW (and if you want to complete every single thing in the game, you may have to) but you will never gain any new abilities beyond those that are offered within the first hour or so of play. There's no "win button". You'll never find a shield that's unbreakable, or a sword that will last forever. Everything degrades, everything eventually fails. What's important as a player is your ability to manage these resources and systems and ensure that _when_ they fail, they do so in a graceful and recoverable way.

## Epona, Legos, and Pathos

The 'play' aspect of BotW comes from putting the tools at your disposal together in unique, creative, and fun ways to overcome the moment-to-moment challenges of managing your resource pools. I like to think of them as Legos -- like the bricks you build with -- because that's really what they are. You don't have a lot, but you can combine them in interesting ways in order to accomplish things that you otherwise wouldn't be able to. One example is traversal; rather than riding a horse from one place to the other, what if you used the properties of the Stasis ability in order to 'surf' on a log?

{{< youtube bgRCJt8JBhs >}}

Magnesis is capable of manipulating metallic objects; What if you used it to grab a metallic boomerang, then simply wave it towards a monster?

{{< tweet 1340702002318356481 >}}

What if you just launched yourself off a bomb explosion in order to perform an absolutely sick nasty trick shot?

{{< tweet 1323265882181627904 >}}

Now, are these tricks _required_ to beat the game? No, not at all. They're generally used in order to perform outstanding feats, such as beating the game in under half an hour. The following video is the current world record, beating the game in 26 minutes and 27 seconds.

{{< youtube m3d8mHKmW2w >}}

I don't necessarily think that the tricks and techniques used in these speedruns were necessarily a design goal of the developers -- but I do believe that they speak to the quality and simplicity of the way the game was designed and built. Affordances were created to allow for someone to immediately try and beat the final boss, so it's not like you can argue that it wasn't something that's _intended_. 

In a more direct sense, what the developers have done is create a repeatable task (managing limited resources) and offered a defined set of tools to accomplish that task, all placed inside a 'closed' system. Players are limited by the constraints of their resources and must then use the tools at their disposal to accomplish the ultimate goal, beating the game. This may seem somewhat reductive -- after all, isn't that what literally every video game is? You'd be right in spirit, but it's the nature of the tools and how they work together in BotW that make it a unique game. The ability to combine tools inside the bounds of the rules make it incredibly powerful; since there's a fairly limited amount of tools, the interactions between them are simpler to model, and thus they work "like you'd expect" in most places. By not burdening the gameplay design with a wide variety of complex tools, the interactions between the simpler ones become more delightful while allowing for more flexibility given the constraints. Let me illustrate this a bit more explicitly by comparing two traversal tools from the Zelda series.

* Hookshot. A mainstay of the series (until BotW), the hookshot both in 2D and 3D games has been used as a weapon and as a mechanism to traverse the environment. You point the hookshot at a designated point, fire it, and it'll drag Link to wherever it was shot. That said, there are limitations -- you have to shoot the hookshot at a specific item or object that _can_ be grappled to, otherwise it will bounce off ineffectually. It's absolutely a critical piece of the toolkit, you can't beat the game without it.
* Glider. The glider is an item in BotW that you can pull out in midair to slow your descent and begin to glide. The only limitation on the glider is that you need to have stamina to use it -- and, obviously, some height. Link _is_ heavier than air, after all.

The hookshot is a 'complex' tool, the glider is a 'primitive' tool. There are many restrictions on the hookshot -- both in how you can use it, and where you can use it. The glider has many fewer restrictions, but its utility varies; you can use it any time for the most part, but it only does you good in certain circumstances. The hookshot seems more useful, yeah? Well, it depends. Remember, the world of BotW involves a set of rules -- and those rules can be used by the player. A campfire or burning grass will create updrafts, allowing Link to gain height even while starting from the ground. Just take some flint, strike it with a sword to create sparks, and create a brushfire that will propel you to new heights! 

## Everything Degrades

Now, if you've ever tried to write or run software, some of this might start to feel a bit familiar to you.
What is software development if not a repeatable task with a set of defined tools inside of a closed system? Let's explore this a bit. What are the resources we're concerned with when developing software as a team?

* Time. On some level, time is the only resource that really matters. We want more, but never seem to have enough.
* People. We can't make more hours in a day, but we can add more hands to the clock.
* Cost. Things, unfortunately, cost money.

Writing software is, ultimately, an exercise in managing these three resources. There's a lot of details and a rather large and colorful cast of devils living in them, but it's often useful to think about things in the big picture when you're looking at the tools that you're using while writing that software, so we'll elide them for the purposes of this piece. Let's dive a little deeper into these resources and think about the sort of tools that we use to help manage them.

### Time, Ocarina of.

If you had to pick one of these resources to be your 'health', I think it'd be time. Some people might say "Well, wait, isn't cost the most important factor?" Money is fungible, but time is inorexable. Most of your tools are primarily interested in managing this resource, either by improving processes, reducing busywork, streamlining communications, or automating tasks in order to parallelize effort. When it comes to delivering software projects, time is often the deciding factor for what gets cut and what gets kept. It's also a fairly universal resource -- everyone is on the same clock as you are, so being slower than your competition just puts you closer to the proverbial bear.

### Humans of Hyrule

People are a resource, loathe as I am to refer to them as such. Despite the dear wishes of management, individuals aren't simply robots that can be programmed with a list of tasks and set upon a problem. They have needs, desires, wants, hopes, dreams, attitudes, and opinions that may or may not align with the goals of the organization or team. In the context of developer tools, people are almost (but not quite) a proxy for 'productivity', and the tooling available seeks to improve this. The practices of DevOps, SRE, observability, chaos engineering, reliability engineering, these are all effectively toolsets designed to support the humans developing software by granting them greater ability to understand the system they're working on and supporting.

### Rupees Rule Everything Around Me

You can't add more hours to the day, but you can add more people to a team, and you can buy tools to improve the productivity of that team, and you can pay contractors to work on point solutions to thorny problems. Cost is the most fungible resource, as it can be converted (at a loss) to time _or_ people. All tools, then, cost _something_ -- a monthly invoice or credit card payment at a minimum, usually there's a lot of associated cultural and productivity costs as well to integrate new tooling into your environment and workflows. There are also fixed costs beyond any of this, the costs of the underlying computing infrastructure needed to operate software, and these costs can be mitigated by... well, buying other things. Really, most forms of optimization engineering practice or tools to support it are directly attached to the idea of managing costs.

## Hookshots vs. Gliders

So, we've got our resources, now what's our world? This, unfortunately, is a question I can't answer for you. While we all have the same basic constraints and plates to spin, each team and organization is different enough that no two people are going to have the exact same answer about the best set of tools for _their_ situation. This is one of the things that developer marketing often gets wrong, I feel -- we're too invested in telling people to use _our_ stuff without actually understanding their pain points. I don't mean pain points in the grandiose technical sense, I mean pain points in the extremely personal, relatable sense. You may care a lot about diagnosing slow SQL queries, but it's probably not for the sake of the SQL queries -- it's because you want to play more WoW or spend more time with your family or post on HN more or something. Time is also a resource to you, too, and you'd rather spend more of it on _your_ stuff rather than your _job's_ stuff. You're also struggling under a world that's been built over potentially decades, the world of institutional knowledge, legacy software, code rot, and more. The real world, unfortunately, often lacks the neat and tidy interactions of a crafted system designed for play.

With this in mind, how do we classify tools for an unstable world? 2020 alone should indicate that relying on "the way things have always been" is a foolish and shortsighted strategy. I believe the real takeaway that BotW gives us is in the aforementioned dichotomy of hookshots, and gliders.

Many, many tools are hookshots. They're extremely powerful, but extremely narrow in scope. They're the sort of tools we're intuitively attracted to, because they look like scalpels, capable of excising specific problems from the body of our organization. They promise to do everything we need for that specific task, but their utility can be stymied when circumstances change. The biggest identifier of a hookshot is if the hookshot asks you to make sweeping changes in order to accommodate it. Perhaps you've discovered a brilliant new CI tool that promises a 10x reduction in unit test execution time, _but_ it only works with a specific framework, or if your tests are in a certain format. Consider an observability tool that offers extremely powerful analysis features, but requires you to purchase a full suite of products from a certain vendor and rely on a proprietary agent. Kubernetes is a more expansive example of this; it solves a lot of problems, but it often requires you to have, for lack of a better term, a "kubernetes-shaped system" to slot into it.

Gliders are more rare. A glider is often less powerful, and apparently less useful, than a hookshot. The power of gliders is in how they interact and combine with other tools. There's been a bit of a surge in popularity of tools that fit this model over the past several years -- consider the popularity of `make` in 2020 -- but other examples exist. The bash shell and GNU shell utilities are a prime example of this -- individually, awk and sed and grep are useful but limited. Combined, they can perform amazing feats (if you learn how to use them!) that are the equal of many more advanced or modern pieces of software. For most people, most of the time, the ability to perform a SQL query across reams of telemetry data would be more valuable than many of the advanced automated workflows that present themselves in modern observability tooling.

Now, it's important to note, I'm not actually saying _one of these is better than the other_. Far from it -- both have their purposes and roles to play, because the quality of a tool _must_ be evaluated against the resources that you're managing. If you have a few, highly-skilled, people, then it's reasonable that you may wish to provide maximum flexibility by relying on simpler tools, joined together. This strategy probably won't work so well for hundreds or thousands working on the same codebase, though. You need to understand the world you're in, otherwise you're going to go down the wrong path.

## Defeating Ganon With Good Vibes

![The Cloud Native Landscape](/images/botw-landscape.png)

The above image is the (infamous, at this point) Cloud Native Landscape. It's a collection of thousands of projects and companies that offer various tools to help you build modern, cloud-native software. Some of these tools could be characterized as hookshots, other gliders. It's a daunting task if you're trying to evaluate any of these to understand if they'd work for your specific needs, or if you're trying to build a new tool to fit into this complex ecosystem, so to conclude I'll offer a few tips on how to navigate the world of developer tooling and how to defeat your personal Ganon.

* Understand the rules of your world. Blanket advice is usually wrong (including this advice, so joke's on you for making it this far) about something. You need to understand your environment -- especially the people in your environment -- before you can understand what tools are going to be more effective. Don't blindly follow trends or thought leaders on Twitter, at least not without understanding the caveats and tradeoffs they present. I've seen a fair amount of failed internal 'developer productivity' projects go awry due to a lack of rapport and understanding at the management level. Remember your three constraints -- your management has the same ones, even if they serve a slightly different master.

* Don't fear primitives, but don't eschew complexity. On some level, the best tools are always going to be the simplest ones, because that simplicity implies flexibility. Time, though, remains your constant enemy -- so look for tools that _bridge_ the complexity of interactions between simple tools. If you're building developer tools, this is absolutely critical to understand as well. You can offer a curated experience, but there's always going to be people who demand to control all the buttons and knobs. If you don't want to let people do that, then you need to explain _why_. Avoid magic; If a tool can't explain _why_ it's showing you something, then how can you trust its judgement? APIs and open source standards are the glue that will bind your tools together, so always ensure that you can get your data out and send it elsewhere.

* Don't go it alone. While the landscape of tools can be daunting, they all exist for some reason or another. Most of the time it's because someone solved a problem that's pretty annoying to solve on your own. While you _can_ stitch together a package of open source software running on your own hardware to do things like observability or task tracking or container orchestration, _most_ of the time you're going to be better off by converting cost into something more useful, like time or people. A lot of people know something about Kubernetes, but only a few people know about Jane's collection of shell scripts that are only mildly janky. 

* Everything breaks. Time, people, money, developer tools -- all of these will change, fail, and go to pot at probably the worst time possible. The thing that worked yesterday might not work tomorrow. Build around tools and processes that are resilient rather than brittle, try to avoid human single points of failure. Link might be a solo hero, but Link also can call a magical motorcycle from the ether to ride around on. Do _you_ have a magical motorcycle? Be sure to test your processes that rely on external or managed tools as if those tools _also_ failed. How do you recover? It's generally better to start out by covering your bases here than it is to get blindsided by it.

A special note to anyone reading who's in the tool development or marketing business -- I think we need to get better about connecting the dots for folks on this topic. We speak to "buyers" first and foremost (and why not, they sign the checks) but resilient changes in organizations aren't generally driven top-down, at least not without significant buy-in. Let's talk to the Janes and Annabels of the world, and help them understand how we solve the very human problems involved in developing and running software, then go from there.

In closing, remember -

![It's dangerous to go alone! Take this.](/images/botw-dangerous.png)

