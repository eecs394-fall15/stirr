# Read more about app structure at http://docs.appgyver.com

module.exports =

  rootView:
    location: "stirr#home"

  preloads: [
  	{
  		id: "view-dishes"
  		location: "stirr#view"
  	}
  	{
  		id: "edit-dishes"
  		location: "stirr#edit"
  	}
  ]
