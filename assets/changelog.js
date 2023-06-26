// Changelog
1. Updated Recipe page
  In this version, I solve the problem that the buttons in "Our Top Ten" will overflow the block they are in.

  What I have done:
  1. create a new css file named Assets/main-recipes.css to define the css in Sections/main-recipe-collection.liquid
  2. update the css in class ".main-recipe-top-ten-grid-card-tag-container".
    

2. Add the collection sugar-free
  In this version, I add a new collection named suager-free(Templates/collection.sugar-free.json) and to implement this collection, 
  I also add a new section Sections/suagr-free-carousel.liquid

  What I have done:
  1. Despite the two files I mentioned above, I also add some custom css and javascript in Customize theme to make the layout more reasonalbe.


3. Make a new design for products brown-sugar/milk-tea/fruit-tea
  In this version, I make a totally new design page for these three products by creating some new sections

  What I have done:
  1. create a new section main-product-new.liquid to show the new design product inforamtion page for these three products.
  2. create a new section product-details-show.liquid to show detail information(Description&&Nutrition information temp in metafields), Nutrition information temp is a new metafield.
  3. Updata section apps.liquid, now we can set background of apps on specfic pages.
  4. create a new section image-as-background.liquid to show a big image with full page width blew product detail information.
  5. create a new section mobile-icons-down.liquid to show the last three icons only on the mobile page.
  6. create a new section image-text-mobile-icons.liquid to fixed blew product recommandation.

4. Make wave animation in announcement-bar, footer and some places in new design product pages (brown-suagr/fruit-tea/milk-tea)
  What I have done:
  1. create a new js file Assets/wave-calculate.js to calculate all waves on the page except waves on announcement-bar
  2. create a new section wave_animation.liquid 
