(function(){
	
	$(document).ready(function() {
		$('button[data-action]').click(function(){
			$.ajax({
				url: '/post/new',
				type: 'post',
				success: function(result){
					alert(result);
				}
			});
		});
	});

}());