var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'deals/:id': 'dealpage',
    'edit/deals/:id': 'editDeal'
  }
})
