---
title: "The Blockchain Haters Guide To The AT Protocol"
date: "2023-05-01"
categories: 
  - "newsletter"
---

<figure>

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3079595e-27b0-49b0-801f-e96b567c8490_512x512)



</figure>

Like several of the tech twitterati, I've recently been going goblin mode over at Bluesky, a federated social network in private beta. As a long-time crypto and blockchain skeptic, I decided to take a look at the published documentation for the protocol that underpins Bluesky and write some thoughts.

Caveat, before I go into this too much - [the public docs](https://atproto.com/docs) are pretty good, but there's a lot of TBDs and under-defined terms. That said, I applaud the team for what they've been able to put together here -- it's pretty cool.

If I get something wrong, let me know! Would love to correct this or do a followup -- again, this isn't my area of expertise.

<!--more-->

At a high level, AT Protocol (ATP from here on out) defines three important components of a decentralized social network -- a way to manage identity (who you are), a way to store records (what you post, who you follow, etc.), and a way to communicate between clients and servers (how you read posts or make them).

## Identity

There's two parts to 'who you are' that should be familiar to most developers -- there's a handle (such as @austinlparker.bsky.social or @shitposting.vip), based on a domain name, and a user identifier. The user identifier in ATP is a [Decentralized Identifier (DID)](https://www.w3.org/TR/did-core/), which is essentially a cryptographically signed and verifiable GUID. To be somewhat reductive, you can think of it as a modern version of [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) that abstracts away a lot of the pain inherent in managing PKI (or, at least, it makes it someone else's problem).

At a pretty high level, this seems like a rather novel (if involved) system for managing identity on a federated network. It avoids one of the larger frustrations inherent to ActivityPub, which is that identity is scoped to an instance; If my Mastodon instance were to go away, so would my identity on the network. Admittedly, it does seem like there's a bit of handwaving in terms of actual federation here right now -- Bluesky is, as far as I can tell, the only actual host that supports their limited DID implementation. From my reading, I'd intuit that the full DID spec is extremely heavy, and they decided they only needed a handful of fields?

The exact mechanisms of how the DID server works aren't terribly interesting for the purposes of this post, but here's a few of the questions I have about how this is going to work at scale:

- It strikes me that the actual goal here is for there to be some independent service or set of services that act as DID hosts rather than Bluesky itself providing it. I'd imagine that in a perfect world, your identity is completely independent and travels with you across a variety of services? That said, if you're already shipping a subset of the actual W3C spec, is interoperability going to be a problem?
- Using domain handles and mapping them to DIDs is a genuinely good idea because it allows us to piggyback off existing reputational systems on the web (it also makes it very convenient to namespace users!), but I'm curious about the failure states? For example, handle impersonation/spoofing with interesting characters, etc. DNS caching also strikes me as a potential issue with split-brain problems.
- I'm not entirely convinced that this is really that necessary? I can see the long-term vision, and I do think it patches a couple of holes in ActivityPub, but there seem to be a lot of maybes along the way. One of the ways that crypto "works" (and I use this term loosely) is by forcing everyone involved to 'pay their own way' through PoS/PoW mechanisms. If you remove that, then you're left with a situation where the economic incentives to just be an identity provider seem somewhat limited -- especially given the traffic requirements to host DID documents? Perhaps the work they're doing to make it cheap will be the innovation here, and an existing player will offer support (i.e., Google) to extend their existing IdP offerings.

## Storage

ATP defines a 'data repository' to be a collection of data published by a single user, expressed as a [Merkle Search Tree (MST)](https://inria.hal.science/hal-02303490/document). Each node of the tree is a [IPLD](https://ipld.io/) object which is referenced by a hash value.

In plainer terms, whenever you do anything on Bluesky, you're creating a new record. This record can be a follow, a block, a post, whatever. These records all conform to a universal data model which is designed to be linked to other records. Any individual record is immutable, which avoids some problems around consistency and state in a distributed system. A client can fetch this data repository and walk the linked list in order to perform actions (like showing you posts). Much of the more complex logic is implemented on the server rather than the client in order to speed up operations.

If this sounds _kinda_ like the harried dreams of XML and semantic web proponents, well, you ain't far off. Instead of XML, though, it's JSON-like! Whee!!

Again, I don't want to dive too deep here because I'm not actually an expert on this, but here's the questions I have --

- One stated goal of ATP is to provide the ability for servers to index participating federated entities (this is good, imo). However, I don't actually see how defederation works in this model without indexers simply choosing to de-index parts of the network. I \_do\_ see a huge potential for protocol-level forks (similar to what's happened in the past for various cryptocurrencies) to split the network in twain, though.
- This strikes me as very computationally expensive (\_anything\_ creates a new record, records require re-hashing and re-signing the chain up to the root node) -- I'm curious how it scales at a billion+ users, especially if they're concentrated onto a single data store host.
- Assuming you use something like IPFS to allow for decentralized storage and processing, it seems like it'd be very easy to get into extremely strange edge cases around performance... for example, notifications being out of sync, etc.

That said, you know what this seems like it'd be _killer_ for? Calendaring...

## Clients

How do we interact with this protocol? Well, you need a client. Clients and servers talk to each other in ATP using something they call [XRPC](https://atproto.com/specs/xrpc), which looks an awful lot like gRPC. XRPC seems somewhat unique in that it explicitly calls for schemas to be published on the network, theoretically allowing for them to be easily iterated over and crawled by various automated processes.

The global schema for XRPC is [Lexicon](https://atproto.com/specs/lexicon), which defines how requests and responses are communicated between clients and servers. It's a JSON document. This sort of self-documentation is rather refreshing -- not to mention pretty handy in the brave new world of LLM-assisted programming.

A couple of notes...

- While it's a cool idea, I'm extremely curious how this is going to work out in practice. I don't see anything in the spec that identifies how RBAC is going to work here; it seems like all records are available to any client. This means that bad actors could fairly easily scrape the network (contra any sort of rate limiting or global auth) and store posts for later indexing.
- [This blog](https://blueskyweb.xyz/blog/4-13-2023-moderation) discusses the Bluesky approach to content moderation. While I applaud their willingness to try something new, I have some questions about where various parts of this stack 'live'. If bsky.social is acting as an aggregator/index, are posts scanned for infringing/actionable content there? What happens to hosts that reguarly post infringing material, do they just stop getting indexed (and if that happens, _and_ there are DID's attached to that host, how do they migrate off? I see a mechanism for key revocation, but I don't remember downloading a reset key when I signed up for Bluesky...)
- The algorithmic selection layer seems less risky, but given that ATP delegates a significant portion of query-time complexity to the host itself, who's gonna be running all these algorithm labeling servers? It also seems there's a lot of duplicated work here -- if I'm trying to classify the firehose, then I'd need to either index the entire network (service discovery!) or rent time/space from an existing indexer. Perhaps the latter is the play, here, and Bluesky intends to allow developers to build on their infrastructure?

## Conclusion

My extremely grudging praise is that it seems like the team over at Bluesky has managed to wrest a single generally-applicable use case from the morass of crypto bullshit that spawned it.

_However_, I'm not really sure that it's what their users currently want, and that's going to be a significant challenge for them going forward. I can see a model where bsky.social becomes the effective 'default' and sells access to their index, with only a small minority of overall users creating federated spaces and then carefully managing what can be exposed back to the main index (again, I don't actually see if this is possible currently, the docs aren't fully complete).

Either way, hats off to them -- and if you need me, I'll be posting with my new pals on Bluesky.
