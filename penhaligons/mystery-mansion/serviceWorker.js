var cacheName = 'mansion';
var filesToCache = [
  '/',
  '/index.html',
  '/anim.js',
  '/app.css',
  '/app.js',
  '/mansion.js',
  '/vendor.js',
  '/sound/soundtrack.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/utils/Draggable.min.js',
  'https://ajax.googleapis.com/ajax/libs/threejs/r84/three.min.js'
];

self.addEventListener( 'install', function ( e ) {
  console.log( '[serviceWorker] Install' );
  e.waitUntil(
    caches.open( cacheName )
    .then( function ( cache ) {
      // console.log('[serviceWorker] Caching app shell', cache);
      // We won't be updating the files once live so, no need to worry about the addAll() pitfalls
      return cache.addAll( filesToCache );
    } )
  )
} );


self.addEventListener( 'fetch', function ( e ) {
  // console.log('[serviceWorker] fetching', e.request.url);
  e.respondWith(
    caches.match( e.request )
    .then( function ( response ) {
      // console.log('Cache hit, return response');
      if ( response ) {
        return response;
      }

      /*
       *   IMPORTANT: Clone the request. A request is a stream and
       *   can only be consumed once. Since we are consuming this
       *   once by cache and once by the browser for fetch, we need
       *   to clone the response.
       */
      var fetchRequest = e.request.clone();

      return fetch( fetchRequest )
        .then(
          function ( response ) {
            // console.log('serviceWorker', response);
            // Check if we received a valid response
            if ( !response || response.status !== 200 || response.type !== 'basic' ) {
              return response;
            }

            /*
             *   IMPORTANT: Clone the response. A response is a stream and
             *   because we want the browser to consume the response
             *   as well as the cache consuming the response, we need to
             *   clone it so we have two streams.
             */
            var responseToCache = response.clone();

            caches.open( cacheName )
              .then( function ( cache ) {
                cache.put( e.request, responseToCache );
              } )

            return response;
          }
        )
        .catch( function ( err ) {
          // console.log('[serviceWorker] error', err);
        } )
    } )
  )
} );
