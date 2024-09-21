---
title: "OpenTracing for ASP.NET MVC and WebAPI"
date: "2018-10-13"
---

Preface - I really like what Microsoft is doing with .NET Core and ASP.NET Core.

However, the horror they've unleashed upon the world in the form of ASP.NET MVC and WebAPI is a sin that will take more than a few moons to wash away. That said, quite a few people are still building software using this stuff and I got curious how you'd do instrumentation of it via [OpenTracing](https://opentracing.io). This post is the result of several hours of hacking towards that end.

## Action Filters For Fun And Profit

It's actually pretty straightforward, assuming you know what to Google and can handle the absolute _state_ of documentation that's available. At a high level, here's how it works. ASP.NET - similar to Java Servlets - provides [Action Filters](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/controllers-and-routing/understanding-action-filters-cs) which are simple lifecycle hooks into the HTTP request pipeline. There's four interfaces you can target if you want to be more specific, but a fairly trivial implementation of a Logger can be done like so:

```
public class CustomLogger : ActionFilterAttributen{n    public override void OnActionExecuting(ActionExecutingContext filterContext) n    {n        Debug.WriteLine($"executing controller: {filterContext.RouteData.Values["controller"]}");n        // etc etc...n    }npublic ovveride void OnResultExecuted(ActionExecutingContext filterContext) n    {n        Debug.WriteLine($"result complete in controller: {filterContext.RouteData.Values["controller"]}");n        // etc etc...n    }n}
```

Pretty straightforward, like I said. There's also OnActionExecuted and OnResultExecuted which are called after and before a controller action, and controller action result, respectively.

So you'd think it'd be pretty easy, right? OpenTracing provides a handy GlobalTracer singleton, so create a TracingFilter...

```
public class TracingFilter : ActionFilterAttributen{n    public override void OnActionExecuting(ActionExecutingContext filterContext)n        {n            var routeValues = filterContext.RouteData.Values;n            var scope = GlobalTracer.Instance.BuildSpan($"{routeValues["controller"]}").StartActive();n            scope.Span.SetTag("action", routeValues["action"].ToString());n        }npublic override void OnResultExecuted(ResultExecutedContext filterContext)n        {n            var scope = GlobalTracer.Instance.ScopeManager.Active;n            scope.Span.Finish();n        }n}
```

Then in your RegisterGlobalFilters method, do a quick filters.Add(new TracingFilter()), register a Tracer, and away you go! Right?

Wrong.

Well, half-right.

## That Sounds Like Me, Yeah.

Assuming you're _only_ using MVC, you're right. So you'll see spans for, say, GETting your index page, but not for any of your API routes. Why? Because there's _two_ ActionFilterAttributes. The one we just did is System.Web.Mvc.ActionFilterAttribute. Want your WebAPI traced too? Time to create a System.Web.Http.Filters.ActionFilterAttribute. You can tell them apart by the extremely different method signatures, as seen here -

```
public class WebApiTracingFilter : ActionFilterAttributen    {n        public override void OnActionExecuting(HttpActionContext actionContext)n        {n            var scope = GlobalTracer.Instance.BuildSpan(actionContext.ControllerContext.ControllerDescriptor.ControllerName).StartActive();n            scope.Span.SetTag("action", actionContext.ActionDescriptor.ActionName);n        }npublic override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)n        {n            var scope = GlobalTracer.Instance.ScopeManager.Active;n            scope.Span.Finish();n        }n    }
```

Yeah, that took me a few minutes and [this StackOverflow answer](https://stackoverflow.com/a/29352433/7933630) to puzzle out. _c'est la vie_.

That said, this is pretty much the hard part. Since you've got spans being automagically started and finished whenever the request pipeline hits, you can implicitly utilize those parent spans inside a controller to create children:

```
[WebApiTracingFilter]npublic class ValuesController : ApiControllern{n    public IEnumerable<string> Get()n    {n        var returnValue = getCurrentTime();n        return new string[] { returnValue };n    }nprivate string getCurrentTime()n    {n        using (var scope = GlobalTracer.Instance.BuildSpan("getCurrentTime").StartActive())n        {n            return DateTime.Now.ToShortDateString();n        }n            n    }n    n    // and so forth...n}
```

You can also get fancy with your OnActionExecuted/OnResultExecuted filters by checking for exceptions coming in and adding stack traces to your span logs.

If you'd like to check out the complete sample project I made, it's [on GitHub](https://github.com/austinlparker/OpenTracing.TracingFilter).
