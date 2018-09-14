---
title: "Building Multi-Framework C# Libraries on CircleCI"
date: 2018-09-14T12:12:00+05:00
anchor: "Building Multi-Framework C# Libraries on CircleCI"
type: "post"
---

It's never been a better time to write cross-platform .NET, that's for sure. I'm 100% MacOS using [Rider](https://www.jetbrains.com/rider/) and Visual Studio Code these days, and things work generally pretty OK. Obviously you're going to run into trouble if you're trying to touch any Windows-specific frameworks or libraries, but for the sort of backend and instrumentation focused code I'm writing these days, it's not that big of a problem.

However, there's still some rough edges when it comes to running cross-platform projects in a CI system, especially if you're using something that doesn't have prebaked images. Microsoft has done a lot of work to make things work pretty well _if_ you're using just .NET Core 2.x with their [docker images](https://hub.docker.com/r/microsoft/dotnet/), but you'll quickly find a catch-22 if you're trying to multi-target. `dotnet build` inside a .NET Core container will complain about the lack of .NET 4.5+ frameworks unless you get into magical targeting pack shenanigans. So, no problem, run it inside a `mono` container... but now you're missing .NET Core, so netstandard2 for you.

### What's The Fix?

To the .NET Core team's credit, I did happen to see an issue logged in their GitHub for an image that combined both. Seems like they got beaten to the punch however, as I happened to find [andrewlock/docker-dotnet-mono](https://github.com/andrewlock/docker-dotnet-mono) on GitHub. I've made some tweaks to have it run in CircleCI [which you can find here](https://github.com/austinlparker/docker-dotnet-mono), and it works pretty much like you'd expect.

Using it in CircleCI is fairly straightforward:

```yaml
version: 2
jobs:
  build:
    docker:
      - image: aparker/circleci-dotnet-mono:latest
    steps:
      - checkout
      - run: msbuild /t:Restore
      - run: msbuild /t:Build
```

One thing you'll need to account for as well is your test runner. If you're using XUnit, the `xunit.runner.msbuild` package will let you define a test target inside your csproj file, like so -

```xml
<Project DefaultTargets="Test" xmlns="http://schemas.microsoft.com/developer/msbuild/2003" Sdk="Microsoft.NET.Sdk">
  <!--insert other csproj goodness as appropriate-->
  <UsingTask
    AssemblyFile="path\to\xunitmsbuildrunner.dll"
    TaskName="Xunit.Runner.MSBuild.xunit"/>

  <Target Name="Test">
    <xunit Assemblies="path\to\test.dll" Reporter="verbose" />
  </Target>
</Project>
```

You can then run the tests through the `msbuild` cli with `msbuild path/to/tests.csproj /t:Test`. 

One other nice thing about this setup, since we're using a recent version of Mono, it includes a recent version of `msbuild` which allows us to run various NuGet commands like `Pack` - and since the Docker image contains `dotnet`, we can `dotnet nuget push` our NuGet packaged libraries to NuGet.org!

### Why Use Raw MSBuild? Why not use Cake?

Sometimes [Cake](https://cakebuild.net/) is just kind of overkill, I guess. I'm a big fan of it, but I've been burned by addons falling out of sync as the main project is updated, and I think there's an advantage to having things be relatively 'pure' on a relatively non-complex project. That said, I think Cake is a great tool and really enjoy using it.

All that said, let me know on [Twitter](https://twitter.com/austinlparker) if you've had similar issues or need any sort of help getting your CI set up for multi-platform net45/netstandard2 builds! It's mostly fun stuff.