---
title: "Parsing Apache2 access logs with the OpenTelemetry Collector"
date: "2024-01-06"
categories: 
  - "opentelemetry"
---

I couldn't find a ton of resources on this, but FYI -- the OpenTelemetry Collector's `filelog` receiver has a pretty robust regex parser built into it. Want to get your access.log files from Apache? Here's the config.

```
  filelog/access:
    include: [ /var/log/apache2/access.log ]
    operators:
      - type: regex_parser
        regex: '(?P<ip>\d{1,3}(?:\.\d{1,3}){3}) - - \[(?P<datetime>[^\]]+)] "(?P<method>\S+) (?P<path>\S+) (?P<protocol>\S+)" (?P<status>\d{3}) (?P<size>\d+) "(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)'
        timestamp:
          parse_from: attributes["datetime"]
          layout: '%d/%b/%Y:%H:%M:%S %z'
        severity:
          parse_from: attributes["status"]
```

The documentation for a lot of this stuff is stuck inside the GitHub repositories for the receiver modules, so be sure to check that out if you're looking for a quick reference.

What if we want to go further and turn our attributes into their appropriate semantic conventions? While there's no explicit log conventions for HTTP servers, the Span ones should work for our purposes.

```
  transform:
    error_mode: ignore
    log_statements:
      - context: log
        statements:
          - replace_all_patterns(attributes, "key", "method",  "http.request.method")
          - replace_all_patterns(attributes, "key", "status",  "http.response.status_code")
          - replace_all_patterns(attributes, "key", "user_agent", "user_agent.original")
          - replace_all_patterns(attributes, "key", "ip", "client.address")
          - replace_all_patterns(attributes, "key", "path", "url.path")
          - delete_key(attributes, "datetime")
          - delete_key(attributes, "size")
```

This should be enough to get started, at least, although there's more you might want to do:

- Add resource attributes for the logical service name (apache, reverse-proxy, etc.)

- Change up your Apache [log format](https://httpd.apache.org/docs/2.4/mod/mod_log_config.html#formats) to get more information like the scheme, or time spent serving the request.
