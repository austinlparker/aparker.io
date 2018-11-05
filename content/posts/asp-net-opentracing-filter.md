---
title: "OpenTracing for ASP.NET MVC and WebAPI"
date: 2018-10-13T23:02:19+05:00
anchor: "OpenTracing for ASP.NET MVC and WebAPI"
type: "post"
---
![image](/images/waterweb.jpg)

Preface - I really like what Microsoft is doing with .NET Core and ASP.NET Core. 

However, the horror they've unleashed upon the world in the form of ASP.NET MVC and WebAPI is a sin that will take more than a few moons to wash away. That said, quite a few people are still building software using this stuff and I got curious how you'd do instrumentation of it via [OpenTracing](https://opentracing.io). This post is the result of several hours of hacking towards that end.

<!--more-->

## Action Filters For Fun And Profit

It's actually pretty straightforward, assuming you know what to Google and can handle the absolute _state_ of documentation that's available. At a high level, here's how it works. ASP.NET - similar to Java Servlets - provides [Action Filters](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/controllers-and-routing/understanding-action-filters-cs) which are simple lifecycle hooks into the HTTP request pipeline. There's four interfaces you can target if you want to be more specific, but a fairly trivial implementation of a Logger can be done like so:

```csharp
public class CustomLogger : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext filterContext) 
    {
        Debug.WriteLine($"executing controller: {filterContext.RouteData.Values["controller"]}");
        // etc etc...
    }

    public ovveride void OnResultExecuted(ActionExecutingContext filterContext) 
    {
        Debug.WriteLine($"result complete in controller: {filterContext.RouteData.Values["controller"]}");
        // etc etc...
    }
}
```

Pretty straightforward, like I said. There's also `OnActionExecuted` and `OnResultExecuted` which are called after and before a controller action, and controller action result, respectively.

So you'd think it'd be pretty easy, right? `OpenTracing` provides a handy `GlobalTracer` singleton, so create a `TracingFilter`...

```csharp
public class TracingFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var routeValues = filterContext.RouteData.Values;
            var scope = GlobalTracer.Instance.BuildSpan($"{routeValues["controller"]}").StartActive();
            scope.Span.SetTag("action", routeValues["action"].ToString());
        }

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            var scope = GlobalTracer.Instance.ScopeManager.Active;
            scope.Span.Finish();
        }
}
```

Then in your `RegisterGlobalFilters` method, do a quick `filters.Add(new TracingFilter())`, register a `Tracer` in `Register`, and away you go! Right?

Wrong.

Well, half-right.

## That Sounds Like Me, Yeah.

Assuming you're _only_ using MVC, you're right. So you'll see spans for, say, `GET`ting your index page, but not for any of your API routes. Why? Because there's _two_ `ActionFilterAttributes`. The one we just did is `System.Web.Mvc.ActionFilterAttribute`. Want your WebAPI traced too? Time to create a `System.Web.Http.Filters.ActionFilterAttribute`. You can tell them apart by the extremely different method signatures, as seen here -

```csharp
public class WebApiTracingFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var scope = GlobalTracer.Instance.BuildSpan(actionContext.ControllerContext.ControllerDescriptor.ControllerName).StartActive();
            scope.Span.SetTag("action", actionContext.ActionDescriptor.ActionName);
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            var scope = GlobalTracer.Instance.ScopeManager.Active;
            scope.Span.Finish();
        }
    }
```

Yeah, that took me a few minutes and [this StackOverflow answer](https://stackoverflow.com/a/29352433/7933630) to puzzle out. _c'est la vie_.

That said, this _is_ pretty much the hard part. Since you've got spans being automagically started and finished whenever the request pipeline hits, you can implicitly utilize those parent spans inside a controller to create children:

```csharp

[WebApiTracingFilter]
public class ValuesController : ApiController
{
    public IEnumerable<string> Get()
    {
        var returnValue = getCurrentTime();
        return new string[] { returnValue };
    }

    private string getCurrentTime()
    {
        using (var scope = GlobalTracer.Instance.BuildSpan("getCurrentTime").StartActive())
        {
            return DateTime.Now.ToShortDateString();
        }
            
    }
    
    // and so forth...
}
```

You can also get fancy with your `OnActionExecuted`/`OnResultExecuted` filters by checking for exceptions coming in and adding stack traces to your `span` logs. Also, I'm not really _that_ experienced with ASP.NET stuff so there's probably some stuff that I'm missing here! 

## In Conclusion

If you'd like to check out the complete sample project I made, it's [on GitHub](https://github.com/austinlparker/OpenTracing.TracingFilter). If you're interested in stuff like this and want to learn more about OpenTracing, [hit me up on Twitter!](https://twitter.com/austinlparker)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@s_erwin?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Sam Erwin"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Sam Erwin</span></a>