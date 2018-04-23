---
title: "The Cloud Is A Dumpster Fire, And That's OK"
date: 2018-04-20T22:34:22-04:00
anchor: "The Cloud Is A Dumpster Fire, And That's OK"
type: "post"
---

![image](/images/dumpsterfire.gif)

I spent the past couple of days trying to get the Azure Golang SDK and Slack to talk to each other. I'll be writing a couple of posts about it; This is the first!

# A Brief Treatise On Bad Documentation

First off, this post is approximately 90% due to the fact that I couldn't find a lot of good, usable examples of the Azure Golang SDK that didn't involve creating new resources. While I do love to create _new_ stuff in Azure, most of the time I really need to get something _out_ of Azure. The omission of useful examples of reading and printing out information about running VM's is rather strange to me.

Permit me to harp on that last point for a moment.

Searching for 'azure sdk golang get vm info' on Google gets me a variety of presumably helpful results! The first one is [Azure-Samples/virtual-machines-go-manage](https://github.com/Azure-Samples/virtual-machines-go-manage), that seems useful. That redirects me to a different repository, OK, sure. Follow that link, check out `compute.go`, and I get [this](https://github.com/Azure-Samples/azure-sdk-for-go-samples/blob/master/compute/compute.go).

Whole lot here on how to create a VM, start/stop/restart a VM, detach disks from a VM... not much on how to actually get information about all of my VM's, or really anything that might help me if I didn't already know the name of the VM I wanted to get information for.

Further searching is additionally fruitless, although if you're reading this and your google-fu is stronger than mine, I welcome you to tweet at me and tell me that I'm very bad at the internet.

With that in mind, I present the following Open Letter to Microsoft.

> Dear Microsoft:
> Please endeavour to include useful examples on how to retrieve information from your cloud platform rather than simply information how to create new resources.

## Cloud Meteorology

So, what problem am I trying to solve?

Not everyone is using the cloud in the same way. It's certainly the case that [developers love the cloud](https://insights.stackoverflow.com/survey/2018/#most-loved-dreaded-and-wanted), and Serverless is making some huge inroads. We're seeing more and more greenfield development in the cloud. I think the cloud is pretty great! But it's not necessarily the case that we're simply tossing everything we've got in the trash in order to architect new, pristine systems on Azure or AWS. Oftentimes the cost of rearchitecting existing systems to function in a cloud native way is too high. Often overlooked is the _mental_ cost of cloud native rearchitecture; Depending on your particular use case or environment, it may be a non-starter to not start out simply extending existing systems into on-demand compute or storage.

So, let's model this out a bit. Presume you've got some staging and QA environments. Maybe they have clever names, although that part isn't a requirement. Traditionally, these environments would be cared for through some combination of manual computer janitoring and a collection of scripts that no one quite remembers much about. When they're needed, they're needed during business hours (or perhaps overnight, for automated tests) but they're not needed every single day. They get repurposed frequently as new versions of the software are developed. Frankly, it's kind of a mess but no one really has the time to do anything about it, because for the most part everything _just works..._

And that's fine, until it doesn't work. Things are getting dropped because you're out of capacity. Intermittent bugs crop up on environments that don't reproduce everywhere, things work fine in staging that break in prod, etc. You need to scale, but you can't, because everything takes too long to test, because there's not enough resources to really do anything about it, etc. etc.

So, what do you do?

## Next time...

We know our problem, but how to solve it? Next time, I'll talk about some solutions and tradeoffs for extending these architectures into the cloud, and demonstrate some reporting methods I developed for communicating the status of cloud resources back into Slack.
