---
title: "In Defense of Browser Plugins"
date: 2018-04-14T21:42:00-04:00
anchor: "In Defense of Browser Plugins"
type: "post"
---

![image](https://blog.mozilla.org/internetcitizen/files/2017/09/moz_blog_web-extensions_add-ons-pattern-1400x770.jpg "hero image")

When was the last time you thought about browser plugins?

<!--more-->

Been a minute, hasn't it? We've come a long way from the not-so-great old days of NPAPI and ActiveX. Some might even say that the days of browser plugins being a thing we should care about is long gone, as single page applications and frameworks like [Electron](https://electronjs.org/) make it possible to create native applications running outside the browser using familiar web technologies such as JavaScript, HTML, and CSS.

Browsers are still the single greatest, most portable, and most widely-used application runtime available in 2018. Think about how much of your time, each day, is spent in Chrome or Firefox. A lot, right? It's a double-edged sword, however. While you can access a huge variety of content and applications through the browser, you're missing out on the ability to create tools and utilities that interact with these applications like you could for applications and services running on your computer.

Browser extensions and plugins help bridge this gap in a convenient and easy-to-use way. As a developer, there's a powerful and extensible set of APIs called [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions). These are compatible with modern versions of Chrome, Firefox, Edge, and Opera. What can you do with the WebExtensions API? Well, here's a few examples...

- [npmhub](https://github.com/npmhub/npmhub) allows you to view the dependencies for a given npm package in the browser from GitHub or GitLab, presenting a nice GUI to explore what a package depends on.
- [hide files on github](https://github.com/sindresorhus/hide-files-on-github) will filter out non-essential files from the file list on a GitHub repository.
- [firefox code search](https://github.com/mdn/webextensions-examples/tree/master/firefox-code-search) is a demo from Mozilla, demonstrating how you can search the Firefox code base straight from your browser's address bar.
- [view image for google image search](https://chrome.google.com/webstore/detail/view-image/jpcmhcelnjdmblfmjabdeclccemkghjk) restores the 'view image' button in Google Image search. 'nuff said.

Those samples just scratch the surface of what's possible using WebExtensions, though. I wrote a browser extension using the WebExtensions API for the R&D team at [Apprenda](https://www.apprenda.com) that integrates with TeamCity, which we use for builds and tests. The extension lets us coordinate test review and collect statistics on why certain tests are failing, above and beyond the features available in TeamCity out of the box. The best part? Since browser plugins are cross-platform, I was able to deploy this extension to users across our entire organization on a variety of operating systems with no additional configuration or custom code. My users can just install the plugin, regardless if they're running MacOS, Windows, or some flavor of Linux.

It's really easy to get started writing browser plugins with WebExtensions, regardless of your familiarity with browser development. You can find some [great tutorials on MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension) that will work you through the basic parts of creating a project and installing your first extension. Ultimately, you're just making a little web page that lives inside the browser. The real power, though, is that your extension can interact with whatever web page you're looking at. Want to create a little clipping tool that holds snippets of interesting things you've read, and have it live in your browser's tab bar? You can do that with WebExtensions and the Storage API!

The real power of plugins, I believe, is in how you can use them for your own needs, or in your own organization. What if you extended that code search example from earlier in this post to integrate with your application metrics, or to your application's code base? The options really are endless.

If you've got more questions, or want to talk about the projects you're working on, feel free to reach out!

_image from https://blog.mozilla.org/internetcitizen/2017/09/18/firefox-add-ons-keep-web-open-connected-decentralized/_