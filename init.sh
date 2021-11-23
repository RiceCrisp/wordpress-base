#!/bin/sh

alias wp='docker-compose run --rm wpcli wp'

### Install WordPress
wp core install --url="http://localhost" --title="${1}" --admin_user="${2}" --admin_email="${3}"
wp user update 1 --user_pass="${4}"
wp option update blogdescription ""


#### Delete all content
wp site empty --uploads --yes
wp widget reset --all


### Setup theme
wp theme activate ws


#### Setup plugins
wp plugin delete hello akismet
wp plugin install resmushit-image-optimizer simple-custom-post-order query-monitor --activate


### Setup media
echo "Creating media..."
for i in {1..3}; do
  wp media import $(curl -Ls -o /dev/null -w %{url_effective} "https://picsum.photos/1600/800") --title="Wide Placeholder ${i}" --alt="Placeholder Image" --caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
done
for i in {1..3}; do
  wp media import $(curl -Ls -o /dev/null -w %{url_effective} "https://picsum.photos/800/800") --title="Square Placeholder ${i}" --alt="Placeholder Image" --caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
done


### Setup SVG's
wp option update svgs --format=json '[
{
  "uid": "00000000",
  "id": "mail",
  "title": "Mail",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z\"/>"
},
{
  "uid": "00000001",
  "id": "download",
  "title": "Download",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z\"/>"
},
{
  "uid": "00000002",
  "id": "linkedin",
  "title": "LinkedIn",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z\"/>"
},
{
  "uid": "00000003",
  "id": "twitter",
  "title": "Twitter",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z\"/>"
},
{
  "uid": "00000004",
  "id": "facebook",
  "title": "Facebook",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z\"/>"
},
{
  "uid": "00000005",
  "id": "instagram",
  "title": "Instagram",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z\"/>"
},
{
  "uid": "00000006",
  "id": "youtube",
  "title": "YouTube",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z\"/>"
},
{
  "uid": "00000007",
  "id": "search",
  "title": "Search",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z\"/>"
},
{
  "uid": "00000008",
  "id": "caret-up",
  "title": "Caret Up",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M23.9,17.1L22.1,19L12,8.7L1.9,19l-1.8-1.8L12,5L23.9,17.1z\"/>"
},
{
  "uid": "00000009",
  "id": "caret-right",
  "title": "Caret Right",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M6.9,23.9L5,22.1L15.3,12L5,1.9l1.8-1.8L19,12L6.9,23.9z\"/>"
},
{
  "uid": "00000010",
  "id": "caret-down",
  "title": "Caret Down",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M0.1,6.9L1.9,5L12,15.3L22.1,5l1.8,1.8L12,19L0.1,6.9z\"/>"
},
{
  "uid": "00000011",
  "id": "caret-left",
  "title": "Caret Left",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M17.1,0.1L19,1.9L8.7,12L19,22.1l-1.8,1.8L5,12L17.1,0.1z\"/>"
},
{
  "uid": "00000012",
  "id": "checkmark",
  "title": "Checkmark",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.25 8.891l-1.421-1.409-6.105 6.218-3.078-2.937-1.396 1.436 4.5 4.319 7.5-7.627z\"/>"
},
{
  "uid": "00000013",
  "id": "close",
  "title": "Close",
  "viewbox": "0 0 24 24",
  "path": "<path d=\"M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 15.538l-3.592-3.548 3.546-3.587-1.416-1.403-3.545 3.589-3.588-3.543-1.405 1.405 3.593 3.552-3.547 3.592 1.405 1.405 3.555-3.596 3.591 3.55 1.403-1.416z\"/>"
}
]'


### Setup terms
echo "Creating terms..."
wp term generate category --count=5
wp term create resource_type "White Paper"
wp term create resource_type "Tip Sheet"
wp term create resource_type "Infographic"
wp term create resource_type "eBook"
wp term create resource_type "Video"
wp term create news_type "News"
wp term create news_type "Press Release"


### Setup pages
echo "Creating pages..."
# Top level pages
pages=("Home" "Solutions" "Industries" "Resource Center" "About" "Contact Us" "Privacy Policy")
for page in "${pages[@]}"; do
  wp post create --post_type=page --post_status=publish --post_title="${page}"
done
wp option update show_on_front page
wp option update page_on_front $(wp post list --post_type=page --name=home --field=ID)
wp option update wp_page_for_privacy_policy $(wp post list --post_type=page --name=privacy-policy --field=ID)
# Child pages
industriesId=$(wp post list --post_type=page --name=industries --field=ID)
industries=("Automotive" "Construction" "Education" "Healthcare")
for industry in "${industries[@]}"; do
  wp post create --post_type=page --post_status=publish --post_title="${industry}" --post_parent=$industriesId
done


### Setup posts (10 generic and 1 for block testing)
echo "Creating posts..."
wideImageUrl=$(wp post list --post_type=attachment --name=wide-placeholder-1 --field=guid)
wideImageId=$(wp post list --post_type=attachment --name=wide-placeholder-1 --field=ID)
squareImageUrl=$(wp post list --post_type=attachment --name=square-placeholder-1 --field=guid | sed "s/.jpg/-256x256.jpg/g")
curl -N "https://loripsum.net/api/10/medium/link/ol/ul/" | wp post generate --count=10 --post_content --format=ids | xargs -n 1 -I % docker-compose run --rm wpcli post meta update % _thumbnail_id ${wideImageId//$'\r'}
wp post create --post_status=publish --post_title="Block Testing Post" --post_content="<!-- wp:heading -->
<h2>Lorem ipsum dolor sit amet consectetur adipiscing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li><li><strong>Lorem ipsum</strong> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua<ul><li><em>Lorem ipsum </em>dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li><li><strong><em>Lorem ipsum</em></strong> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li></ul></li><li><a href=\"#\">Lorem ipsum</a> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li></ul>
<!-- /wp:list -->

<!-- wp:heading {\"level\":3} -->
<h3>Lorem ipsum dolor sit amet consectetur adipiscing</h3>
<!-- /wp:heading -->

<!-- wp:list {\"ordered\":true} -->
<ol><li>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li><li><strong>Lorem ipsum</strong> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua<ol><li><em>Lorem ipsum </em>dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li><li><strong><em>Lorem ipsum</em></strong> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li></ol></li><li><a href=\"#\">Lorem ipsum</a> dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li></ol>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class=\"wp-block-buttons\"><!-- wp:button -->
<div class=\"wp-block-button\"><a class=\"wp-block-button__link\">Button One</a></div>
<!-- /wp:button -->

<!-- wp:button {\"className\":\"is-style-alt\"} -->
<div class=\"wp-block-button is-style-alt\"><a class=\"wp-block-button__link\">Button Two</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:heading {\"level\":4} -->
<h4>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <a href=\"#\">Duis aute irure</a> dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class=\"wp-block-buttons\"><!-- wp:button {\"className\":\"is-style-arrow\"} -->
<div class=\"wp-block-button is-style-arrow\"><a class=\"wp-block-button__link\">Button Three</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:image {\"id\":1,\"sizeSlug\":\"full\"} -->
<figure class=\"wp-block-image size-full\"><img src=\"${wideImageUrl}\" alt=\"Placeholder Image\" class=\"wp-image-1\"/><figcaption>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</figcaption></figure>
<!-- /wp:image -->

<!-- wp:heading {\"level\":3} -->
<h3>Lorem ipsum dolor sit amet consectetur adipiscing</h3>
<!-- /wp:heading -->

<!-- wp:quote -->
<blockquote class=\"wp-block-quote\"><p>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\"</p><cite>- Citation</cite></blockquote>
<!-- /wp:quote -->

<!-- wp:image {\"align\":\"left\",\"id\":4,\"sizeSlug\":\"small\"} -->
<div class=\"wp-block-image\"><figure class=\"alignleft size-small\"><img src=\"${squareImageUrl}\" alt=\"Placeholder Image\" class=\"wp-image-4\"/></figure></div>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class=\"wp-block-separator\"/>
<!-- /wp:separator -->

<!-- wp:image {\"align\":\"right\",\"id\":4,\"sizeSlug\":\"small\"} -->
<div class=\"wp-block-image\"><figure class=\"alignright size-small\"><img src=\"${squareImageUrl}\" alt=\"Placeholder Image\" class=\"wp-image-4\"/></figure></div>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>Lorem ipsum dolor sit amet consectetur adipiscing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->

<!-- wp:table {\"className\":\"is-style-regular\"} -->
<figure class=\"wp-block-table is-style-regular\"><table><thead><tr><th>Lorem Ipsum Dolor Sit</th><th class=\"has-text-align-center\" data-align=\"center\">Lorem</th><th class=\"has-text-align-right\" data-align=\"right\">Ipsum</th></tr></thead><tbody><tr><td>Lorem ipsum dolor sit</td><td class=\"has-text-align-center\" data-align=\"center\">False</td><td class=\"has-text-align-right\" data-align=\"right\">0.00</td></tr><tr><td>Lorem ipsum dolor sit</td><td class=\"has-text-align-center\" data-align=\"center\">False</td><td class=\"has-text-align-right\" data-align=\"right\">0.99</td></tr><tr><td>Lorem ipsum dolor sit</td><td class=\"has-text-align-center\" data-align=\"center\">True</td><td class=\"has-text-align-right\" data-align=\"right\">10.00</td></tr><tr><td>Lorem ipsum dolor sit</td><td class=\"has-text-align-center\" data-align=\"center\">True</td><td class=\"has-text-align-right\" data-align=\"right\">10.99</td></tr><tr><td>Lorem ipsum dolor sit</td><td class=\"has-text-align-center\" data-align=\"center\">False</td><td class=\"has-text-align-right\" data-align=\"right\">100.00</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:code -->
<pre class=\"wp-block-code\"><code>&lt;html>
  &lt;head>
    &lt;title>Lorem Ipsum&lt;/title>
  &lt;/head>
  &lt;body>
    &lt;div class=\"my-div\">
      Dolor sit amet
    &lt;/div>
  &lt;/body>
&lt;/html></code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->

<!-- wp:pullquote -->
<figure class=\"wp-block-pullquote\"><blockquote><p>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\"</p><cite>Citation</cite></blockquote></figure>
<!-- /wp:pullquote -->"


### Setup custom post types
echo "Creating custom post types..."
content=$(curl -N "https://loripsum.net/api/10/medium/link/ol/ul/")
wp post create --post_type=resource --post_status=publish --post_title="Resource 1" --post_content="$content" --porcelain | xargs -I % docker-compose run --rm wpcli post term set % resource_type white-paper
wp post create --post_type=resource --post_status=publish --post_title="Resource 2" --post_content="$content" --porcelain | xargs -I % docker-compose run --rm wpcli post term set % resource_type tip-sheet
wp post create --post_type=resource --post_status=publish --post_title="Resource 3" --post_content="$content" --porcelain | xargs -I % docker-compose run --rm wpcli post term set % resource_type infographic
wp post create --post_type=resource --post_status=publish --post_title="Resource 4" --post_content="$content" --porcelain | xargs -I % docker-compose run --rm wpcli post term set % resource_type ebook
wp post create --post_type=resource --post_status=publish --post_title="Resource 5" --post_content="$content" --porcelain | xargs -I % docker-compose run --rm wpcli post term set % resource_type video


### Setup menus
echo "Creating menus..."
# Primary menu
wp menu create "Primary Menu"
wp menu location assign primary-menu header-primary
# Top level items
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Solutions" --field=ID)
industriesMenuId=$(wp menu item add-post primary-menu $industriesId --porcelain)
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Resource Center" --field=ID)
wp menu item add-post primary-menu $(wp post list --post_type=page --title="About" --field=ID)
# Second level items
wp menu item add-custom primary-menu "Manufacturing" "#custom_heading" --parent-id=$industriesMenuId
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Automotive" --field=ID) --parent-id=$industriesMenuId
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Construction" --field=ID) --parent-id=$industriesMenuId
wp menu item add-custom primary-menu "Services" "#custom_heading" --parent-id=$industriesMenuId --parent-id=$industriesMenuId
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Education" --field=ID) --parent-id=$industriesMenuId
wp menu item add-post primary-menu $(wp post list --post_type=page --title="Healthcare" --field=ID) --parent-id=$industriesMenuId
# Secondary menu
wp menu create "Secondary Menu"
wp menu location assign secondary-menu header-secondary
wp menu item add-custom secondary-menu "Search" "#custom_search"
wp menu item add-post secondary-menu $(wp post list --post_type=page --title="Contact Us" --field=ID)
# Footer menu
footerMenuId=$(wp menu create "Footer Menu" --porcelain)
wp menu item add-post footer-menu $(wp post list --post_type=page --title="Solutions" --field=ID)
industriesMenuId=$(wp menu item add-post footer-menu $industriesId --porcelain)
wp menu item add-post footer-menu $(wp post list --post_type=page --title="Resource Center" --field=ID)
wp menu item add-post footer-menu $(wp post list --post_type=page --title="About" --field=ID)
wp menu item add-post footer-menu $(wp post list --post_type=page --title="Contact Us" --field=ID)
# Legal menu
legalMenuId=$(wp menu create "Legal Menu" --porcelain)
wp menu item add-post legal-menu $(wp post list --post_type=page --title="Privacy Policy" --field=ID)


### Setup widgets
echo "Creating widgets..."
wp widget add nav_menu footer 1 --nav_menu=$footerMenuId
wp widget add text footer 2 --text=$'[logo]\r\n[address]\r\n[search]' --visual=true
wp widget add nav_menu sub-footer 1 --nav_menu=$legalMenuId
wp widget add text sub-footer 2 --text="Copyright [year]"

### Set permalinks
wp rewrite structure '/%postname%/'
wp rewrite flush
