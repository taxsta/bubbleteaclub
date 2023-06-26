$(document).ready(function(){
  $(document).on("click", ".modal-variant-options", function(){
    $(this).parent('.custom-select-wrapper').next("product-form").show();
      var varvalue=$(this).find('.custom-options .selection').attr("data-value");
      var dataSrc= $(this).find('.custom-options .selection').attr("data-src");
      if(dataSrc){
        $(this).closest(".grid__item").find('.card__media img').attr("srcset",dataSrc);
        $(this).closest(".grid__item").find('.card__media img').attr("src",dataSrc);
      }
      
      $(this).parent('.custom-select-wrapper').next("product-form").find(".form-id-change").val(varvalue);
  });
 $(".custom-select").each(function() {
    var classes = $(this).attr("class"),
        id      = $(this).attr("id"),
        name    = $(this).attr("name");
    var template =  '<div class="' + classes + '">';
        template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="custom-options">';
   if($(this).attr("data-src") == "undefined"){
     $(this).find("option").each(function() {
            template += '<span class="custom-option" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
   } else {
     $(this).find("option").each(function() {
            template += '<span class="custom-option" data-value="' + $(this).attr("value") + '" data-src="'+$(this).attr("data-src")+'">' + $(this).html() + '</span>';
        });
   }
        
    template += '</div></div>';
    
    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
});
$(".custom-option:first-of-type").hover(function() {
    $(this).parents(".custom-options").addClass("option-hover");
}, function() {
    $(this).parents(".custom-options").removeClass("option-hover");
});
$(".custom-select-trigger").on("click", function() {
    $('html').one('click',function() {
        $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    
    event.stopPropagation();
});
$(".custom-option").on("click", function() {
    if($(this).attr("data-src") == "undefined"){
      $(this).removeAttr("data-src");
    }
    $(this).parents(".custom-select").addClass("bg-black");
    $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
});
});