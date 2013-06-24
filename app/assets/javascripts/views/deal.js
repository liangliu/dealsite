/*
|--------------------------------------------------------------------------
| All Deals View
|--------------------------------------------------------------------------
*/

App.Views.Deals = Backbone.View.extend({
  el: '.deals'

  ,events: {
    "mouseenter .item" : "toggleLinkIcon",
    "mouseleave .item" : "toggleLinkIcon",
  }

  ,initialize: function() {
    $(".deals").isotope({
      itemSelector : '.item',
      layoutMode : 'masonry'
    });
  }

  ,render: function(){
    var _this = this
    this.$el.empty()
    this.collection.fetch({
      success: function(dealsData){
        _this.addAllDeals(dealsData).initLoad()
      }
    })
    return this
  }

  ,addAllDeals: function(data){
    data.each(function(deal){
      var dealView = new App.Views.Deal()
      var data = {deal: deal.attributes}
      dealView.isotopeRender(data)
    })
    return this
  }

  ,initLoad: function() {
    this.$el.imagesLoaded( function(){
      $('#ajax-loader').css({"visibility": "hidden"})
      $('.deals').isotope('reLayout')
      $('.deals').css({"visibility": "visible"})
    })
  }

  ,toggleLinkIcon: function(event){
    $(event.currentTarget).find(".external_link")
                          .css({"visibility" : event.type === "mouseenter" ? "visible": "hidden"})
  }
})

/*
|--------------------------------------------------------------------------
| Single Deal View
|--------------------------------------------------------------------------
*/

App.Views.Deal = Backbone.View.extend({
  el: '.deals',

  render: function(options){
    var _this = this
    this.model = new App.Models.Deal({id: options.id})
    this.model.fetch({
      success: function(deal){
        $('#ajax-loader').css({"visibility": "hidden"})
        var data = {deal: deal.attributes}
        _this.$el.html(template('single-deal-template', data))
        $('.deals').css({"visibility": "visible"})
      }
    })
    return this
  },

  isotopeRender: function(data){
    var singleDeal = template('single-deal-template', data)
    $('.deals').isotope( 'insert', $(singleDeal))
  }

})

/*
|--------------------------------------------------------------------------
| Submit Deal View
|--------------------------------------------------------------------------
*/
App.Views.SubmitDealForm = Backbone.View.extend({
    el: '.slider',

    events: {
      'submit .deal-submit-form' : "submit",
      'click #cancel' : "cancel"
    },

    submit: function(event) {
      event.preventDefault()
      var dealData = $(event.currentTarget).serializeObject()
      var deal = new App.Models.Deal()
      deal.save(dealData, {
        success: function(savedDeal) {
          console.log(savedDeal.attributes)
          alert("Succeesssss!")
          $('.slider').slideUp('slow')

        }
      })

    },

    cancel: function(event) {
      _this = this
      this.$el.slideUp("slow", function(){
        _this.$el.html('')
      })
    },

    render: function() {
      this.$el.html(Mustache.render($("#submit-deal-form").html()))
      this.$el.slideDown("slow")
    }
  })

/*
|--------------------------------------------------------------------------
| Edit Deal View
|--------------------------------------------------------------------------
*/

App.Views.EditDealForm = Backbone.View.extend({
  el: '.dummy-div'

  ,events: {
    'submit .deal-edit-form' : 'updateDeal',
    'click .delete-deal-button' : 'deleteDeal'
  }

  ,render: function(options){
    var _this = this
    this.deal = new App.Models.Deal({id: options.id})
    this.deal.fetch({
      success: function(deal){
         $('#ajax-loader').css({"visibility": "hidden"})
        var dealData = deal.attributes
        _this.$el.html(template("edit-deal-form", {deal: dealData}))
      }
    })
  }

  ,updateDeal: function(event){
    event.preventDefault()
    var _this = this
    var dealData = $(event.currentTarget).serializeObject()
    this.deal.set(dealData)
    this.deal.save(dealData, {
      success: function(deal){
        _this.$el.append("<h1>Your deal has been edited brah</h1>")
      }
    })
  }

  ,deleteDeal: function(){
    event.preventDefault()
    var confirmDelete = confirm("Are you sure you want to delete your deal?")

    if(confirmDelete){
      this.deal.destroy({
        success: function(deletedDeal){
          alert("Deal " + deletedDeal.attributes.title + "has been deleted. Happy megemegadealing!")
          App.router.navigate('', {trigger: true})
        }
      })
    }
  }

})
