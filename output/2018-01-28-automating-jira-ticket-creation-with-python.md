---
title: "Automating Jira Ticket Creation with Python"
date: "2018-01-28"
---

Jira - love it, hate it, begrudgingly accept it - it's a fact of life for many of us in the software world. One thing that particularly sucks about Jira to me is that there appears to be an eternal tension regarding process.

You've probably got a boatload of various processes that you'd like to be somewhat repeatable and easy to discover. In my career, I've seen these processes be documented in a variety of places. Wikis, random Word documents on a shared drive, a shared Google Document, a single Jira ticket that's cloned over and over... the list goes on. The problem always comes when you want to embed some sort of information in these tickets (for instance, version numbers for a deployment process to better disambiguate which tickets match up to which deployment) and you want to do it in a way that's easily accessible and versioned.

At Apprenda, we've been striving to become more releaseable. Part of this is the automation of our release process, which fits the above criteria to a T. I wrote a little utility that helps us create a series of tickets for release processes, and I'll go ahead and talk about it here and share it with you, Internet, in the hopes that it may help someone else who found themselves in my shoes.

## ticketgen

[The repository is located here](https://github.com/austinlparker/ticketgen) and will probably be helpful to refer to.

This tool makes a lot of assumptions about process, first off. Mostly that it's being used for a particular process - a new release of an existing piece of software that requires end-to-end tests of multiple scenarios. Of course, you can fork it and make it do whatever you want. I've added some defaults to the options file that should indicate how it's used.

There's a few interesting scenarios exposed within it, though. If we look at the install/upgrade section of options.ini, we can see one.

```
[CleanInstallSection]nsummary: rel-{0}: Clean install on {1} cloud.ndescription: This is an automatically generated stub!nn[UpgradeSection]nsummary: rel-{0}: Upgrade from {1} on {2} cloud.ndescription: This is a automatically generated stub!
```

The UpgradeSection specifically calls out a particular cloud type, which is hard-coded as either 'single' or 'hybrid' cloud in the script. This could be changed to some other interesting configuration for your purposes. There's a format\_summary and format\_description method on the Ticket class that will let you pass any number of values into those fields, so you could do something like this if you had more tokens you wanted to switch in:

```
summary: rel-{0}: {1} test on {2} config with {3} providerndescription: Run the {0} test suite with the {1} option enabled on {2}nn// Then process those like so:nnticket.format_summary("1.0.0", "regression", "secure", "aws")nticket.format_description("regression", "secure", "aws")
```

You could also add those values to the options file and iterate over them.

## How It's Helping

Since this all runs inside a Docker container, it can easily be added into a CI/CD pipeline. Preprocess the options file, swap out version info or add it as needed, then build and run the new container.

For some perspective, we're using this to create about 30-odd tickets for each release we ship. Previously, we used a shared wiki page that multiple people would edit and 'mark off' what they were working on. The advantage of the Jira-based solution is that it's easier at-a-glance to see what needs to be done, what hasn't been done, and how these tasks grow or shrink over releases. I've especially found that having this information in Jira is beneficial when trying to communicate across the business and demonstrate areas where improved automation or tooling would be beneficial. It's also been useful for people who aren't attached to the release process to understand where the team is with shipping and what's left to be done.

I hope you'll find this useful in some way; When I decided to create this script, I didn't really find anything that seemed to help me do the job I wanted to do.
