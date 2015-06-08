Epoxy Proxy
===========

For mobile clients (and networks), multiple requests cost a lot of CPU time, data, and battery.

Epoxy is a reverse proxy, that should take off the load from any given mobile client. Given the
correct instruction, Epoxy will perform requests to various endpoints (named "Resource Services" here)
and aggregate their results.

The client should receive the set of results, from all of the services that Epoxy have made requests for.


In narrative form:

= Today =:

1. Client: facebook.com/me
 -> Facebook: <facebook_results>
2. Client: twitter.com/foobar
 -> Twitter: <twitter_results>
3. Client: twitter.com/about
 -> Twitter: <twitter_results>
4. Client: mashes up the results

The client performed 3 requests.


= Tomorrow (what we want) using Epoxy =:

1. Client: epoxy.com/< fetch results from facebook, twitter/foobar, twitter/about  >
 -- Epoxy performs background fetches, in parallel, fast --
2. Epoxy: <results for: facebook, twitter/foobar, twitter/about>

The client performed 1 request (most of the heavy lifting was done by Epoxy server-to-server).




                                     +------------+
                             ,------>| s1/foo/bar |
                             |       +------------+
                             |
                             |       +------------+
    +-------+     +--------+ | ,---->| s2/bar/baz |
    |       |     |        |-' |     +------------+
    | phone |---->| Epoxy  |---'
    |       |     |        |-,       +------------+
    +-------+     +--------+ '------>| s3/quux    |
                                     +------------+




Resource Services Response
==========================

Each resource service will return a bag of data in *one* of the following formats:

* JSON
* XML

Each resource service can also return an error.



Result Aggregation Strategy
===========================

Epoxy supports 2 methods of aggregation (that is, after fetching results from the various services,
how do you want to return them).

1. combined - mash up all objects. Example (psuedo code):

  combined({ a:1 }, { b:2 }) --> { a:1, b:2 }

2. appended - return an array of all results

  appended({ a:1 }, { b:2 }) --> [{ a:1 }, { b:2 }]


Error Handling
==============

Epoxy supports 2 methods of error handling

1. Fail if any - just fail the entire request if one or more of the resource service failed
2. Replace failure with "failed" - if a resource service failed, make the response simply the word "failed"


Epoxy Interface
===============

Epoxy will need to fetch URLs based on a given list of specified URLs.
These will be a JSON array, and base64 encoded.


Example requests:


GET http://epoxy.com/fetch/<base64>/combined?errors=[fail_any]&timeout=300

1. This request will fetch a base64 encoded JSON array of URLs.
2. It will combine requests
3. It will timeout with a 300ms timeout
4. It will fail if any of the resource services fail


GET http://epoxy.com/fetch/<base64>/appended?errors=[replace]

1. This request will fetch a base64 encoded JSON array of URLs.
2. It will append requests
3. It will NOT timeout
4. It will replace any error response from resource services with "failed"


Resource Service Endpoints
==========================

You will use the following as resource services:

0. https://safe-inlet-8105.herokuapp.com -- you are looking at it. do not use it.


1. https://safe-inlet-8105.herokuapp.com/payments
2. https://safe-inlet-8105.herokuapp.com/plans
3. https://safe-inlet-8105.herokuapp.com/payout  (note: may fail from time to time)
4. https://safe-inlet-8105.herokuapp.com/feed    (note: may be slow from time to time)



Submission
==========

Scope:

* The service should be around 50-100 LOC (using a reasonable amount of libraries).
* The amount of time invested should not be more than 3-4 hours

If you find yourself going beyond this scope, reconsider your approach, or contact us
for assistance and direction.


Concerns:

* Your service should auto detect content types and parse them
* Your service should merge results based on selected strategy
* The service's interface should be meaningful, aesthetic, and you should be able
  to reason about it (concerns such as CDN, caching, REST, API)
* Your design should be generic enough where it matters (hint: content types) but
  still simple and pragmatic (no over engineering!)
* You are free (and encouraged) to use any 3rd party library that makes things
  happen for you


You are free to submit your working Epoxy Proxy in ANY of these tech stacks:

* JVM - Java (no J2EE please)
* JVM - Clojure  [[Bonus!]]
* .NET
* Ruby           [[Event Machine - Bonus!]]
* Node.js        [[Bonus!]]
* Go             [[Bonus!]]


Please submit:

* Your results (zip with source, or bitbucket/github repo) to dotan@como.com
* Any engineering reasoning and assumption you made while building it


Good luck!
