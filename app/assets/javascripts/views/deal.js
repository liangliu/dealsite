App.Views.Deals = Backbone.View.extend({
  el: '.deals',

  render: function(){
    var _this = this
    this.$el.empty()
    this.collection.fetch({
      success: function(dealsData){
        dealsData.each(function(deal){
          var dealView = new App.Views.Deal()
          var data = {deal: deal.attributes}
          dealView.isotopeRender(data)
        })
      }
    })
    return this
  }

})


App.Views.Deal = Backbone.View.extend({
  el: '.deals',

  render: function(options){
    var _this = this
    this.model = new App.Models.Deal({id: options.id})
    this.model.fetch({
      success: function(deal){
        var data = {deal: deal.attributes}
        _this.$el.html(template('single-deal-template', data))
      }
    })
    return this
  },

  isotopeRender: function(deal){
    var singleDeal = template('single-deal-template', deal)
    this.$el.isotope('insert', $(singleDeal) )
  }

})

App.Views.SubmitDealForm = Backbone.View.extend({
    el: "#dialog-form",

    events: {
      'submit .deal-submit-form' : 'submitDeal',
      'submit .deal-edit-form' : 'updateDeal'
    },
    //try to use this for create and update
    submitDeal: function(event){
      event.preventDefault()
      var data = $(event.currentTarget).serializeObject()
      var dealData = {
        title: data["deal[title]"],
        body: data["deal[body]"],
        source: data["deal[source]"]
      }
      var deal = new App.Models.Deal()
      deal.save(dealData, {
        success: function(deal){
          console.log(deal)
          alert("Deal submitted!")
          $("#dialog-form").dialog('close')
        }
      })
    },

    editFormRender: function(options){
      this.deal = new App.Models.Deal({id: options.id})
      this.deal.fetch({
        success: function(deal){
          var dealData = deal.attributes
          $('.dummy-div').html(template("edit-deal-form", {deal: dealData}))
        }
      })
    },

    updateDeal: function(event){
      console.log("HEEEHRHERHEs")
      event.preventDefault()
      var dealData = $(event.currentTarget).serializeObject()
      console.log(dealData.id)
      // var deal = new App.Models.Deal()
      // deal.save(dealData, {
      //   success: function(deal){
      //     console.log(deal.id)
      //   }
      // })
    }
  })
