{% load staticfiles %}
{# Shared between PQ and MSE #}

<script type="text/javascript" 
	src="https://maps.google.com/maps/api/js?sensor=false&v=3.8">
</script>
<script type="text/javascript">
var map_params = {
	fusionTableId: "{{ resource_object.fusion_table_id }}",
	voyageid: "{{ resource_object.voyageid }}",
	map_type: "{{ resource_object.map_type }}",
	init_location: ["{{ resource_object.init_lat }}", "{{ resource_object.init_long }}", {{ resource_object.init_zoom }} ],
	short_name: '{{ resource_object.short_name }}',
	// the following used only for voyage maps
	log_link_type: '{{ resource_object.log_link_type }}',
	start_date: '{{ resource_object.start_date }}',
	layerYears: [
	{% for item in resource_object.logyear_set.all %}
		"{{item.year}}"{% if not forloop.last %}, {% endif %}		    
	{% endfor %}						
	]
}
</script>

<!-- <script type="text/javascript" src="{% static 'js/olcmap.js' %}"></script> -->
<script type="text/javascript" src="{% static 'js/msemap.js' %}"></script>
