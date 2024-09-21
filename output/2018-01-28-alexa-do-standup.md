---
title: "\"Alexa, do Standup\""
date: "2018-01-28"
---

Since I joined the Apprenda team, the ritual of daily R&D team standups have been a pretty constant companion. Being able to to get a ten-thousand foot view of our progress helps keep everyone on the same page, even as our team has grown over the years. One of the rituals of our morning standups has been the deployment report, where we're updated on how nightly tests and deployments of the Apprenda Cloud Platform have fared.

As a member of our tools and infrastructure team, I'm always on the lookout for ways to improve developer efficiency; I'm also a big gadget fan. The latter has lead me to develop quite the collection of Amazon Echo devices, the former lead me down the road of trying to invite Alexa into our daily standups. In this post, I'd like to show you one of the results of that, along with some sample code and thoughts on how to bring Alexa into your daily standups.

### The Problem

Let's say hello to our friendly test environment, we'll call it 'Bourbon'. Bourbon is a relatively small test environment, and for us, is just a group of various Apprenda Cloud Platform (ACP from here on out) features and environment specifications that we can refer to. Every day, we take the most recent version of ACP and install it to Bourbon, which results in a successful deployment in our TeamCity instance.

However, sometimes, disaster can strike! Bourbon might not get deployed correctly, or it might have encountered a problem when performing a deployment step. Previously, we would have an engineer look through the TeamCity results page every morning before standup and prepare a report of what succeeded, what failed, and what versions/branches were deployed.

So, let's figure out how to get Alexa to tell us what's going on instead.

### Talking to TeamCity

We use an internal tool known as Gauntlet to store information about our test environments. Gauntlet is a .NET service, so the first part of our new Alexa service will leverage it.

First, we'll want to define a quick model -

```
public class DeploymentStatusResourcen{n    public string DeploymentStatus { get; set; }n    public string EnvironmentName { get; set; }n    public string Package { get; set; }n    public string PreUpgradePackage { get; set; }n    public string Type { get; set; }n    public DateTime DeploymentTime { get; set; } n}
```

Nothing too fancy so far, just the information we care about. Since TeamCity returns success or failure as a string, we'll preserve the information as a string in order to support more detailed information at a later time.

We grab the current environment list from Gauntlet, and then use [FluentTc](https://github.com/QualiSystems/FluentTc) to query our TeamCity instance for all builds within the past 24 hours.

```
var tc = new RemoteTc().Connect(x => x.ToHost("teamcity").AsUser("username", "password"));nvar builds = tc.GetBuilds(x => x.SinceDate(DateTime.Now.AddDays(-1)),n                               x => x.IncludeDefaults()n                                     .IncludeStartDate()n                                     .IncludeFinishDate()n                                     .IncludeStatusText());
```

We're not done yet, though. TeamCity's REST API does not inflate the resources returned from a call to \`GetBuilds\`, so we need to go back to the well to get more information (such as the name of the build configuration!)

```
foreach (var build in builds) {n  try {n        inflatedBuilds.Add(tc.GetLastBuild(x => x.Id(build.Id)));n    }n  catch (Exception ex) {n        // Handle Me!n    }n  }
```

Finally, we filter builds to active environments and create our list of deployments.

```
var deployments = inflatedBuilds.Where(x => x.BuildConfiguration.Name.ToLower().Contains(environmentName));nforeach (var build in deployments)n{n    var item = new DeploymentStatusResource();n    item.DeploymentStatus = build.Status.ToString();n    item.EnvironmentName = environmentName;n    item.DeploymentTime = build.FinishDate;n    if (!build.Properties.Property.Exists(x => x.Name == "upgradePackage"))n    {n        item.Package =n            build.Properties.Property.Find(x => x.Name == "branch").Value;n        item.Type = "Install";n    }n    elsen    {n        item.Package = build.Properties.Property.Find(x => x.Name == "upgradePackage").Value;n        item.Type = "Upgrade";n        item.PreUpgradePackage = build.Properties.Property.Find(x => x.Name == "preUpgradePackage").Value;n    }n    DeploymentList.Add(item);n}
```

Finally, create a new controller and route for the endpoint, and we can GET `{server}/api/reports/deployments` to receive a response that includes items such as this -

```
[n  {n    "deploymentStatus": "Success",n    "environmentName": "bourbon",n    "package": "feature-coolnewfeature",n    "preUpgradePackage": null,n    "type": "Install",n    "deploymentTime": "2017-01-06T03:29:06.243Z"n  },n  ...n]
```

Great! So, now what?

### High-Level Design

For running our Alexa skill, we'd like to use [AWS Lambda](https://aws.amazon.com/lambda/). It's free for up to a million requests a month, which is far less than we'll possibly need for a primarily internal service. Lambda also has a convenient integration with the Alexa developer portal and tools.

As I mentioned in part one, we're pulling data from an HTTP service that's part of a larger internal service. Placing the endpoint for this service on the public internet isn't really an option! So, how to get data out of it?

Since we don't need real-time resolution of these test deployments (given that they generally only run a few times a day and can take some time to perform), we'll use a small Golang application that runs on a schedule in order to exfiltrate our data to a AWS S3 bucket that the Lambda pulls from.

[

![](images/alexaskill.png)



](http://aparker-io.preview-domain.com/wp-content/uploads/2022/09/alexaskill.png)

### Getting Data Out To S3

Our data is pretty straightfoward, we can represent it as a simple text file in JSON. With that in mind, I created a simple Golang application that I'll run via Docker. The code for this is below:

```
package mainnnimport (n    "fmt"n    "net/http"n    "os"nn    "github.com/aws/aws-sdk-go/aws"n    "github.com/aws/aws-sdk-go/aws/credentials"n    "github.com/aws/aws-sdk-go/aws/session"n    "github.com/aws/aws-sdk-go/service/s3/s3manager"n)nnfunc main() {n    url := "service url"n    res, err := http.Get(url) n        // make sure you handle errors in your own code!nn    defer res.Body.Close()n    fmt.Println("Uploading report to S3.")n  n    creds := credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY"), os.Getenv("AWS_SECRET_ACCESS_KEY"), "") nn    sesh := session.New(&aws.Config{n        Credentials: creds,n        Region:      aws.String("us-east-1"),n    })nn    uploader := s3manager.NewUploader(sesh)n    s3res, err := uploader.Upload(&s3manager.UploadInput{n        Bucket: aws.String("bucket-name"),n        Key:    aws.String("deploymentreport"),n        Body:   res.Body,n    })nn    fmt.Println("Uploaded file to ", s3res.Location)n}
```

The corresponding Dockerfile is equally straightfoward:

```
FROM golang:onbuildnENV AWS_ACCESS_KEY MyAccessKeynENV AWS_SECRET_ACCESS_KEY MySecretKey
```

Remember - never commit AWS keys to a git repository! Consider using key management to store secrets.

For my purposes, we can simply build and copy the Docker image to another host; `docker build -t publish_srv && docker save -o publish_img publish_srv`. Copy the tarfile to your Docker host however you prefer, and load it via `docker load -i path/to/img`.

I chose to use `cron` on my Docker host to `docker run publish_srv` at a regular interval. Other options exist as well, it's possible to leave the container and application running constantly and schedule the execution of the task at some defined period.

### The Joy of the Cloud

"Wait, why use S3? Why not publish results to some sort of document store, or a relational database?" Why _not_ use S3? It's dirt-cheap for something that is being pushed only several times a day (consider that PUT requests are billed at $0.005/1,000) and each result is only a few kb in size. One of the biggest challenges when transitioning to cloud-native is breaking the mental model of trying to fit all of your pegs into database-shaped holes. A point to Amazon here as well; S3 is incredibly easy to use from Lambda. Lambda functions have the API keys for their roles available during Lambda execution, which means you don't have to fiddle with secrets management in Lambda functions. That doesn't mean you can't, obviously, but why wouldn't you in this case?

Being able to utilize S3 as a go-between for internal providers of data and external consumers of data grants us the ability to begin extending and refactoring legacy applications and services into cloud-native patterns. In fact, for many internal applications, S3 or other scalable cloud storage might wind up being the only data store you actually need.

### Creating and Bootstrapping an Alexa Skill

First, you'll need an Amazon account and an [Amazon developer account](https://developer.amazon.com). If you want to test your skill on a live Echo (without publishing it), make sure you use the same Amazon account that an Echo device is registered to.

Log in to the Amazon Developer Portal, and under the Alexa tab, click 'Get started' on the Alexa Skills Kit entry. On the next page, you'll want to create a new skill and enter some basic information about your application.

[

![](images/p301-1024x529.png)



](http://aparker-io.preview-domain.com/wp-content/uploads/2022/09/p301-1024x529.png)

You might note that there's an awful lot going on here - Interaction Model, Configuration, and so forth. For now, let's gloss over a lot of these details and select 'Custom Interaction Model' and enter a Skill name and an Invocation name. The latter is how users will interact with your skill, in this case, someone would say "Alexa, ask Reportamatic..." and continue with their interaction from there. Let's figure that out before we go any further.

Technically, the only thing you _need_ to do is create an Application that supports the requests from the Alexa service and responds appropriately, which leaves quite a bit of room for individual implementations in whatever language you might prefer. If you're running on Lambda, you have several options - C#, Java 8, node.js 4.3, or Python 2.7. To speed up development of basic skills, there's several frameworks that you can avail yourself of, including the [alexa-app](https://github.com/matt-kruse/alexa-app) and [alexa-app-server](https://github.com/matt-kruse/alexa-app-server) projects.

I don't mind node, so let's go ahead and use that. The full use of both of these packages is a little outside the scope of this post, but it's not much harder than `npm install alexa-app-server --save` and creating new skills in your servers `app` path. Again, see the full documentation on GitHub for more details. The framework lets us quickly build intents and interaction models through extra parameters passed into the `app.intent` function. First things first, let's create the application -

```
var alexa = require('alexa-app');nvar AWS = require('aws-sdk')nnmodule.change_code = 1;nnvar app = new alexa.app('deploymentreport');nvar s3 = new AWS.S3();nnapp.launch(function(req, res) {n  var prompt = "Ask me for the deployment report, or for a report on a specific environment";n  res.say(prompt).reprompt(prompt);n});
```

Our imports are fairly straightforward; the alexa-app framework, and the AWS SDK for node.js. `module.change_code = 1` enables hot-reload of our module when executed in the `alexa-app-server`. Finally, we create an application and assign the Launch request. This is essentially the default command passed to an Alexa skill, and is triggered when a user invokes the skill without any other invocation. `res.say` sends a block of text back out to the Alexa service that will be translated into speech and output from the user's Echo.

Now, behind the scenes, this is all just a bunch of requests coming and going. For instance, here's the JSON for a `LaunchRequest` -

```
{n  "version": "1.0",n  "session": {n    "new": true,n    "sessionId": "amzn.test.id",n    "application": {n      "applicationId": "amzn.test.app.id"n    },n    "attributes": {},n    "user": {n      "userId": "amzn.test.user.id"n    }n  },n  "request": {n    "type": "LaunchRequest",n    "requestId": "amzn1.echo-api.request.test",n    "timestamp": "2015-05-13T12:34:56Z"n  }n}
```

This is the basic format for requests from the Alexa service into your Lambda; Sessions are important if you're dealing with conversations or multi-stage interactions, as you'll need to read and write information from and to them to persist data between steps. The request object itself is where you'll find information such as intents, mapped utterances, and so forth. For comparison, here's the request object for a specific intent.

```
{n    "type": "IntentRequest",n    "requestId": "amzn.request.test.id",n    "timestamp": "2015-05-13T12:34:56Z",n    "intent": {n      "name": "SpecificReportIntent",n      "slots": {n        "NAME": {n          "value": "environment1",n          "name": "NAME"n        }n      }n    }n}
```

Thankfully, we have a convenient way to deal with these requests in our framework - `app.intent`.

```
app.intent('SpecificReportIntent',n          // this argument is optional and will create a intent schema and utterances for youn          {n          "slots": {n            "NAME": "EnvironmentName"n          },n          "utterances":[n            "{what is the deployment report|get deployment report|get report} for {-|EnvironmentName}"n          ] n          },n          // do the actual work of the intent.n          function(req, res) {n            s3.getObject({ Bucket: "my-bucket", Key: "deploymentreport" }, n            function(e, s3res) {n              var data = JSON.parse(s3res.Body.toString());n              // simply match the environment name sent in through the intent to the data we're getting from the reportn              var match = data.filter(function(item) {n                return item.environmentName.toLowerCase() == envName;n              });n              // parse the object for interesting information and build the responsen              if (match.length > 0) {n                res.say(`${envName} deployment was an ${match[0].type} to ${match[0].package} and it was ${match[0].deploymentStatus}`)n              } else {n                res.say('I could not find a report for that environment.')n              }n              // make sure to explicitly send the responsen              res.send();n            });n            // watch out, since the call to get our object is async, we need to immediately return false (library design concern)n            return false;n          }n);
```

Ultimately, we're simply taking an array of JSON like we defined all the way back in part one and searching for a name match. How does Alexa know what intent to call, though? That's where the intent schema and sample utterances come in.

### Schematically Speaking...

Another convenience of our library is it can work in conjunction with the alexa-app-server to automatically generate an intent schema. Intent schemas are essentially mappings that let the Alexa service know what request to send to your application in response to your voice. Here's the schema for our SpecificReportIntent.

```
{n  "intents": [n    {n      "intent": "SpecificReportIntent",n      "slots": [n        {n          "name": "NAME",n          "type": "EnvironmentName"n        }n      ]n  ]n}
```

Pretty simple, yeah? What's that EnvironmentName type, though? Alexa allows us to define a [Custom Slot Type](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#custom-slot-types), a list of words it should try to match to. This improves voice recognition greatly, as the voice recognition attempts to map utterances to a known set of phonemes. We set up the Intent Schema, Custom Slot Types, and Sample Utterance back in the Amazon Developer Portal.

[

![](images/p302-1024x982.png)



](http://aparker-io.preview-domain.com/wp-content/uploads/2022/09/p302-1024x982.png)

Take note! Your schema and custom type may be small, but your sample utterances will probably not be! Your utterances need to capture _\_all\__ of the ways a user might interact with your skill. One of the topics we haven't touched on at all is developing a quality Voice UI (VUI), and if you're planning on doing Alexa skills 'for real' then you should certainly invest quite a bit of time on designing the VUI. Utterances aren't terribly discoverable, after all, and people from different cultural or educational backgrounds may say the same thing in subtly different ways.

Let's finish our skill up with a final intent, one where we can get all of the available reports.

```
app.intent('AllReportIntent', {n    "utterances":["{what is the deployment report|get the deployment report|what were deployments like}"]n    }, function(req, res) {n        s3.getObject({Bucket: "my-bucket", Key: "deploymentreport"}, function(e, s3res) {n          var data = JSON.parse(s3res.Body.toString());n          data.forEach(function(item) {n            res.say(`${item.environmentName} deployment was an ${item.type} to ${item.package} and it was a ${item.deploymentStatus} <break time="1s"/>`)n          });n          res.send();n        });n        return false;n      }n);
```

One thing to point out - see that, at the end of our res.say call? Since the text that's sent back is interpreted as [SSML](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference), you're able to add various pauses or instructions for how it should be spoken.

At the end of our declarations, we need to export our application via \`module.exports = app;\` and then we're done with node for the time being with node. To deploy your skill to Lambda, simply make a zip file of its package.json, node\_modules, and all .js files in the folder, and upload it as a new Lambda service. This requires an AWS account, which again, is slightly outside the scope of this post. I will note that when you make the Lambda function, you'll need to create a IAM role to execute the function under. Please [see AWS documentation](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html) for more information on how to configure this role.

Back in the Amazon Developer Portal, one last thing to do. First, get the ARN ID of your Lambda function (upper-right corner of the Lambda page) and copy it. In the Developer Portal, under the 'Configuration' option, you'll see a space to enter it.

[

![](images/p303-1024x451.png)



](http://aparker-io.preview-domain.com/wp-content/uploads/2022/09/p303-1024x451.png)

With that, you're pretty much done! You should be able to go into the test tab, send a sample request, and see the appropriate response. You should also be able to query an Echo device on your developer account with one of your intents and have it respond to you.

[

![](images/p304-1024x926.png)



](http://aparker-io.preview-domain.com/wp-content/uploads/2022/09/p304-1024x926.png)

### Wrapping Up

This is, of course, a pretty simple example - we didn't implement a lot of sorting, filtering, or other conversational options on our data. Once I have time, I plan to add more information to the data from our internal systems, so that users can get more details (such as what tests passed or failed) and have conversations with the skill (rather than having it simply read out a list of items). However, I hope that you'll take the ideas and samples in this series and use it to build something amazing for your team! If you've got any questions or want to share some cool stuff you've built with Alexa, you can find me on Twitter [@austinlparker](https://twitter.com/austinlparker) or via e-mail austin@apprenda.com.
