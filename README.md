Epoxy Proxy
===========

[![Build Status](https://travis-ci.org/oronbz/epoxy.svg?branch=master)](https://travis-ci.org/oronbz/epoxy)

Quick Usage Guide
=================
`git clone https://github.com/oronbz/epoxy`

`cd epoxy`

`npm install`

`node server.js`


Example Urls
============

`http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/appended`

`http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/appended?errors=replace&timeout=300`
 
`http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/combined?errors=fail_any&timeout=2000`
 


Introduction
============

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


GET http://epoxy.com/fetch/[base64]/combined?errors=[fail_any]&timeout=300

1. This request will fetch a base64 encoded JSON array of URLs.
2. It will combine requests
3. It will timeout with a 300ms timeout
4. It will fail if any of the resource services fail


GET http://epoxy.com/fetch/[base64]/appended?errors=[replace]

1. This request will fetch a base64 encoded JSON array of URLs.
2. It will append requests
3. It will NOT timeout
4. It will replace any error response from resource services with "failed"
