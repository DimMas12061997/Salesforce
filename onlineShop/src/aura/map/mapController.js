({
	jsLoaded: function(component, event, helper) {
		var map = L.map('map', {zoomControl: true})
		.setView([53.90575306829494, 27.561219446361065], 13);
		L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
			{
				attribution: '©2017 Google - Картографические данные © 2017 Google'
			}).addTo(map);
		L.marker([53.92787689999999, 27.62767550000001]).bindPopup("Prosport").addTo(map);
		component.set("v.map", map);
	}
})