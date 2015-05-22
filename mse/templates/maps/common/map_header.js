{% load staticfiles %}

<script type="text/javascript" 
	src="http://maps.google.com/maps/api/js?sensor=false&v=3.8">
</script>
<script type="text/javascript">
var map_params = {
	fusionTableId: "{{ resource_object.fusion_table_id }}",
	map_type: "{{ resource_object.map_type }}",
	init_location: ["{{ resource_object.init_lat }}", "{{ resource_object.init_long }}", {{ resource_object.init_zoom }} ],
	short_name: '{{ resource_object.short_name }}',
	// the following used only for voyage maps
	log_link_type: {{ resource_object.log_link_type }},
	layerYears: [
	{% for item in resource_object.logyear_set.all %}
		"{{item.year}}"{% if not forloop.last %}, {% endif %}		    
	{% endfor %}						
	]
}
</script>

<script type="text/javascript" src="{% static 'map_assets/olcmap.js' %}"></script>
