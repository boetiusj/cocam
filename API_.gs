// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - todo
/* jshint asi: true */
/* jshint esversion: 6 */

(function() {"use strict"})()

// API_.gs
// =======
//

var API_ = (function(ns) {
 
  let token = null
  let rootUrl = null
  
  ns.init = function(config) {
    if (!config) config = {}
    token = config.token ? config.token : DEFAULT_API_TOKEN_
    rootUrl = config.rootUrl ? config.rootUrl : DEFAULT_ROOT_URL_
    return this
  }

  ns.get      = function(endpoint)          {return get(endpoint)}
  ns.post     = function(endpoint, payload) {return post(endpoint, payload)}
  ns.put      = function(endpoint, payload) {return put(endpoint, payload)}
  ns.hsDelete = function(endpoint)          {return hsDelete(endpoint)}

  return ns
  
  // Private Functions
  // -----------------

  function get(endpoint) {
    return fetch({rootUrl: rootUrl, endpoint: endpoint})
  }

  function post(endpoint, payload) {
    return fetch({rootUrl: rootUrl, endpoint: endpoint, payload: payload, method: 'post'})
  }
  
  function put(endpoint, payload) { 
    return fetch({rootUrl: rootUrl, endpoint: endpoint, payload: payload, method: 'put'})
  }

  function hsDelete(endpoint) {
    return fetch({rootUrl: rootUrl, endpoint: endpoint, method: 'delete'})
  }

  function fetch(config) {

    if (config.endpoint === undefined) {
      throw new Error('No endpoint')
    }

    var options = {
      headers: getHeaders(),
      muteHttpExceptions: true,
      contentType: 'application/json',
      method: config.method
    }

    if ((config.method === 'post' || config.method === 'put') && config.payload !== undefined) {
      options.payload = JSON.stringify(config.payload)
      console.log('payload', options.payload)
    }

    if (!rootUrl) rootUrl = DEFAULT_ROOT_URL_

    var url = rootUrl + encodeURI(config.endpoint)
    console.log(url)
    var response = UrlFetchApp.fetch(url, options)
    var code = response.getResponseCode()
    var content = response.getContentText()
    
    for (var n = 1; n < NUMBER_OF_FETCH_RETRIES_; n++) {
      
      if (n > 1) {
        console.log ("fetch try number " + n)
      }
      
      switch(code) {
          
        case 200:
        case 201:
          content = JSON.parse(content)
          console.log('content', content)
          return content
          
        case 204:
          // Some methods return 204 with empty content
          if (content) {
            console.log('Bulk change complete')
            return JSON.parse(content)
          } else {
            console.log('Received code 204 with no content.')
            return
          }
          break
          
        case 400:        
          throw new Error('User error: ' + content)
          
        case 401:
          throw new Error('Not authorised')
          
        case 404: 
          throw new Error('Resource not found. Config: ' + JSON.stringify(config))
  
        case 409: 
          throw new Error('This resource already exists')
          
        // case 429:
        //   console.warn('429 error: ' + content)
        //   policyName = JSON.parse(content).policyName
          
        //   if (policyName === 'BURST') {
        //     // Too many calls in one second, fall through al try in a bit
        //     break
        //   } else if (policyName === 'DAILY') {
        //     throw new Error('Too many calls for today, try again tomorrow')
        //   } else {
        //     throw new Error('Unexpected 429 policyName')
        //   }

        case 500:
          console.warn('500 error on try ' + n + ': ' + content)
          // Try again.
          break 

        case 503:
          console.warn('503 error on try ' + n + ': ' + content)
          // Try again.
          break 

        default:
          var message = 'Error: ' + code + ' on try ' + n + ', "' + content + '"'
          console.error(message)
          throw new Error(message)
      }
      
      Utilities.sleep((Math.pow(2, n) * 2000) + (Math.round(Math.random() * 1000)))
      response = UrlFetchApp.fetch(config.rootUrl + config.endpoint, options)
      code = response.getResponseCode()
      content = response.getContentText()
    }
    
    throw new Error("Gave up after " + n + " tries: " + JSON.stringify(config))
    return

    // Private Functions
    // -----------------
    
    function getHeaders() {
      if (!token) token = DEFAULT_API_TOKEN_
      return {
        Authorization: `Bearer ${token}`,
      }
    }
    
  } // UrlFetch_.fetch()

})(API_ || {})
